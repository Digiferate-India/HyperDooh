// src/pages/dashboard/AssignContent.jsx
// Combined Page: Manage Default Content & Conditional Rules

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function AssignContent() {
  // --- Global State ---
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Default Content State ---
  const [defaultMediaId, setDefaultMediaId] = useState('');
  const [isSavingDefault, setIsSavingDefault] = useState(false);

  // --- Rules State ---
  const [rules, setRules] = useState([]);
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
    min_dwell_seconds: null,
    max_dwell_seconds: null,
    output_media_id: null,
    is_active: true,
  });

  // --- Helpers for Numbers ---
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
      min_dwell_seconds: dwell.min,
      max_dwell_seconds: dwell.max,
    };
  };

  // --- Effects ---
  useEffect(() => {
    fetchScreens();
    fetchMedia();
  }, []);

  useEffect(() => {
    // When screen changes, fetch its specific rules AND its default content
    if (selectedScreen !== undefined) {
      fetchRules();
      fetchScreenDetails(); // Get default assigned content
    }
  }, [selectedScreen]);

  // --- Data Fetching ---

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

  // ✅ New: Fetch default assigned content for the selected screen
  const fetchScreenDetails = async () => {
    if (!selectedScreen) {
      setDefaultMediaId('');
      return;
    }
    try {
      // Assuming 'default_media_id' exists in screens table.
      // If you call it something else (e.g., current_content_id), change it here.
      const { data, error } = await supabase
        .from('screens')
        .select('default_media_id') 
        .eq('id', selectedScreen)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
      setDefaultMediaId(data?.default_media_id || '');
    } catch (error) {
      console.error('Error fetching screen details:', error);
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

  // --- Handlers: Default Content ---

  const handleSaveDefaultContent = async () => {
    if (!selectedScreen) return alert('Please select a screen first.');
    setIsSavingDefault(true);
    try {
      // Update the screen row with the new default media
      const { error } = await supabase
        .from('screens')
        .update({ default_media_id: defaultMediaId || null })
        .eq('id', selectedScreen);

      if (error) throw error;
      alert('Default content updated successfully!');
    } catch (error) {
      alert('Error saving default content: ' + error.message);
    } finally {
      setIsSavingDefault(false);
    }
  };

  // --- Handlers: Rules ---

  const handleSaveRule = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const normalizedRule = normalizeRulePayload(newRule);
      const ruleData = {
        ...normalizedRule,
        user_id: user.id,
        screen_id: selectedScreen || null,
      };

      if (editingRule) {
        const { error } = await supabase
          .from('rules')
          .update(ruleData)
          .eq('id', editingRule.id);
        if (error) throw error;
      } else {
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
      min_dwell_seconds: rule.min_dwell_seconds,
      max_dwell_seconds: rule.max_dwell_seconds,
      output_media_id: rule.output_media_id,
      is_active: rule.is_active,
    });
    setShowAddRule(true);
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
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
      min_dwell_seconds: null,
      max_dwell_seconds: null,
      output_media_id: null,
      is_active: true,
    });
  };

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assign Content & Rules</h1>
      </div>

      {/* 1. Global Screen Selector */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <label className="block text-sm font-bold text-blue-900 mb-2">
          Select Screen to Manage:
        </label>
        <select
          value={selectedScreen || ''}
          onChange={(e) => setSelectedScreen(e.target.value || null)}
          className="border border-blue-300 p-2 rounded-lg w-full max-w-md"
        >
          <option value="">-- Select a Screen --</option>
          {screens.map((screen) => (
            <option key={screen.id} value={screen.id}>
              {screen.custom_name}
            </option>
          ))}
        </select>
        {!selectedScreen && (
          <p className="text-sm text-blue-600 mt-2">
            Please select a screen to assign default content. (Rules below show Global rules by default).
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. LEFT COLUMN: Default Content Assignment */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg shadow-sm p-6 bg-white sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📺</span> Default Content
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This content plays in a loop when no Smart Rules are triggered.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Default Media / Playlist</label>
              <select
                value={defaultMediaId}
                onChange={(e) => setDefaultMediaId(e.target.value)}
                disabled={!selectedScreen}
                className="w-full border p-2 rounded bg-gray-50"
              >
                <option value="">Select Default Media...</option>
                {media.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.file_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveDefaultContent}
              disabled={!selectedScreen || isSavingDefault}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                !selectedScreen 
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSavingDefault ? 'Saving...' : 'Save Default Assignment'}
            </button>
            
            {/* Preview of Default */}
            {defaultMediaId && (
              <div className="mt-4 border-t pt-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">PREVIEW</p>
                {media.find(m => String(m.id) === String(defaultMediaId))?.thumbnail_path ? (
                   <img 
                     src={media.find(m => String(m.id) === String(defaultMediaId))?.thumbnail_path}
                     alt="Preview"
                     className="w-full h-32 object-cover rounded-md"
                   />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    No Preview
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. RIGHT COLUMN: Smart Rules Management */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                <span>⚡</span> Smart Rules
                </h2>
                <p className="text-sm text-gray-500">
                    {selectedScreen 
                        ? `Overrides for ${screens.find(s => s.id === selectedScreen)?.custom_name}` 
                        : "Global Overrides (Applies to all screens without specific rules)"}
                </p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setEditingRule(null);
                setShowAddRule(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              + Add Rule
            </button>
          </div>

          {/* Add/Edit Rule Form */}
          {showAddRule && (
            <div className="mb-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">
                {editingRule ? 'Edit Rule' : 'Add New Smart Rule'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Name *</label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="w-full border p-2 rounded"
                    placeholder="e.g. Rainy Day Men's Ad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority (0-100)</label>
                  <input
                    type="number"
                    min="0" max="100"
                    value={newRule.priority ?? ''}
                    onChange={(e) => setNewRule({...newRule, priority: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    className="w-full border p-2 rounded"
                    rows="2"
                  />
                </div>
              </div>

              {/* Conditions Sections */}
              <div className="bg-white p-4 rounded border mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2 border-b pb-1">Trigger Conditions</h4>
                  
                  {/* Demographics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {/* People */}
                      <div>
                          <label className="text-xs font-bold text-gray-500">Min People</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.min_people ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, min_people: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500">Max People</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.max_people ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, max_people: e.target.value})} />
                      </div>
                       {/* Age */}
                       <div>
                          <label className="text-xs font-bold text-gray-500">Min Avg Age</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.min_avg_age ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, min_avg_age: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500">Max Avg Age</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.max_avg_age ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, max_avg_age: e.target.value})} />
                      </div>
                  </div>
                  
                  {/* Gender Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500">Min Males</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.min_males ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, min_males: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500">Max Males</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.max_males ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, max_males: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500">Min Females</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.min_females ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, min_females: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500">Max Females</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.max_females ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, max_females: e.target.value})} />
                      </div>
                  </div>

                  {/* Dwell Time */}
                  <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs font-bold text-gray-500">Min Dwell (sec)</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.min_dwell_seconds ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, min_dwell_seconds: e.target.value})} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500">Max Dwell (sec)</label>
                          <input type="number" className="w-full border p-1 rounded text-sm" 
                              value={newRule.max_dwell_seconds ?? ''} 
                              onChange={(e)=>setNewRule({...newRule, max_dwell_seconds: e.target.value})} />
                      </div>
                  </div>
              </div>

              {/* Output */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 bg-yellow-100 p-1 inline-block rounded">
                  ➡️ Result: Display this Media *
                </label>
                <select
                  value={newRule.output_media_id ?? ''}
                  onChange={(e) => setNewRule({ ...newRule, output_media_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select media...</option>
                  {media.map((m) => (
                    <option key={m.id} value={m.id}>{m.file_name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRule.is_active}
                    onChange={(e) => setNewRule({ ...newRule, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Rule is Active</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={handleSaveRule} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
                <button
                  onClick={() => { setShowAddRule(false); setEditingRule(null); resetForm(); }}
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
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {rule.name}
                        {!rule.is_active && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Inactive</span>}
                      </h3>
                      <div className="text-xs text-gray-500 mt-1">
                        Priority: {rule.priority} | Screen: {rule.screen_id ? 'Specific' : 'Global'}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button onClick={() => handleEditRule(rule)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDeleteRule(rule.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>

                  {/* Mini summary of conditions */}
                  <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                    <span className="font-semibold">Triggers: </span>
                    {[
                        rule.min_people || rule.max_people ? `People(${rule.min_people || 0}-${rule.max_people || '∞'})` : null,
                        rule.min_males || rule.max_males ? `Males(${rule.min_males || 0}-${rule.max_males || '∞'})` : null,
                        rule.min_females || rule.max_females ? `Females(${rule.min_females || 0}-${rule.max_females || '∞'})` : null,
                        rule.min_avg_age || rule.max_avg_age ? `Age(${rule.min_avg_age || 0}-${rule.max_avg_age || '∞'})` : null,
                    ].filter(Boolean).join(', ') || "No specific conditions (Always true if active)"}
                  </div>

                  {/* Output Media */}
                  {rule.media && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-700">Plays:</span>
                      {rule.media.thumbnail_path ? (
                          <img src={rule.media.thumbnail_path} alt="" className="w-10 h-10 object-cover rounded" />
                      ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">?</div>
                      )}
                      <span className="text-sm text-blue-600 truncate">{rule.media.file_name}</span>
                    </div>
                  )}
                </div>
              ))}

              {rules.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded border border-dashed border-gray-300">
                  <p className="text-gray-500">No smart rules defined for this context.</p>
                  <p className="text-sm text-gray-400">The Default Content will play continuously.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignContent;