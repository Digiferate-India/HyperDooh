import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RulesManagerModal({ screenId, screenName, onClose }) {
  const [rules, setRules] = useState([]);
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
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

  // --- Helpers ---
  const toIntOrNull = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  };

  const clampIntOrNull = (value, min = 0) => {
    const n = toIntOrNull(value);
    return n === null ? null : Math.max(min, n);
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
      min_people: people.min, max_people: people.max,
      min_males: males.min, max_males: males.max,
      min_females: females.min, max_females: females.max,
      min_avg_age: age.min, max_avg_age: age.max,
      min_dwell_seconds: dwell.min, max_dwell_seconds: dwell.max,
    };
  };

  // --- Effects ---
  useEffect(() => {
    fetchMedia();
    fetchRules();
  }, [screenId]);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('id, file_name, thumbnail_path, file_path')
        .order('file_name');
      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('rules')
        .select('*, media(id, file_name, thumbnail_path, file_path)')
        .order('priority', { ascending: false });

      if (screenId) {
        query = query.eq('screen_id', screenId);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const normalizedRule = normalizeRulePayload(newRule);
      const ruleData = {
        ...normalizedRule,
        user_id: user.id,
        screen_id: screenId || null, 
      };

      if (editingRule) {
        const { error } = await supabase.from('rules').update(ruleData).eq('id', editingRule.id);
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
      name: '', description: '', priority: 100,
      min_people: null, max_people: null,
      min_males: null, max_males: null,
      min_females: null, max_females: null,
      min_avg_age: null, max_avg_age: null,
      min_dwell_seconds: null, max_dwell_seconds: null,
      output_media_id: null, is_active: true,
    });
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      description: rule.description || '',
      priority: rule.priority,
      min_people: rule.min_people, max_people: rule.max_people,
      min_males: rule.min_males, max_males: rule.max_males,
      min_females: rule.min_females, max_females: rule.max_females,
      min_avg_age: rule.min_avg_age, max_avg_age: rule.max_avg_age,
      min_dwell_seconds: rule.min_dwell_seconds, max_dwell_seconds: rule.max_dwell_seconds,
      output_media_id: rule.output_media_id,
      is_active: rule.is_active,
    });
    setShowAddRule(true);
  };

  // --- Render ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Rules Management</h2>
            <p className="text-sm text-gray-500">Managing rules for: <span className="font-bold text-blue-600">{screenName || 'Global / All Screens'}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!showAddRule ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => { resetForm(); setEditingRule(null); setShowAddRule(true); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  Add Rule
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading rules...</div>
              ) : rules.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No context rules defined for this screen yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="text-lg font-bold text-gray-800">{rule.name}</h3>
                             <span className={`text-xs px-2 py-0.5 rounded-full ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                               {rule.is_active ? 'Active' : 'Inactive'}
                             </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">Priority: {rule.priority}</p>
                          
                          {/* Condensed Conditions View */}
                          <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                            {(rule.min_people || rule.max_people) && <div>👥 People: {rule.min_people || '0'} - {rule.max_people || '∞'}</div>}
                            {(rule.min_males || rule.max_males) && <div>👨 Males: {rule.min_males || '0'} - {rule.max_males || '∞'}</div>}
                            {(rule.min_females || rule.max_females) && <div>👩 Females: {rule.min_females || '0'} - {rule.max_females || '∞'}</div>}
                            {(rule.min_avg_age || rule.max_avg_age) && <div>🎂 Age: {rule.min_avg_age || '0'} - {rule.max_avg_age || '∞'}</div>}
                            {(rule.min_dwell_seconds || rule.max_dwell_seconds) && <div>⏱ Dwell: {rule.min_dwell_seconds || '0'}s - {rule.max_dwell_seconds || '∞'}s</div>}
                          </div>
                        </div>

                        {/* Media Preview */}
                        {rule.media && (
                           <div className="flex flex-col items-end">
                             <img src={rule.media.thumbnail_path || rule.media.file_path} alt="Thumbnail" className="w-16 h-16 object-cover rounded border" />
                             <span className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">{rule.media.file_name}</span>
                           </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-4 pt-3 border-t">
                        <button onClick={() => handleEditRule(rule)} className="text-sm text-blue-600 hover:underline font-medium">Edit</button>
                        <button onClick={() => handleDeleteRule(rule.id)} className="text-sm text-red-600 hover:underline font-medium">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // --- EDIT FORM ---
            <div className="bg-gray-50 p-6 rounded-lg border">
               <h3 className="text-lg font-bold mb-4">{editingRule ? 'Edit Rule' : 'New Rule'}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Rule Name</label>
                   <input type="text" value={newRule.name} onChange={e => setNewRule({...newRule, name: e.target.value})} className="w-full border p-2 rounded" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Priority (Higher runs first)</label>
                   <input type="number" value={newRule.priority} onChange={e => setNewRule({...newRule, priority: e.target.value})} className="w-full border p-2 rounded" />
                 </div>
               </div>

               <div className="mb-4">
                   <label className="block text-xs font-bold text-gray-500 mb-1">Trigger Conditions (Leave empty for any)</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <input type="number" placeholder="Min People" value={newRule.min_people ?? ''} onChange={e => setNewRule({...newRule, min_people: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Max People" value={newRule.max_people ?? ''} onChange={e => setNewRule({...newRule, max_people: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Min Males" value={newRule.min_males ?? ''} onChange={e => setNewRule({...newRule, min_males: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Max Males" value={newRule.max_males ?? ''} onChange={e => setNewRule({...newRule, max_males: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Min Females" value={newRule.min_females ?? ''} onChange={e => setNewRule({...newRule, min_females: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Max Females" value={newRule.max_females ?? ''} onChange={e => setNewRule({...newRule, max_females: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Min Age" value={newRule.min_avg_age ?? ''} onChange={e => setNewRule({...newRule, min_avg_age: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Max Age" value={newRule.max_avg_age ?? ''} onChange={e => setNewRule({...newRule, max_avg_age: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Min Dwell (s)" value={newRule.min_dwell_seconds ?? ''} onChange={e => setNewRule({...newRule, min_dwell_seconds: e.target.value})} className="border p-2 rounded" />
                      <input type="number" placeholder="Max Dwell (s)" value={newRule.max_dwell_seconds ?? ''} onChange={e => setNewRule({...newRule, max_dwell_seconds: e.target.value})} className="border p-2 rounded" />
                   </div>
               </div>

               <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Output Media</label>
                  <select value={newRule.output_media_id ?? ''} onChange={e => setNewRule({...newRule, output_media_id: e.target.value})} className="w-full border p-2 rounded">
                    <option value="">Select Content...</option>
                    {media.map(m => <option key={m.id} value={m.id}>{m.file_name}</option>)}
                  </select>
               </div>

               <div className="flex justify-between items-center">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={newRule.is_active} onChange={e => setNewRule({...newRule, is_active: e.target.checked})} />
                    <span className="text-sm font-medium">Rule Active</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddRule(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                    <button onClick={handleSaveRule} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Rule</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}