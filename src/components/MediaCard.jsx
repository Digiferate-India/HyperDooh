// src/pages/dashboard/CVConfiguration.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function CVConfiguration() {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [cameras, setCameras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCamera, setShowAddCamera] = useState(false);

  // New camera form state
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    aws_camera_identifier: '',
  });

  // CV Config state
  const [cvConfigs, setCvConfigs] = useState({});

  // Warning popup state
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState(''); 
  const [warningCameraId, setWarningCameraId] = useState(null);
  const [dontShowAgain, setDontShowAgain] = useState({
    scheduling: false,
    cv: false,
  });

  useEffect(() => {
    fetchScreens();
  }, []);

  useEffect(() => {
    if (selectedScreen) {
      fetchCameras();
    }
  }, [selectedScreen]);

  const fetchScreens = async () => {
    try {
      const { data, error } = await supabase
        .from('screens')
        .select('id, custom_name')
        .order('custom_name');

      if (error) throw error;
      setScreens(data || []);

      if (data && data.length > 0 && !selectedScreen) {
        setSelectedScreen(data[0].id);
      }
    } catch (error) {
      alert('Error fetching screens: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCameras = async () => {
    if (!selectedScreen) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('cameras')
        .select('*, cv_configs(*)')
        .eq('screen_id', selectedScreen)
        .order('name');

      if (error) throw error;
      setCameras(data || []);

      const configs = {};
      data?.forEach((camera) => {
        const config = camera.cv_configs?.[0];
        configs[camera.id] = {
          enable_age: config?.enable_age !== false,
          enable_gender: config?.enable_gender !== false,
          allow_triggers_during_scheduled: config?.allow_triggers_during_scheduled === true,
          enable_cv_triggers: config?.enable_cv_triggers !== false,
        };
      });

      setCvConfigs(configs);
    } catch (error) {
      alert('Error fetching cameras: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCamera = async () => {
    if (!selectedScreen) {
      alert('Please select a screen first');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: camera, error: cameraError } = await supabase
        .from('cameras')
        .insert({
          screen_id: selectedScreen,
          name: newCamera.name,
          location: newCamera.location,
          aws_camera_identifier: newCamera.aws_camera_identifier,
          is_active: true,
        })
        .select()
        .single();

      if (cameraError) throw cameraError;

      setCvConfigs((prev) => ({
        ...prev,
        [camera.id]: {
          enable_age: true,
          enable_gender: true,
          allow_triggers_during_scheduled: false,
          enable_cv_triggers: true,
        },
      }));

      setNewCamera({ name: '', location: '', aws_camera_identifier: '' });
      setShowAddCamera(false);
      fetchCameras();
    } catch (error) {
      alert('Error adding camera: ' + error.message);
    }
  };

  const handleUpdateConfig = async (cameraId) => {
    try {
      const config = cvConfigs[cameraId] || {};
      const camera = cameras.find((c) => c.id === cameraId);
      const existingConfig = camera?.cv_configs?.[0];

      const payload = {
        camera_id: cameraId,
        enable_age: config.enable_age !== false,
        enable_gender: config.enable_gender !== false,
        allow_triggers_during_scheduled: config.allow_triggers_during_scheduled === true,
        enable_cv_triggers: config.enable_cv_triggers !== false,
        updated_at: new Date().toISOString(),
      };

      if (existingConfig) {
        const { error } = await supabase
          .from('cv_configs')
          .update(payload)
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('cv_configs').insert(payload);
        if (error) throw error;
      }

      alert('Configuration saved successfully!');
      fetchCameras();
    } catch (error) {
      alert('Error saving configuration: ' + error.message);
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    if (!window.confirm('Are you sure you want to delete this camera?')) {
      return;
    }

    try {
      const { error } = await supabase.from('cameras').delete().eq('id', cameraId);
      if (error) throw error;
      fetchCameras();
    } catch (error) {
      alert('Error deleting camera: ' + error.message);
    }
  };

  const handleSwitchChange = (cameraId, field, newValue) => {
    const isSchedulingSwitch = field === 'allow_triggers_during_scheduled';
    const isCvSwitch = field === 'enable_cv_triggers';
    
    if (isSchedulingSwitch && newValue === true && !dontShowAgain.scheduling) {
      setWarningType('scheduling');
      setWarningCameraId(cameraId);
      setShowWarning(true);
      return;
    }
    
    if (isCvSwitch && newValue === false && !dontShowAgain.cv) {
      setWarningType('cv');
      setWarningCameraId(cameraId);
      setShowWarning(true);
      return;
    }
    
    applyConfigChange(cameraId, field, newValue);
  };

  const applyConfigChange = (cameraId, field, newValue) => {
    setCvConfigs({
      ...cvConfigs,
      [cameraId]: {
        ...cvConfigs[cameraId],
        [field]: newValue,
      },
    });
  };

  const handleWarningConfirm = () => {
    if (warningCameraId) {
      const field = warningType === 'scheduling' ? 'allow_triggers_during_scheduled' : 'enable_cv_triggers';
      const newValue = warningType === 'scheduling' ? true : false;
      applyConfigChange(warningCameraId, field, newValue);
    }
    setShowWarning(false);
    setWarningCameraId(null);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    setWarningCameraId(null);
  };

  // Switch Component matching your reference image
  const ModernSwitch = ({ isOn, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        isOn ? 'bg-[#00D17E]' : 'bg-[#33334d]'
      }`}
    >
      {/* ON Label (left side) */}
      <span
        className={`absolute left-2.5 text-[10px] font-bold text-white transition-opacity duration-300 ${
          isOn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        ON
      </span>
      
      {/* OFF Label (right side) */}
      <span
        className={`absolute right-2 text-[10px] font-bold text-white transition-opacity duration-300 ${
          isOn ? 'opacity-0' : 'opacity-100'
        }`}
      >
        OFF
      </span>

      {/* The Inset Circle Knob */}
      <span
        className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-[46px]' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (isLoading && !selectedScreen) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-[#f8fafc] text-slate-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">CV Configuration</h1>

        {/* Screen Selection */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Screen</label>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="border border-slate-200 p-3 rounded-xl w-full max-w-md focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 font-medium"
          >
            <option value="">Choose a screen...</option>
            {screens.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.custom_name}
              </option>
            ))}
          </select>
        </div>

        {selectedScreen && (
          <>
            <div className="mb-8">
              <button
                onClick={() => setShowAddCamera(!showAddCamera)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                  showAddCamera 
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                  : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
                }`}
              >
                {showAddCamera ? 'Cancel' : '+ Add Camera'}
              </button>
            </div>

            {showAddCamera && (
              <div className="mb-8 p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-5">New Camera Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Name</label>
                    <input
                      type="text"
                      value={newCamera.name}
                      onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Main Entrance"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Location</label>
                    <input
                      type="text"
                      value={newCamera.location}
                      onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Lobby"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">AWS ID</label>
                    <input
                      type="text"
                      value={newCamera.aws_camera_identifier}
                      onChange={(e) => setNewCamera({ ...newCamera, aws_camera_identifier: e.target.value })}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="cam-001"
                    />
                  </div>
                </div>
                <button onClick={handleAddCamera} className="mt-6 bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
                  Add Camera
                </button>
              </div>
            )}

            <div className="space-y-8">
              {cameras.map((camera) => {
                const config = cvConfigs[camera.id] || {};
                return (
                  <div key={camera.id} className="border border-slate-200 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{camera.name}</h3>
                        <p className="text-sm font-medium text-slate-400 mt-1">
                          {camera.location} • {camera.aws_camera_identifier}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCamera(camera.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Detection Section */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detection Settings</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <label className="flex items-center p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.enable_age !== false}
                              onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_age: e.target.checked } })}
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-bold text-slate-700">Enable Age Detection</span>
                          </label>
                          <label className="flex items-center p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.enable_gender !== false}
                              onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_gender: e.target.checked } })}
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-bold text-slate-700">Enable Gender Detection</span>
                          </label>
                        </div>
                      </div>

                      {/* Trigger Behavior Section */}
                      <div className="space-y-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Trigger Logic</h4>
                        
                        <div className="space-y-5">
                          {/* Switch 1 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-slate-700">Enable CV Triggers</span>
                              <div className="relative group">
                                <svg className="w-4 h-4 text-slate-300 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl z-20">
                                  Controls if triggers are active during normal playlist playback.
                                </div>
                              </div>
                            </div>
                            <ModernSwitch 
                              isOn={config.enable_cv_triggers !== false} 
                              onToggle={() => handleSwitchChange(camera.id, 'enable_cv_triggers', !(config.enable_cv_triggers !== false))} 
                            />
                          </div>

                          {/* Switch 2 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-slate-700">Allow interruptions</span>
                              <div className="relative group">
                                <svg className="w-4 h-4 text-slate-300 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl z-20">
                                  If ON, triggers can override priority scheduled content.
                                </div>
                              </div>
                            </div>
                            <ModernSwitch 
                              isOn={config.allow_triggers_during_scheduled === true} 
                              onToggle={() => handleSwitchChange(camera.id, 'allow_triggers_during_scheduled', !(config.allow_triggers_during_scheduled === true))} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleUpdateConfig(camera.id)}
                        className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                      >
                        Save Config
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {cameras.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No cameras configured yet</p>
              </div>
            )}
          </>
        )}

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Attention</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                {warningType === 'scheduling'
                  ? 'This allows triggers to override your scheduled playback. Content may be interrupted.'
                  : 'This completely disables trigger response during standard rotation. No interactive content will show.'}
              </p>
              <label className="flex items-center mb-8 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain[warningType]}
                  onChange={(e) => setDontShowAgain({ ...dontShowAgain, [warningType]: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-xs font-bold text-slate-400 uppercase tracking-tight">Don't show this again</span>
              </label>
              <div className="flex gap-4">
                <button onClick={handleWarningCancel} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={handleWarningConfirm} className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Continue</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CVConfiguration;