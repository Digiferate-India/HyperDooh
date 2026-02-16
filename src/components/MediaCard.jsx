// src/pages/dashboard/CVConfiguration.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function CVConfiguration() {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [cameras, setCameras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCamera, setShowAddCamera] = useState(false);

  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    aws_camera_identifier: '',
  });

  const [cvConfigs, setCvConfigs] = useState({});

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

  // Switch Component Helper
  const ModernSwitch = ({ isOn, onToggle, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
          isOn ? 'bg-emerald-500' : 'bg-gray-700'
        }`}
      >
        <span className="sr-only">{label}</span>
        
        {/* ON/OFF Labels centered in the track */}
        <span className={`absolute left-2 text-[10px] font-bold text-white transition-opacity ${isOn ? 'opacity-0' : 'opacity-100'}`}>
          OFF
        </span>
        <span className={`absolute right-2 text-[10px] font-bold text-white transition-opacity ${isOn ? 'opacity-100' : 'opacity-0'}`}>
          ON
        </span>

        {/* The Inset Circle */}
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            isOn ? 'translate-x-9' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  if (isLoading && !selectedScreen) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 text-gray-900 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">CV Configuration</h1>

        {/* Screen Selection */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Target Screen</label>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl w-full max-w-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-gray-50 font-medium"
          >
            <option value="">Select a screen</option>
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
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  showAddCamera 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200'
                }`}
              >
                {showAddCamera ? 'Cancel' : '+ Add Camera'}
              </button>
            </div>

            {showAddCamera && (
              <div className="mb-8 p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-5 text-gray-900">Configure New Camera</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Name</label>
                    <input
                      type="text"
                      value={newCamera.name}
                      onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                      className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="e.g. Lobby Entry"
                    />
                  </div>
                  {/* ... other inputs simplified for brevity ... */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Location</label>
                    <input
                      type="text"
                      value={newCamera.location}
                      onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                      className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="e.g. Floor 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">AWS Identifier</label>
                    <input
                      type="text"
                      value={newCamera.aws_camera_identifier}
                      onChange={(e) => setNewCamera({ ...newCamera, aws_camera_identifier: e.target.value })}
                      className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="cam-xxx-xxx"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddCamera}
                  className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md"
                >
                  Confirm Addition
                </button>
              </div>
            )}

            <div className="grid gap-8">
              {cameras.map((camera) => {
                const config = cvConfigs[camera.id] || {};
                return (
                  <div key={camera.id} className="border border-gray-200 rounded-3xl p-8 bg-white shadow-sm overflow-hidden relative">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{camera.name}</h3>
                        <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                          {camera.location} • ID: {camera.aws_camera_identifier}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCamera(camera.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Detection settings using standard checkboxes */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Analytic Toggles</h4>
                        <div className="space-y-3">
                          <label className="flex items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-emerald-200 transition-colors">
                            <input
                              type="checkbox"
                              checked={config.enable_age !== false}
                              onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_age: e.target.checked } })}
                              className="w-5 h-5 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-4 text-sm font-bold text-gray-700">Enable Age Detection</span>
                          </label>
                          <label className="flex items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-emerald-200 transition-colors">
                            <input
                              type="checkbox"
                              checked={config.enable_gender !== false}
                              onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_gender: e.target.checked } })}
                              className="w-5 h-5 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-4 text-sm font-bold text-gray-700">Enable Gender Detection</span>
                          </label>
                        </div>
                      </div>

                      {/* Behavior settings using the NEW modern switches */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Trigger Logic</h4>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                          <ModernSwitch 
                            label="CV Triggers Active" 
                            isOn={config.enable_cv_triggers !== false} 
                            onToggle={() => handleSwitchChange(camera.id, 'enable_cv_triggers', !(config.enable_cv_triggers !== false))}
                          />
                          <div className="h-px bg-gray-200 mx-2" />
                          <ModernSwitch 
                            label="Allow Schedule Interruption" 
                            isOn={config.allow_triggers_during_scheduled === true} 
                            onToggle={() => handleSwitchChange(camera.id, 'allow_triggers_during_scheduled', !(config.allow_triggers_during_scheduled === true))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Last updated: {new Date().toLocaleDateString()}</p>
                      <button
                        onClick={() => handleUpdateConfig(camera.id)}
                        className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        Save All Changes
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {cameras.length === 0 && (
              <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No cameras deployed on this screen</p>
              </div>
            )}
          </>
        )}

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-extrabold mb-2 text-gray-900">Safety Notice</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                {warningType === 'scheduling'
                  ? 'This will allow real-time triggers to override your priority scheduling. Playback may become unpredictable.'
                  : 'Triggers will be completely disabled during standard rotations. This may affect engagement analytics.'}
              </p>
              <label className="flex items-center mb-8 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={dontShowAgain[warningType]}
                  onChange={(e) => setDontShowAgain({ ...dontShowAgain, [warningType]: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-3 text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-tight">I understand, don't ask again</span>
              </label>
              <div className="flex gap-4">
                <button onClick={handleWarningCancel} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={handleWarningConfirm} className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">Continue</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CVConfiguration;