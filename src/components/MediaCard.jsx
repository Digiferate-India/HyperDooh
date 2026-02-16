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

  if (isLoading && !selectedScreen) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">CV Configuration</h1>

        {/* Screen Selection */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Select Screen</label>
          <select
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  showAddCamera 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {showAddCamera ? 'Cancel' : '+ Add Camera'}
              </button>
            </div>

            {showAddCamera && (
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm animate-in fade-in duration-300">
                <h3 className="text-lg font-bold mb-5 text-gray-800">Add New Camera</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Name</label>
                    <input
                      type="text"
                      value={newCamera.name}
                      onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Front Camera"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Location</label>
                    <input
                      type="text"
                      value={newCamera.location}
                      onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Entrance"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">AWS Camera ID</label>
                    <input
                      type="text"
                      value={newCamera.aws_camera_identifier}
                      onChange={(e) => setNewCamera({ ...newCamera, aws_camera_identifier: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="cam-001"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddCamera}
                  className="mt-6 bg-green-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                >
                  Add Camera
                </button>
              </div>
            )}

            <div className="grid gap-8">
              {cameras.map((camera) => {
                const config = cvConfigs[camera.id] || {};
                return (
                  <div key={camera.id} className="border border-gray-100 rounded-2xl p-8 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-50">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{camera.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Location: {camera.location}</span>
                          <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">AWS ID: {camera.aws_camera_identifier}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCamera(camera.id)}
                        className="text-sm font-bold text-red-500 hover:text-red-700 uppercase tracking-tighter transition-colors"
                      >
                        Delete Camera
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Detection Section */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Detection Settings</h4>
                        <label className="flex items-center group cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={config.enable_age !== false}
                              onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_age: e.target.checked } })}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Enable Age Detection</span>
                          </div>
                        </label>
                        <label className="flex items-center group cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={config.enable_gender !== false}
                              onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_gender: e.target.checked } })}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Enable Gender Detection</span>
                          </div>
                        </label>
                      </div>

                      {/* Behavior Section - Refined Switches */}
                      <div className="space-y-6 border-l border-gray-50 pl-0 md:pl-10">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trigger Behavior</h4>
                        
                        {/* Switch 1 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-700">Enable CV Triggers</span>
                            <div className="relative group">
                              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-20 leading-relaxed">
                                Controls if triggers are active during normal playlist playback.
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleSwitchChange(camera.id, 'enable_cv_triggers', !(config.enable_cv_triggers !== false))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              config.enable_cv_triggers !== false ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`${config.enable_cv_triggers !== false ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                          </button>
                        </div>

                        {/* Switch 2 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-700">Allow Interruptions</span>
                            <div className="relative group">
                              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl z-20 leading-relaxed">
                                If ON, CV triggers can interrupt scheduled content mid-stream.
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleSwitchChange(camera.id, 'allow_triggers_during_scheduled', !(config.allow_triggers_during_scheduled === true))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              config.allow_triggers_during_scheduled === true ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span className={`${config.allow_triggers_during_scheduled === true ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdateConfig(camera.id)}
                      className="mt-10 w-full md:w-auto bg-gray-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      Save Configuration
                    </button>
                  </div>
                );
              })}
            </div>

            {cameras.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">No cameras configured for this screen.</p>
              </div>
            )}
          </>
        )}

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Confirm Change</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {warningType === 'scheduling'
                  ? 'Turning this ON will make CV triggers active even during scheduled content. This means triggered content can interrupt your scheduled programming.'
                  : 'Turning this OFF will deactivate CV triggers during normal playlist playback. Triggered content will not be shown during regular rotation.'}
              </p>
              <div className="mb-8">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dontShowAgain[warningType]}
                    onChange={(e) => setDontShowAgain({ ...dontShowAgain, [warningType]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Don't show this again</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleWarningCancel}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWarningConfirm}
                  className="flex-1 px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CVConfiguration;