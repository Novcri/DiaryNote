import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePostFilter } from '../hooks/usePostFilter';
import AuthNavControls from './AuthNavControls';
import Calendar from './Calendar'; // Calendarをインポート
import './NavigationBar.css';

const NavigationBar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectedDate, handleDateSelect } = usePostFilter();
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DiaryNote</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated && <Link to="/post">Home</Link>}
        <Link to="/view">View</Link>
        <button className="calendar-icon-button" onClick={toggleCalendar}>
          📅
        </button>
      </div>
      <AuthNavControls />
      {showCalendar && (
        <div className="calendar-popup">
          <button className="calendar-close-button" onClick={() => setShowCalendar(false)}>✖</button>
          <Calendar onDateSelect={handleDateSelect} initialSelectedDate={selectedDate} />
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
