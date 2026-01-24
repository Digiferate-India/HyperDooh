// src/pages/dashboard/RulesManagement.jsx
// Rules Management Dashboard Page

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function RulesManagement() {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [rules, setRules] = useState([]);
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    screen_id: null,
    priority: 100,
    min_people: null,
    max_people: null,
    min_males: null,
    max_males: null,
    min_females: null,
    max_females: null,
    min_avg_age: null,
    max_avg_age: null,

    // ✅ IMPORTANT: use *_seconds because your RPC reads these columns
    min_dwell_seconds: null,
    max_dwell_seconds: null,

    output_media_id: null,
    is_active: true,
  });

  // ✅ Helpers to prevent -ve, NaN, and bad min/max
  const toIntOrNull = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return Math.trunc(n);
  };

  const clampIntOrNull = (value, min = 0) => {
    const n = toIntOrNull(value);
    if (n === null) return null;
    return Math.max(min, n);
  };

  const normalizeMinMax = (minVal, maxVal, minClamp = 0) => {
    const minN = clampIntOrNull(minVal, minClamp);
    const maxN = clampIntOrNull(maxVal, minClamp);

    // if both exist & min > max, swap them
    if (minN !== null && maxN !== null && minN > maxN) {
      return { min: maxN, max: minN };
    }
    return { min: minN, max: maxN };
  };

  const normalizeRulePayload = (rule) => {
    const people = normalizeMinMax(rule.min_people, rule.max_people, 0);
    const males = normalizeMinMax(rule.min_males, rule.max_males, 0);
    const females = normalizeMinMax(rule.min_females, rule.max_females, 0);
    const age = normalizeMinMax(rule.min_avg_age, rule.max_avg_age, 0);
    const dwell = normalizeMinMax(rule.min_dwell_seconds, rule.max_dwell_seconds, 0);

    return {
      ...rule,
      priority: clampIntOrNull(rule.priority, 0) ?? 100,

      min_people: people.min,
      max_people: people.max,

      min_males: males.min,
      max_males: males.max,

      min_females: females.min,
      max_females: females.max,

      min_avg_age: age.min,
      max_avg_age: age.max,

      // ✅ store into *_seconds for RPC compatibility
      min_dwell_seconds: dwell.min,
      max_dwell_seconds: dwell.max,
    };
  };

  useEffect(() => {
    fetchScreens();
    fetchMedia();
  }, []);

  useEffect(() => {
    if (selectedScreen !== undefined) {
      fetchRules();
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
    } catch (error) {
      alert('Error fetching screens: ' + error.message);
    }
  };

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('id, file_name, thumbnail_path, file_path')
        .order('file_name');

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      alert('Error fetching media: ' + error.message);
    }
  };

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('rules')
        .select('*, media(id, file_name, thumbnail_path, file_path)')
        .order('priority', { ascending: false });

      if (selectedScreen) {
        query = query.or(`screen_id.is.null,screen_id.eq.${selectedScreen}`);
      } else {
        query = query.is('screen_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      alert('Error fetching rules: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRule = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // ✅ Normalize and clamp before save (prevents -ve + fixes min/max)
      const normalizedRule = normalizeRulePayload(newRule);

      const ruleData = {
        ...normalizedRule,
        user_id: user.id,
        screen_id: selectedScreen || null,
      };

      if (editingRule) {
        // Update existing rule
        const { error } = await supabase
          .from('rules')
          .update(ruleData)
          .eq('id', editingRule.id);

        if (error) throw error;
      } else {
        // Create new rule
        const { error } = await supabase.from('rules').insert([ruleData]);

        if (error) throw error;
      }

      setShowAddRule(false);
      setEditingRule(null);
      resetForm();
      fetchRules();
    } catch (error) {
      alert('Error saving rule: ' + error.message);
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);

    setNewRule({
      name: rule.name,
      description: rule.description || '',
      screen_id: rule.screen_id,
      priority: rule.priority,
      min_people: rule.min_people,
      max_people: rule.max_people,
      min_males: rule.min_males,
      max_males: rule.max_males,
      min_females: rule.min_females,
      max_females: rule.max_females,
      min_avg_age: rule.min_avg_age,
      max_avg_age: rule.max_avg_age,

      // ✅ IMPORTANT: edit from *_seconds (RPC reads these)
      min_dwell_seconds: rule.min_dwell_seconds,
      max_dwell_seconds: rule.max_dwell_seconds,

      output_media_id: rule.output_media_id,
      is_active: rule.is_active,
    });

    setShowAddRule(true);
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    try {
      const { error } = await supabase.from('rules').delete().eq('id', ruleId);

      if (error) throw error;
      fetchRules();
    } catch (error) {
      alert('Error deleting rule: ' + error.message);
    }
  };

  const resetForm = () => {
    setNewRule({
      name: '',
      description: '',
      screen_id: null,
      priority: 100,
      min_people: null,
      max_people: null,
      min_males: null,
      max_males: null,
      min_females: null,
      max_females: null,
      min_avg_age: null,
      max_avg_age: null,

      // ✅ IMPORTANT: use *_seconds
      min_dwell_seconds: null,
      max_dwell_seconds: null,

      output_media_id: null,
      is_active: true,
    });
  };

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rules Management</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingRule(null);
            setShowAddRule(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Rule
        </button>
      </div>

      {/* Screen Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Filter by Screen (or leave empty for global rules):
        </label>
        <select
          value={selectedScreen || ''}
          onChange={(e) => setSelectedScreen(e.target.value || null)}
          className="border p-2 rounded-lg w-full max-w-md"
        >
          <option value="">All Screens (Global Rules)</option>
          {screens.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.custom_name}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Rule Form */}
      {showAddRule && (
        <div className="mb-6 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingRule ? 'Edit Rule' : 'Add New Rule'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rule Name *</label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="w-full border p-2 rounded"
                placeholder="Women's Ad Rule"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <input
                type="number"
                value={newRule.priority ?? ''}
                onChange={(e) =>
                  setNewRule({ ...newRule, priority: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher priority rules are evaluated first
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newRule.description}
                onChange={(e) =>
                  setNewRule({ ...newRule, description: e.target.value })
                }
                className="w-full border p-2 rounded"
                rows="2"
                placeholder="Rule description..."
              />
            </div>
          </div>

          <h4 className="font-semibold mt-4 mb-2">People Count Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min People</label>
              <input
                type="number"
                value={newRule.min_people ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    min_people: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Leave empty for no limit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max People</label>
              <input
                type="number"
                value={newRule.max_people ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    max_people: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Leave empty for no limit"
              />
            </div>
          </div>

          <h4 className="font-semibold mt-4 mb-2">Gender Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Males</label>
              <input
                type="number"
                value={newRule.min_males ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    min_males: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Males</label>
              <input
                type="number"
                value={newRule.max_males ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    max_males: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Females</label>
              <input
                type="number"
                value={newRule.min_females ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    min_females: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Females</label>
              <input
                type="number"
                value={newRule.max_females ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    max_females: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <h4 className="font-semibold mt-4 mb-2">Age Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Avg Age</label>
              <input
                type="number"
                value={newRule.min_avg_age ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    min_avg_age: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Avg Age</label>
              <input
                type="number"
                value={newRule.max_avg_age ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    max_avg_age: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <h4 className="font-semibold mt-4 mb-2">Dwell Time Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Min Dwell (sec)
              </label>
              <input
                type="number"
                value={newRule.min_dwell_seconds ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    min_dwell_seconds: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Dwell (sec)
              </label>
              <input
                type="number"
                value={newRule.max_dwell_seconds ?? ''}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    max_dwell_seconds: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Output Media (Creative to Display) *
            </label>
            <select
              value={newRule.output_media_id ?? ''}
              onChange={(e) =>
                setNewRule({
                  ...newRule,
                  output_media_id: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full border p-2 rounded"
            >
              <option value="">Select media...</option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.file_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newRule.is_active}
                onChange={(e) =>
                  setNewRule({ ...newRule, is_active: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveRule}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </button>
            <button
              onClick={() => {
                setShowAddRule(false);
                setEditingRule(null);
                resetForm();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      {isLoading ? (
        <div>Loading rules...</div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{rule.name}</h3>
                  {rule.description && (
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  )}
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="text-gray-500">
                      Priority: <strong>{rule.priority}</strong>
                    </span>
                    <span className="text-gray-500">
                      Screen:{' '}
                      <strong>
                        {rule.screen_id
                          ? screens.find((s) => s.id === rule.screen_id)?.custom_name ||
                            'Unknown'
                          : 'Global (All Screens)'}
                      </strong>
                    </span>
                    <span
                      className={`font-semibold ${
                        rule.is_active ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Conditions Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {(rule.min_people || rule.max_people) && (
                  <div>
                    <strong>People:</strong>{' '}
                    {rule.min_people && `Min: ${rule.min_people}`}
                    {rule.min_people && rule.max_people && ', '}
                    {rule.max_people && `Max: ${rule.max_people}`}
                  </div>
                )}
                {(rule.min_males || rule.max_males) && (
                  <div>
                    <strong>Males:</strong>{' '}
                    {rule.min_males && `Min: ${rule.min_males}`}
                    {rule.min_males && rule.max_males && ', '}
                    {rule.max_males && `Max: ${rule.max_males}`}
                  </div>
                )}
                {(rule.min_females || rule.max_females) && (
                  <div>
                    <strong>Females:</strong>{' '}
                    {rule.min_females && `Min: ${rule.min_females}`}
                    {rule.min_females && rule.max_females && ', '}
                    {rule.max_females && `Max: ${rule.max_females}`}
                  </div>
                )}
                {(rule.min_avg_age || rule.max_avg_age) && (
                  <div>
                    <strong>Avg Age:</strong>{' '}
                    {rule.min_avg_age && `Min: ${rule.min_avg_age}`}
                    {rule.min_avg_age && rule.max_avg_age && ', '}
                    {rule.max_avg_age && `Max: ${rule.max_avg_age}`}
                  </div>
                )}
              </div>

              {/* Output Media */}
              {rule.media && (
                <div className="mt-4">
                  <strong>Output Media:</strong>{' '}
                  <span className="text-blue-600">{rule.media.file_name}</span>
                  {rule.media.thumbnail_path && (
                    <img
                      src={rule.media.thumbnail_path || rule.media.file_path}
                      alt={rule.media.file_name}
                      className="mt-2 w-24 h-16 object-cover rounded"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          {rules.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No rules found. Create your first rule to get started!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default RulesManagement;
