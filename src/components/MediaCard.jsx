// src/pages/dashboard/CVConfiguration.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// --- Reusable Toggle Switch Component ---
const ToggleSwitch = ({ isOn, onToggle, id, label }) => {
  return (
    <div className="flex items-center justify-between py-1">
      {/* Label Text */}
      <span className="text-sm font-semibold text-gray-700 select-none mr-3">
        {label}
      </span>

      {/* Switch Container */}
      <div
        onClick={onToggle}
        className={`relative w-16 h-9 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
          isOn ? 'bg-emerald-500' : 'bg-slate-700'
        }`}
      >
        {/* ON Text (Visible when ON, positioned Left) */}
        <span
          className={`absolute left-2 text-[10px] font-bold text-white uppercase tracking-wider transition-opacity duration-300 ${
            isOn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ON
        </span>

        {/* OFF Text (Visible when OFF, positioned Right) */}
        <span
          className={`absolute right-2 text-[10px] font-bold text-gray-300 uppercase tracking-wider transition-opacity duration-300 ${
            isOn ? 'opacity-0' : 'opacity-100'
          }`}
        >
          OFF
        </span>

        {/* The Knob (White Circle) */}
        <div
          className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 ease-in-out z-10 ${
            isOn ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};

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
          <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Select Screen</label>
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
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
              >
                {showAddCamera ? 'Cancel' : '+ Add Camera'}
              </button>
            </div>

            {showAddCamera && (
              <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
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

            <div className="grid gap-6">
              {cameras.map((camera) => {
                const config = cvConfigs[camera.id] || {};
                return (
                  <div key={camera.id} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{camera.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                           {camera.location} <span className="mx-2">•</span> <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{camera.aws_camera_identifier}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCamera(camera.id)}
                        className="text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Standard Checkboxes for Detection */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detection Settings</h4>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={config.enable_age !== false}
                            onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_age: e.target.checked } })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Enable Age Detection</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={config.enable_gender !== false}
                            onChange={(e) => setCvConfigs({ ...cvConfigs, [camera.id]: { ...config, enable_gender: e.target.checked } })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Enable Gender Detection</span>
                        </label>
                      </div>

                      {/* New Toggle Switches */}
                      <div className="space-y-5">
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Trigger Controls</h4>
                         
                         {/* CV Triggers Switch */}
                         <div>
                           <ToggleSwitch 
                              label="Enable CV Triggers"
                              isOn={config.enable_cv_triggers !== false} 
                              onToggle={() => handleSwitchChange(camera.id, 'enable_cv_triggers', !(config.enable_cv_triggers !== false))}
                           />
                           <p className="text-[11px] text-gray-400 mt-1 ml-0.5">Controls if triggers are active during normal playlist playback.</p>
                         </div>

                         {/* Interrupt Schedule Switch */}
                         <div>
                           <ToggleSwitch 
                              label="Allow Schedule Interruption"
                              isOn={config.allow_triggers_during_scheduled === true} 
                              onToggle={() => handleSwitchChange(camera.id, 'allow_triggers_during_scheduled', !(config.allow_triggers_during_scheduled === true))}
                           />
                           <p className="text-[11px] text-gray-400 mt-1 ml-0.5">If enabled, triggers can interrupt priority scheduled content.</p>
                         </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-50 flex justify-end">
                      <button
                        onClick={() => handleUpdateConfig(camera.id)}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-sm active:scale-95"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {cameras.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">No cameras configured for this screen.</p>
              </div>
            )}
          </>
        )}

        {/* Warning Modal */}
        {showWarning && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
              <h3 className="text-lg font-bold mb-3 text-gray-900">Confirm Change</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {warningType === 'scheduling'
                  ? 'Turning this ON will make CV triggers active even during scheduled content. This means triggered content can interrupt your scheduled programming.'
                  : 'Turning this OFF will deactivate CV triggers during normal playlist playback. Triggered content will not be shown during regular rotation.'}
              </p>
              <div className="mb-8">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dontShowAgain[warningType]}
                    onChange={(e) => setDontShowAgain({ ...dontShowAgain, [warningType]: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">Don't show this again</span>
                </label>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleWarningCancel}
                  className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWarningConfirm}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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