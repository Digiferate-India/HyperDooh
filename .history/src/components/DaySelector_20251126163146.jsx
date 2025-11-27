import React from 'react';

const DAYS = [
  { id: 'Sun', label: 'S' },
  { id: 'Mon', label: 'M' },
  { id: 'Tue', label: 'T' },
  { id: 'Wed', label: 'W' },
  { id: 'Thu', label: 'T' },
  { id: 'Fri', label: 'F' },
  { id: 'Sat', label: 'S' },
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
    // Sort specific to week order if needed, or just join
    onChange(newArray.join(','));
  };

  return (
    <div className="flex gap-2 mt-1">
      {DAYS.map(day => (
        <button
          key={day.id}
          type="button"
          onClick={() => toggleDay(day.id)}
          className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
            selectedArray.includes(day.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title={day.id}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}

export default DaySelector;