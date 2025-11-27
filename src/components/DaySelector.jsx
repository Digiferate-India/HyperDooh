import React from 'react';

const DAYS = [
  { id: 'Sun', label: 'Every Sunday' },
  { id: 'Mon', label: 'Every Monday' },
  { id: 'Tue', label: 'Every Tuesday' },
  { id: 'Wed', label: 'Every Wednesday' },
  { id: 'Thu', label: 'Every Thursday' },
  { id: 'Fri', label: 'Every Friday' },
  { id: 'Sat', label: 'Every Saturday' },
];

function DaySelector({ selectedDays, onChange }) {
  // selectedDays is a string like "Mon,Wed,Fri"
  const selectedArray = selectedDays ? selectedDays.split(',') : [];

  const toggleDay = (dayId) => {
    let newArray;
    if (selectedArray.includes(dayId)) {
      newArray = selectedArray.filter(d => d !== dayId);
    } else {
      newArray = [...selectedArray, dayId];
    }
    // Join back into a string
    onChange(newArray.join(','));
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {DAYS.map(day => {
        const isSelected = selectedArray.includes(day.id);
        return (
          <div 
            key={day.id}
            onClick={() => toggleDay(day.id)}
            className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className={`text-sm ${isSelected ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
              {day.label}
            </span>
            
            {/* Custom Checkbox Style */}
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              isSelected ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DaySelector;