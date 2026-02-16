// src/pages/dashboard/CVConfiguration.jsx
// CV Configuration Dashboard Page (Updated with trigger control switches)

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Modern 3D Toggle Switch Component with ON/OFF text
const ToggleSwitch = ({ isOn, onToggle, label, tooltip }) => {
  const switchStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    height: '36px',
    width: '68px',
    borderRadius: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isOn 
      ? 'linear-gradient(180deg, #34D399 0%, #10B981 100%)' 
      : 'linear-gradient(180deg, #64748B 0%, #475569 100%)',
    boxShadow: isOn
      ? 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(16,185,129,0.3)'
      : 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.2)',
    border: 'none',
    outline: 'none',
    padding: '0',
    overflow: 'hidden',
  };

  const knobStyle = {
    position: 'absolute',
    top: '3px',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.05)',
    transition: 'left 0.3s ease',
    left: isOn ? '35px' : '3px',
  };

  const onTextStyle = {
    position: 'absolute',
    left: '10px',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
    opacity: isOn ? 1 : 0,
    transition: 'opacity 0.2s ease',
    textShadow: '0 1px 1px rgba(0,0,0,0.1)',
  };

  const offTextStyle = {
    position: 'absolute',
    right: '8px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#1e293b',
    opacity: isOn ? 0 : 1,
    transition: 'opacity 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button
        type="button"
        onClick={onToggle}
        style={switchStyle}
        role="switch"
        aria-checked={isOn}
      >
        {/* ON Text (visible when ON) */}
        <span style={onTextStyle}>ON</span>
        
        {/* OFF Text (visible when OFF) */}
        <span style={offTextStyle}>OFF</span>
        
        {/* Toggle Knob */}
        <span style={knobStyle}></span>
      </button>
      
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
      
      {tooltip && (
        <div className="relative group">
          <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
};

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

  // CV Config state (toggles + new trigger controls)
  const [cvConfigs, setCvConfigs] = useState({});

  // Warning popup state
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState(''); // 'scheduling' or 'cv'
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

      // Initialize CV configs (toggles + new trigger controls)
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

      // Set local UI defaults for new camera
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

      // Save all toggles (age/gender + trigger controls)
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
    const config = cvConfigs[cameraId] || {};

    // Check if this is a change from default and if warning should be shown
    const isSchedulingSwitch = field === 'allow_triggers_during_scheduled';
    const isCvSwitch = field === 'enable_cv_triggers';

    if (isSchedulingSwitch && newValue === true && !dontShowAgain.scheduling) {
      // Turning ON scheduling triggers (non-default)
      setWarningType('scheduling');
      setWarningCameraId(cameraId);
      setShowWarning(true);
      return;
    }

    if (isCvSwitch && newValue === false && !dontShowAgain.cv) {
      // Turning OFF CV triggers (non-default)
      setWarningType('cv');
      setWarningCameraId(cameraId);
      setShowWarning(true);
      return;
    }

    // No warning needed, apply change directly
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
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">CV Configuration</h1>

      {/* Screen Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Screen:</label>
        <select
          value={selectedScreen}
          onChange={(e) => setSelectedScreen(e.target.value)}
          className="border p-2 rounded-lg w-full max-w-md"
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
          {/* Add Camera Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddCamera(!showAddCamera)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              {showAddCamera ? 'Cancel' : '+ Add Camera'}
            </button>
          </div>

          {/* Add Camera Form */}
          {showAddCamera && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">Add New Camera</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    className="w-full border p-2 rounded"
                    placeholder="Front Camera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newCamera.location}
                    onChange={(e) =>
                      setNewCamera({ ...newCamera, location: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="Entrance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">AWS Camera ID</label>
                  <input
                    type="text"
                    value={newCamera.aws_camera_identifier}
                    onChange={(e) =>
                      setNewCamera({
                        ...newCamera,
                        aws_camera_identifier: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="cam-001"
                  />
                </div>
              </div>
              <button
                onClick={handleAddCamera}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Camera
              </button>
            </div>
          )}

          {/* Cameras List */}
          <div className="space-y-6">
            {cameras.map((camera) => {
              const config = cvConfigs[camera.id] || {};
              return (
                <div key={camera.id} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{camera.name}</h3>
                      <p className="text-sm text-gray-600">Location: {camera.location}</p>
                      <p className="text-sm text-gray-600">
                        AWS ID: {camera.aws_camera_identifier}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCamera(camera.id)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                      Delete
                    </button>
                  </div>

                  {/* CV Detection Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.enable_age !== false}
                          onChange={(e) =>
                            setCvConfigs({
                              ...cvConfigs,
                              [camera.id]: {
                                ...config,
                                enable_age: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Enable Age Detection</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.enable_gender !== false}
                          onChange={(e) =>
                            setCvConfigs({
                              ...cvConfigs,
                              [camera.id]: {
                                ...config,
                                enable_gender: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Enable Gender Detection</span>
                      </label>
                    </div>
                  </div>

                  {/* New Trigger Control Switches with Modern 3D Design */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700">Trigger Behavior Controls</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Enable CV Triggers Switch */}
                      <ToggleSwitch
                        isOn={config.enable_cv_triggers !== false}
                        onToggle={() => handleSwitchChange(camera.id, 'enable_cv_triggers', !(config.enable_cv_triggers !== false))}
                        label="Enable CV Triggers"
                        tooltip="Controls whether CV triggers are active during normal content playlist. Default: ON"
                      />

                      {/* Allow Triggers During Scheduled Content Switch */}
                      <ToggleSwitch
                        isOn={config.allow_triggers_during_scheduled === true}
                        onToggle={() => handleSwitchChange(camera.id, 'allow_triggers_during_scheduled', !(config.allow_triggers_during_scheduled === true))}
                        label="Allow Triggers During Scheduled Content"
                        tooltip="Controls whether CV triggers can interrupt scheduled content. Default: OFF (triggers only work during normal playlist)"
                      />

                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateConfig(camera.id)}
                    className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Save Configuration
                  </button>
                </div>
              );
            })}
          </div>

          {cameras.length === 0 && (
            <p className="text-gray-500">No cameras configured for this screen.</p>
          )}
        </>
      )}

      {/* Warning Popup Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Warning</h3>
            <p className="text-gray-700 mb-4">
              {warningType === 'scheduling'
                ? 'Turning this ON will make CV triggers active even during scheduled content. This means triggered content can interrupt your scheduled programming.'
                : 'Turning this OFF will deactivate CV triggers during normal playlist playback. Triggered content will not be shown during regular content rotation.'}
            </p>
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dontShowAgain[warningType]}
                  onChange={(e) =>
                    setDontShowAgain({
                      ...dontShowAgain,
                      [warningType]: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Don't show this again</span>
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleWarningCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleWarningConfirm}
                className="px-4 py-2 text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CVConfiguration;
