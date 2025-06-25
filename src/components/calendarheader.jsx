import React from 'react';

const CalendarHeader = ({ month, year, onPrev, onNext }) => {
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  return (
    <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-md">
      <button onClick={onPrev} className="bg-blue-800 px-3 py-1 rounded">◀</button>
      <h2 className="text-xl font-bold">{monthName} {year}</h2>
      <button onClick={onNext} className="bg-blue-800 px-3 py-1 rounded">▶</button>
    </div>
  );
};

export default CalendarHeader;
