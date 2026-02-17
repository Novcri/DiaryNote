import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePostFilter } from '../hooks/usePostFilter';
import { usePostFiltering } from '../hooks/usePostFiltering'; // usePostFilteringをインポート
import AuthNavControls from './AuthNavControls';
import Calendar from './Calendar';
import './NavigationBar.css';

const NavigationBar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { selectedDate, handleDateSelect } = usePostFilter();
  const { highlightedDates } = usePostFiltering(); // highlightedDates を取得
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarPopupRef = useRef<HTMLDivElement>(null); // calendarPopupRef に名前を変更

  const toggleCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  // ポップアップの背景部分がクリックされたときに閉じるハンドラ
  const handlePopupClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // クリックされた要素がcalendarPopupRef自身である場合（背景部分がクリックされた場合）
    if (calendarPopupRef.current && event.target === calendarPopupRef.current) {
      setShowCalendar(false);
    }
  };

  // mousedown イベントリスナーは不要になったため削除

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
        <div className="calendar-popup" ref={calendarPopupRef} onClick={handlePopupClick}> {/* onClick を追加 */}
          <button className="calendar-close-button" onClick={() => setShowCalendar(false)}>✖</button>
          {/* カレンダー本体へのクリックイベント伝播を停止 */}
          <div onClick={e => e.stopPropagation()}> 
            <Calendar onDateSelect={handleDateSelect} initialSelectedDate={selectedDate} highlightedDates={highlightedDates} /> {/* highlightedDates を渡す */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
