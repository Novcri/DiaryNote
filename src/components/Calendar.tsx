import React, { useState, useEffect, useCallback } from 'react';
import { formatDateToYYYYMMDD, parseYYYYMMDDToDate } from '../utils/date';

interface CalendarProps {
  onDateSelect: (date: string | null) => void;
  initialSelectedDate?: string | null;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, initialSelectedDate = null }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(initialSelectedDate);

  useEffect(() => {
    setSelectedDate(initialSelectedDate);
  }, [initialSelectedDate]);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // 前月の空白を埋める
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (日) - 6 (土)
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, 1 - (firstDayOfWeek - i));
      days.push(prevMonthDay);
    }

    // 今月の日付
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // 次月の空白を埋める
    const totalCells = 42; // 6週間分のセル
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push(nextMonthDay);
    }

    return days;
  }, []);

  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const clickedDateStr = formatDateToYYYYMMDD(date);
    if (selectedDate === clickedDateStr) {
      // 既に選択されている日付を再度クリックしたら選択を解除
      setSelectedDate(null);
      onDateSelect(null);
    } else {
      setSelectedDate(clickedDateStr);
      onDateSelect(clickedDateStr);
    }
  };

  const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
  };

  const todayStr = formatDateToYYYYMMDD(new Date());

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days.map((date, index) => {
          const dateStr = formatDateToYYYYMMDD(date);
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <div
              key={index}
              className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'outside-month' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
      <button className="clear-date-button" onClick={() => handleDateClick(parseYYYYMMDDToDate(todayStr))}>
        日付選択をクリア
      </button>
    </div>
  );
};

export default Calendar;
