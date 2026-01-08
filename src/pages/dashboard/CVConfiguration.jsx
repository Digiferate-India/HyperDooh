// src/pages/dashboard/CVConfiguration.jsx
// CV Configuration Dashboard Page

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

      // Initialize CV configs
      const configs = {};
      data?.forEach((camera) => {
        const config = camera.cv_configs?.[0];
        configs[camera.id] = {
          frame_interval_ms: config?.frame_interval_ms || 2000,
          enable_age: config?.enable_age !== false,
          enable_gender: config?.enable_gender !== false,
          min_people_for_detection: config?.min_people_for_detection || 1,
          min_dwell_to_trigger_sec: config?.min_dwell_to_trigger_sec || 5,
          rearm_cooldown_sec: config?.rearm_cooldown_sec || 600,
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

      // Create default CV config
      const { error: configError } = await supabase
        .from('cv_configs')
        .insert({
          camera_id: camera.id,
          frame_interval_ms: 2000,
          enable_age: true,
          enable_gender: true,
          min_people_for_detection: 1,
          min_dwell_to_trigger_sec: 5,
          rearm_cooldown_sec: 600,
        });

      if (configError) throw configError;

      setNewCamera({ name: '', location: '', aws_camera_identifier: '' });
      setShowAddCamera(false);
      fetchCameras();
    } catch (error) {
      alert('Error adding camera: ' + error.message);
    }
  };

  const handleUpdateConfig = async (cameraId) => {
    try {
      const config = cvConfigs[cameraId];
      const camera = cameras.find((c) => c.id === cameraId);
      const existingConfig = camera?.cv_configs?.[0];

      if (existingConfig) {
        // Update existing config
        const { error } = await supabase
          .from('cv_configs')
          .update({
            frame_interval_ms: config.frame_interval_ms,
            enable_age: config.enable_age,
            enable_gender: config.enable_gender,
            min_people_for_detection: config.min_people_for_detection,
            min_dwell_to_trigger_sec: config.min_dwell_to_trigger_sec,
            rearm_cooldown_sec: config.rearm_cooldown_sec,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingConfig.id);

        if (error) throw error;
      } else {
        // Create new config
        const { error } = await supabase.from('cv_configs').insert({
          camera_id: cameraId,
          ...config,
        });

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
      const { error } = await supabase
        .from('cameras')
        .delete()
        .eq('id', cameraId);

      if (error) throw error;
      fetchCameras();
    } catch (error) {
      alert('Error deleting camera: ' + error.message);
    }
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
                    onChange={(e) =>
                      setNewCamera({ ...newCamera, name: e.target.value })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="Front Camera"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    AWS Camera ID
                  </label>
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
                <div
                  key={camera.id}
                  className="border rounded-lg p-6 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{camera.name}</h3>
                      <p className="text-sm text-gray-600">
                        Location: {camera.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        AWS ID: {camera.aws_camera_identifier}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCamera(camera.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  {/* CV Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Frame Interval (ms)
                      </label>
                      <input
                        type="number"
                        value={config.frame_interval_ms || 2000}
                        onChange={(e) =>
                          setCvConfigs({
                            ...cvConfigs,
                            [camera.id]: {
                              ...config,
                              frame_interval_ms: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Min People for Detection
                      </label>
                      <input
                        type="number"
                        value={config.min_people_for_detection || 1}
                        onChange={(e) =>
                          setCvConfigs({
                            ...cvConfigs,
                            [camera.id]: {
                              ...config,
                              min_people_for_detection: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Min Dwell Time to Trigger (sec)
                      </label>
                      <input
                        type="number"
                        value={config.min_dwell_to_trigger_sec || 5}
                        onChange={(e) =>
                          setCvConfigs({
                            ...cvConfigs,
                            [camera.id]: {
                              ...config,
                              min_dwell_to_trigger_sec: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rearm Cooldown (sec)
                      </label>
                      <input
                        type="number"
                        value={config.rearm_cooldown_sec || 600}
                        onChange={(e) =>
                          setCvConfigs({
                            ...cvConfigs,
                            [camera.id]: {
                              ...config,
                              rearm_cooldown_sec: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Time before same face can trigger again
                      </p>
                    </div>

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
                        <span className="text-sm font-medium">
                          Enable Age Detection
                        </span>
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
                        <span className="text-sm font-medium">
                          Enable Gender Detection
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateConfig(camera.id)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
    </div>
  );
}

export default CVConfiguration;

