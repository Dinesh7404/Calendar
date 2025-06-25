import React, { useState, useEffect, useCallback, useRef } from "react";
import "/src/components/calendar.css";

// Sample events data
const sampleEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2025-06-25",
    time: "10:00 AM",
    type: "blue"
  },
  {
    id: 2,
    title: "Doctor Appointment",
    date: "2025-06-27",
    time: "2:30 PM",
    type: "pink"
  },
  {
    id: 3,
    title: "Project Deadline",
    date: "2025-06-30",
    time: "11:59 PM",
    type: "yellow"
  },
  {
    id: 4,
    title: "Birthday Party",
    date: "2025-07-05",
    time: "6:00 PM",
    type: "pink"
  },
  {
    id: 5,
    title: "Conference Call",
    date: "2025-06-23",
    time: "3:00 PM",
    type: "blue"
  },
  {
    id: 6,
    title: "Rath Yatra",
    date: "2025-06-27",
    time: "12:00 PM",
    type: "green"
  }
];

function Calendar({ initialEvents = sampleEvents, onEventChange = null }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", type: "blue" });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [viewEvent, setViewEvent] = useState(null);
  const [currentView, setCurrentView] = useState("year"); // Changed default to "year"
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [createBtnExpanded, setCreateBtnExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  // Add a ref to store the timeout ID
  const notificationTimeoutRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(windowWidth > 768);
  const [calendarDropdownOpen, setCalendarDropdownOpen] = useState(true);
  
  // Fix the variable declarations by adding const keyword
  const createDropdownRef = useRef(null);
  const createBtnRef = useRef(null);
  const timePickerRef = useRef(null);
  const timeInputRef = useRef(null);
  const today = new Date();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      // Auto-show sidebar on larger screens, hide on smaller screens
      if (width > 768 && !sidebarVisible) {
        setSidebarVisible(true);
      } else if (width <= 768 && sidebarVisible) {
        setSidebarVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarVisible]);

  useEffect(() => {
    if (onEventChange) {
      onEventChange(events);
    }
  }, [events, onEventChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      setSelectedDate(addDays(selectedDate, -1));
    } else if (e.key === 'ArrowRight') {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedDate(addDays(selectedDate, -7));
    } else if (e.key === 'ArrowDown') {
      setSelectedDate(addDays(selectedDate, 7));
    }
  }, [selectedDate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Date utility functions
  const format = (date, formatStr) => {
    const options = {
      'MMMM yyyy': { month: 'long', year: 'numeric' },
      'MMMM dd, yyyy': { month: 'long', day: '2-digit', year: 'numeric' },
      'EEE': { weekday: 'short' },
      'd': { day: 'numeric' }
    };
    return date.toLocaleDateString('en-US', options[formatStr] || {});
  };

  const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const subMonths = (date, months) => addMonths(date, -months);

  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const startOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    return new Date(start.setDate(diff));
  };

  const endOfWeek = (date) => {
    const end = new Date(date);
    const day = end.getDay();
    const diff = end.getDate() + (6 - day);
    return new Date(end.setDate(diff));
  };

  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };

  const isSameMonth = (date1, date2) => 
    date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();

  const isSameDay = (date1, date2) => 
    date1.getDate() === date2.getDate() && 
    date1.getMonth() === date2.getMonth() && 
    date1.getFullYear() === date2.getFullYear();

  const formatDateForEvents = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Replace the month navigation functions with year navigation
  const handlePrevYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNextYear = () => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  // Add the mini calendar navigation functions
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.time.trim()) {
      const event = {
        id: Date.now(),
        title: newEvent.title,
        date: formatDateForEvents(selectedDate),
        time: newEvent.time,
        type: newEvent.type
      };
      setEvents([...events, event]);
      setNewEvent({ title: "", time: "", type: "blue" });
      setShowAddEvent(false);
      
      // Clear any existing timer
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      // Show notification with brief duration (3 seconds)
      setNotificationText(`"${event.title}" added to your calendar on ${format(selectedDate, "MMMM dd, yyyy")}`);
      setShowNotification(true);
      
      // Store the timeout ID in the ref
      notificationTimeoutRef.current = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Reduced to 3 seconds for a standard notification duration
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setViewEvent(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    // When switching views, ensure we're seeing today in the selected view
    if (view !== currentView) {
      setSelectedDate(new Date());
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <div className="calendar-header-left">
        <div className="calendar-logo">
          <span className="calendar-icon">📆</span>
          <span className="calendar-title-text">Calendar</span>
        </div>
        <button onClick={goToToday} className="calendar-today-btn">
          Today
        </button>
        <div className="calendar-nav-buttons">
          <button onClick={handlePrevYear} className="calendar-nav-btn" aria-label="Previous Year">
            <span className="nav-chevron">‹</span>
          </button>
          <button onClick={handleNextYear} className="calendar-nav-btn" aria-label="Next Year">
            <span className="nav-chevron">›</span>
          </button>
        </div>
        <h2 className="calendar-title">
          {currentDate.getFullYear()}
        </h2>
        <div className="live-date-display">
          {formattedTime}
        </div>
      </div>
      <div className="calendar-header-right">
        <div className="calendar-view-options">
          <button 
            className={`view-option-btn ${currentView === "day" ? "active" : ""}`} 
            onClick={() => handleViewChange("day")}
          >
            Day
          </button>
          <button 
            className={`view-option-btn ${currentView === "week" ? "active" : ""}`} 
            onClick={() => handleViewChange("week")}
          >
            Week
          </button>
          <button 
            className={`view-option-btn ${currentView === "month" ? "active" : ""}`} 
            onClick={() => handleViewChange("month")}
          >
            Month
          </button>
          <button 
            className={`view-option-btn ${currentView === "year" ? "active" : ""}`} 
            onClick={() => handleViewChange("year")}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );

  // Update the renderTimeScale function to include timezone
  const renderTimeScale = () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      if (i === 0) return "";
      const hour = i % 12 || 12;
      const ampm = i < 12 ? "AM" : "PM";
      return `${hour} ${ampm}`;
    });

    // Get local timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneAbbr = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];

    return (
      <div className="time-scale">
        <div className="time-scale-header">
          <div className="timezone-label">GMT+05:30</div>
        </div>
        {hours.map((hour, i) => (
          <div key={i} className="time-slot">
            <div className="time-label">{hour}</div>
          </div>
        ))}
      </div>
    );
  };

  // Update the renderWeekDays function to match the design
  const renderWeekDays = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const days = [];
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfCurrentWeek, i);
      const isToday = isSameDay(day, today);
      const dayNumber = day.getDate();
      
      days.push(
        <div key={i} className={`week-day ${isToday ? 'today' : ''}`}>
          <div className="week-day-name">{dayNames[i]}</div>
          <div className={`week-day-number ${isToday ? 'today-circle' : ''}`}>
            {dayNumber}
          </div>
        </div>
      );
    }

    return days;
  };

  // Update the renderWeekView function with improved styling
  const renderWeekView = () => {
    const startOfCurrentWeek = startOfWeek(selectedDate);
    const daysInWeek = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfCurrentWeek, i);
      const dayEvents = events.filter(e => e.date === formatDateForEvents(day));
      daysInWeek.push({ day, events: dayEvents });
    }
    
    return (
      <div className="week-view">
        <div className="week-header">
          <div className="time-scale-header"></div>
          {renderWeekDays()}
        </div>
        <div className="week-body">
          <div className="week-timeline">
            {renderTimeScale()}
            <div className="week-grid">
              {daysInWeek.map((dayInfo, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`week-day-column ${isSameDay(dayInfo.day, today) ? 'today-column' : ''}`}
                  onClick={() => setSelectedDate(dayInfo.day)}
                >
                  {/* Horizontal hour lines */}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="hour-line" style={{ top: `${i * 60}px` }}></div>
                  ))}
                  
                  {/* Events */}
                  {dayInfo.events.map((event) => {
                    // Convert time string to position in timeline
                    const timeParts = event.time.match(/(\d+):(\d+) (AM|PM)/);
                    if (!timeParts) return null;
                    
                    let hour = parseInt(timeParts[1]);
                    const minute = parseInt(timeParts[2]);
                    const ampm = timeParts[3];
                    
                    if (ampm === "PM" && hour !== 12) hour += 12;
                    if (ampm === "AM" && hour === 12) hour = 0;
                    
                    const topPosition = hour * 60 + minute;
                    
                    return (
                      <div 
                        key={event.id} 
                        className={`timeline-event event-${event.type}`}
                        style={{
                          top: `${topPosition}px`,
                          height: '30px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewEvent(event);
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // New function to render a single month for the year view
  const renderMonthCard = (month) => {
    const monthDate = new Date(currentDate.getFullYear(), month, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    // Add indices to the day names to create unique keys
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
    
    const days = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      const formattedDay = day.getDate();
      const isToday = isSameDay(day, today);
      const isCurrentMonth = day.getMonth() === month;
      
      days.push(
        <div 
          key={day.toISOString()} 
          className={`month-cell ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'outside-month' : ''}`}
          onClick={() => {
            setSelectedDate(new Date(day));
            // Remove this line to stay in year view
            // setCurrentView("month");
          }}
        >
          {formattedDay}
        </div>
      );
      
      day = addDays(day, 1);
    }
    
    return (
      <div className="month-card">
        <div className="month-card-header">{monthName}</div>
        <div className="month-card-grid">
          {dayNames.map((name, index) => (
            <div key={`day-header-${index}`} className="month-day-header">{name}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // New function to render the year view
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    
    return (
      <div className="year-view">
        {months.map(month => renderMonthCard(month))}
      </div>
    );
  };

  // Add this function to render the month view day headers (SUN, MON, TUE, etc.)
  const renderDays = () => {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    return (
      <div className="month-day-header-row">
        {dayNames.map((day, i) => (
          <div key={i} className="month-day-name">{day}</div>
        ))}
      </div>
    );
  };

  // Update the month view render function to match the design
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    // Get month name and year for display
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const yearNum = currentDate.getFullYear();
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Create calendar rows
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const dayNumber = day.getDate();
        const isToday = isSameDay(day, today);
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, currentDate);
        
        // Get events for this day
        const dayEvents = events.filter(event => event.date === formatDateForEvents(day));
        
        // Show max 3 events per cell, with +N more if needed
        const displayEvents = dayEvents.slice(0, 3);
        const moreEventsCount = dayEvents.length - 3;
        
        days.push(
          <div
            key={day.toString()}
            className={`month-cell-wrapper ${!isCurrentMonth ? 'outside-month' : ''}`}
            onClick={() => handleCellClick(cloneDay)}
          >
            {isToday && <div className="current-day-marker"></div>}
            <div className={`month-cell-date ${isToday ? 'today-cell' : ''} ${isSelected ? 'selected-cell' : ''}`}>
              <span className="month-date-label">{dayNumber}</span>
            </div>
            
            <div className="month-cell-events">
              {displayEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`month-event event-${event.type}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewEvent(event);
                  }}
                  title={`${event.time} - ${event.title}`}
                >
                  {event.title}
                </div>
              ))}
              
              {moreEventsCount > 0 && (
                <div className="more-events" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(cloneDay);
                  setCurrentView("day");
                }}>
                  +{moreEventsCount} more
                </div>
              )}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="month-row">
          {days}
        </div>
      );
      
      days = [];
    }
    
    return (
      <div className="month-view">
        <div className="month-header">
          <h2>{monthName} {yearNum}</h2>
        </div>
        {renderDays()}
        <div className="month-grid">
          {rows}
        </div>
      </div>
    );
  };

  // Add this function for the day view
  const renderDayView = () => {
    const dayEvents = events.filter(e => e.date === formatDateForEvents(selectedDate));
    const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNumber = selectedDate.getDate();
    const monthYear = selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
    // Use today instead of currentTime for isSameDay check
    const isToday = isSameDay(selectedDate, today);
    
    // Calculate current time position more precisely
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();
    
    // Position calculation (each hour = 60px) - fixed to match actual time
    const currentTimePosition = ((currentHour + 1) * 60) + currentMinute + (currentSecond / 60);
    
    return (
      <div className="day-view">
        <div className="day-header">
          <div className="day-date-display">
            <div className="day-date-circle">
              <div className="day-name">{dayOfWeek}</div>
              <div className="day-number">{dayNumber}</div>
            </div>
            <div className="day-full-date">
              {monthYear}
            </div>
          </div>
        </div>
        <div className="day-body">
          <div className="day-timeline">
            {renderTimeScale()}
            <div className="day-events-grid">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="hour-slot">
                  <div className="hour-line"></div>
                </div>
              ))}
              
              {/* Current time indicator with improved animation */}
              {isToday && (
                <div 
                  className="current-time-indicator" 
                  style={{ top: `${currentTimePosition}px` }}
                >
                  <div className="time-indicator-circle"></div>
                  <div className="time-indicator-line"></div>
                </div>
              )}
              
              {dayEvents.map((event) => {
                // Convert time string to position in timeline
                const timeParts = event.time.match(/(\d+):(\d+) (AM|PM)/);
                if (!timeParts) return null;
                
                let hour = parseInt(timeParts[1]);
                const minute = parseInt(timeParts[2]);
                const ampm = timeParts[3];
                
                if (ampm === "PM" && hour !== 12) hour += 12;
                if (ampm === "AM" && hour === 12) hour = 0;
                
                const topPosition = hour * 60 + minute;
                
                return (
                  <div 
                    key={event.id} 
                    className={`timeline-event day-event event-${event.type}`}
                    style={{
                      top: `${topPosition}px`,
                      height: '30px',
                      width: 'calc(100% - 20px)'
                    }}
                    onClick={() => setViewEvent(event)}
                  >
                    {event.title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the renderCalendarContent function to use the new renderMonthView function
  const renderCalendarContent = () => {
    switch (currentView) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "year":
        return renderYearView();
      case "month":
        return renderMonthView();
      default:
        return renderYearView(); // Default to year view instead of undefined case
    }
  };

  const renderCreateButton = () => (
    <div className="create-button-wrapper">
      <button 
        onClick={() => {
          // Set a default time when opening the modal
          const now = new Date();
          const hour = now.getHours() % 12 || 12;
          const minute = Math.floor(now.getMinutes() / 15) * 15;
          const period = now.getHours() >= 12 ? "PM" : "AM";
          setNewEvent({...newEvent, time: `${hour}:${minute < 10 ? '0' + minute : minute} ${period}`});
          setShowAddEvent(true);
        }} 
        className="create-button"
        aria-label="Create"
      >
        <svg viewBox="0 0 36 36" fill="currentColor" width="24" height="24">
          <path d="M26 18h-8v8h-2v-8H8v-2h8V8h2v8h8v2z"></path>
        </svg>
        Create
      </button>
    </div>
  );

  // Update renderSidebar to include dropdown functionality
  const renderSidebar = () => (
    <div className={`calendar-sidebar ${sidebarVisible ? 'visible' : ''}`}>
      {renderCreateButton()}
      <div className="mini-calendar">
        <div className="mini-calendar-header">
          <div className="mini-month-nav">
            <button className="mini-nav-btn" onClick={handlePrevMonth}>&lt;</button>
            <span>{format(currentDate, "MMMM yyyy")}</span>
            <button className="mini-nav-btn" onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>
        <div className="mini-calendar-days">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`header-${index}`} className="mini-calendar-day-header">{day}</div>
          ))}
        </div>
        <div className="mini-calendar-grid">
          {generateMiniCalendarDays()}
        </div>
      </div>
      <div className="calendar-categories">
        <div className="category-section">
          <div 
            className="category-header" 
            onClick={() => setCalendarDropdownOpen(!calendarDropdownOpen)}
            aria-expanded={calendarDropdownOpen}
            role="button"
            tabIndex={0}
          >
            <span>My calendars</span>
            <button 
              className={`category-toggle-btn ${calendarDropdownOpen ? 'open' : 'closed'}`}
              aria-label={calendarDropdownOpen ? "Collapse calendars" : "Expand calendars"}
              onClick={(e) => {
                e.stopPropagation();
                setCalendarDropdownOpen(!calendarDropdownOpen);
              }}
            >
              {calendarDropdownOpen ? '▼' : '►'}
            </button>
          </div>
          <div 
            className={`category-list ${calendarDropdownOpen ? 'expanded' : 'collapsed'}`}
            aria-hidden={!calendarDropdownOpen}
          >
            <div className="category-item">
              <div className="category-checkbox blue-checkbox">
                <input type="checkbox" id="work" defaultChecked />
                <label htmlFor="work"></label>
              </div>
              <label htmlFor="work" className="category-label">Work</label>
            </div>
            <div className="category-item">
              <div className="category-checkbox pink-checkbox">
                <input type="checkbox" id="personal" defaultChecked />
                <label htmlFor="personal"></label>
              </div>
              <label htmlFor="personal" className="category-label">Personal</label>
            </div>
            <div className="category-item">
              <div className="category-checkbox yellow-checkbox">
                <input type="checkbox" id="important" defaultChecked />
                <label htmlFor="important"></label>
              </div>
              <label htmlFor="important" className="category-label">Important</label>
            </div>
            <div className="category-item">
              <div className="category-checkbox green-checkbox">
                <input type="checkbox" id="holidays" defaultChecked />
                <label htmlFor="holidays"></label>
              </div>
              <label htmlFor="holidays" className="category-label">Holidays</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const generateMiniCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    let day = new Date(startDate);
    const days = [];
    
    while (day <= endDate) {
      const formattedDay = format(day, "d");
      const isToday = isSameDay(day, today);
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, currentDate);
      const isSunday = day.getDay() === 0; // Check if the day is Sunday
      
      const cloneDay = new Date(day); // Create a clone to avoid reference issues
      
      days.push(
        <div 
          key={day.getTime()} 
          className={`mini-calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} 
                     ${!isCurrentMonth ? 'outside-month' : ''} ${isSunday ? 'sunday' : ''}`}
          onClick={() => {
            setSelectedDate(cloneDay);
            // Switch to month view when a date is selected in mini-calendar
            setCurrentView("month");
            // If month is different, update currentDate as well
            if (!isSameMonth(cloneDay, currentDate)) {
              setCurrentDate(new Date(cloneDay));
            }
          }}
        >
          {formattedDay}
        </div>
      );
      
      day = addDays(day, 1);
    }
    
    return days;
  };

  // Handle clicks outside the create dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target) &&
          createBtnRef.current && !createBtnRef.current.contains(event.target)) {
        setShowCreateDropdown(false);
        setCreateBtnExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateClick = () => {
    if (!createBtnExpanded) {
      setCreateBtnExpanded(true);
      setTimeout(() => {
        setShowCreateDropdown(true);
      }, 300);
    } else {
      setShowCreateDropdown(!showCreateDropdown);
      if (showCreateDropdown) {
        setTimeout(() => {
          setCreateBtnExpanded(false);
        }, 300);
      }
    }
  };

  const handleCreateEvent = (type) => {
    setShowCreateDropdown(false);
    setCreateBtnExpanded(false);
    
    // Set the default event type based on selection
    setNewEvent({ ...newEvent, type });
    setShowAddEvent(true);
  };

  // Enhanced cell click function for better interactivity
  const handleCellClick = (date) => {
    setSelectedDate(date);
    // Provide visual feedback with a subtle animation
    const element = document.activeElement;
    if (element) {
      element.classList.add('cell-clicked');
      setTimeout(() => {
        element.classList.remove('cell-clicked');
      }, 200);
    }
  };

  // Update renderCells to use the enhanced click handler
  const renderCells = () => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);
    const days = [];
    let day = new Date(startOfCurrentMonth);

    while (day <= endOfCurrentMonth) {
      const formatted = format(day, "d");
      const isToday = isSameDay(day, today);
      const isSelected = isSameDay(day, selectedDate);
      const cellClass = `calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;

      // Clone the day object to avoid reference issues
      const cloneDay = new Date(day);

      days.push(
        <div
          key={day.getTime()}
          onClick={() => handleCellClick(cloneDay)}
          className={cellClass}
          tabIndex={0}
          aria-label={`Day ${formatted}${isToday ? ", today" : ""}${isSelected ? ", selected" : ""}`}
        >
          <div className="calendar-cell-content">
            {formatted}
          </div>
        </div>
      );
      
      day = addDays(day, 1);
    }

    return days;
  };

  // Update the useEffect for real-time updates to ensure smooth animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for smooth movement
    
    return () => clearInterval(timer);
  }, []);

  // Format current time for display
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(currentTime);

  // Fix the handleTimeSelect function to properly handle time selection
  const handleTimeSelect = (hour, minute, period) => {
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    setNewEvent({...newEvent, time: `${formattedHour}:${formattedMinute} ${period}`});
    setShowTimePicker(false);
  };
  
  // Update the time picker rendering function for better dropdown behavior and selection
  const renderTimePicker = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
    const minutes = [0, 15, 30, 45];
    const periods = ["AM", "PM"];
    
    // Parse current selection for highlighting selected options
    const currentTime = newEvent.time;
    const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
    const selectedHour = parsedTime ? parseInt(parsedTime[1]) : 12;
    const selectedMinute = parsedTime ? parseInt(parsedTime[2]) : 0;
    const selectedPeriod = parsedTime ? parsedTime[3] : 'AM';
    
    // Set initial scroll position to show selected values
    useEffect(() => {
      if (showTimePicker) {
        setTimeout(() => {
          const hourEl = document.getElementById(`hour-${selectedHour}`);
          const minuteEl = document.getElementById(`minute-${selectedMinute}`);
          const periodEl = document.getElementById(`period-${selectedPeriod}`);
          
          if (hourEl) hourEl.scrollIntoView({ block: 'center', behavior: 'auto' });
          if (minuteEl) minuteEl.scrollIntoView({ block: 'center', behavior: 'auto' });
          if (periodEl) periodEl.scrollIntoView({ block: 'center', behavior: 'auto' });
        }, 100);
      }
    }, [showTimePicker, selectedHour, selectedMinute, selectedPeriod]);
    
    return (
      <div className="time-picker-dropdown">
        <div className="time-picker-container">
          <div className="time-picker-column">
            <div className="time-picker-header">Hour</div>
            <div className="time-picker-options">
              {hours.map(hour => (
                <div 
                  key={`hour-${hour}`}
                  id={`hour-${hour}`}
                  className={`time-picker-option ${selectedHour === hour ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(hour, selectedMinute, selectedPeriod)}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
          <div className="time-picker-column">
            <div className="time-picker-header">Minute</div>
            <div className="time-picker-options">
              {minutes.map(minute => (
                <div 
                  key={`minute-${minute}`}
                  id={`minute-${minute}`}
                  className={`time-picker-option ${selectedMinute === minute ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(selectedHour, minute, selectedPeriod)}
                >
                  {minute < 10 ? `0${minute}` : minute}
                </div>
              ))}
            </div>
          </div>
          <div className="time-picker-column">
            <div className="time-picker-header">AM/PM</div>
            <div className="time-picker-options">
              {periods.map(period => (
                <div 
                  key={`period-${period}`}
                  id={`period-${period}`}
                  className={`time-picker-option ${selectedPeriod === period ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(selectedHour, selectedMinute, period)}
                >
                  {period}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the showAddEvent modal with improved time picker handling
  return (
    <div className="calendar-app-container google-calendar-style">
      {renderHeader()}
      <div className="google-calendar-main">
        {renderSidebar()}
        <div className="calendar-content-wrapper">
          <div className={`calendar-content ${currentView}-view-content`}>
            {renderCalendarContent()}
          </div>
        </div>
        {windowWidth <= 768 && (
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarVisible(!sidebarVisible)}
            aria-label="Toggle sidebar"
          >
            {sidebarVisible ? "×" : "☰"}
          </button>
        )}
      </div>

      {viewEvent && (
        <div className="event-detail-modal google-modal">
          <div className="event-detail-content">
            <div className={`event-color-bar event-${viewEvent.type}-bar`}></div>
            <div className="event-close-container">
              <button 
                onClick={() => setViewEvent(null)} 
                className="event-close-btn"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <h4 className="event-title">{viewEvent.title}</h4>
            <div className="event-detail-field">
              <div className="event-detail-icon">🕒</div>
              <div className="event-detail-text">
                {format(new Date(viewEvent.date), "MMMM dd, yyyy")} • {viewEvent.time}
              </div>
            </div>
            <div className="event-actions">
              <button 
                onClick={() => handleDeleteEvent(viewEvent.id)} 
                className="event-delete-btn"
                aria-label="Delete event"
              >
                <span className="delete-icon">🗑️</span> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEvent && (
        <div className="event-add-modal google-style compact-modal">
          <div className="event-header">
            <button onClick={() => setShowAddEvent(false)} className="event-close-btn">×</button>
            <h4>Add to calendar: {format(selectedDate, "MMMM dd, yyyy")}</h4>
          </div>
          <div className="event-add-fields">
            <input
              type="text"
              placeholder="Add title"
              className="event-title-input"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              aria-label="Event title"
            />
            <div className="event-time-row">
              <div className="event-time-icon">🕒</div>
              <div className="time-picker-wrapper">
                <input
                  type="text"
                  placeholder="Select time"
                  className="event-time-input"
                  value={newEvent.time}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTimePicker(!showTimePicker);
                  }}
                  ref={timeInputRef}
                  readOnly
                  aria-label="Event time"
                />
                {showTimePicker && (
                  <div 
                    className="time-picker-dropdown" 
                    ref={timePickerRef}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="time-picker-container">
                      <div className="time-picker-column">
                        <div className="time-picker-header">Hour</div>
                        <div className="time-picker-options">
                          {Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i).map(hour => {
                            const currentTime = newEvent.time;
                            const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
                            const selectedHour = parsedTime ? parseInt(parsedTime[1]) : 12;
                            
                            return (
                              <div 
                                key={`hour-${hour}`}
                                id={`hour-${hour}`}
                                className={`time-picker-option ${selectedHour === hour ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentTime = newEvent.time;
                                  const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
                                  const selectedMinute = parsedTime ? parseInt(parsedTime[2]) : 0;
                                  const selectedPeriod = parsedTime ? parsedTime[3] : 'AM';
                                  handleTimeSelect(hour, selectedMinute, selectedPeriod);
                                }}
                              >
                                {hour}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="time-picker-column">
                        <div className="time-picker-header">Minute</div>
                        <div className="time-picker-options">
                          {[0, 15, 30, 45].map(minute => {
                            const currentTime = newEvent.time;
                            const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
                            const selectedMinute = parsedTime ? parseInt(parsedTime[2]) : 0;
                            
                            return (
                              <div 
                                key={`minute-${minute}`}
                                id={`minute-${minute}`}
                                className={`time-picker-option ${selectedMinute === minute ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentTime = newEvent.time;
                                  const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
                                  const selectedHour = parsedTime ? parseInt(parsedTime[1]) : 12;
                                  const selectedPeriod = parsedTime ? parsedTime[3] : 'AM';
                                  handleTimeSelect(selectedHour, minute, selectedPeriod);
                                }}
                              >
                                {minute < 10 ? `0${minute}` : minute}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="time-picker-column">
                        <div className="time-picker-header">AM/PM</div>
                        <div className="time-picker-options">
                          {["AM", "PM"].map(period => {
                            const currentTime = newEvent.time;
                            const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
                            const selectedPeriod = parsedTime ? parsedTime[3] : 'AM';
                            
                            return (
                              <div 
                                key={`period-${period}`}
                                id={`period-${period}`}
                                className={`time-picker-option ${selectedPeriod === period ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentTime = newEvent.time;
                                  const parsedTime = currentTime.match(/(\d+):(\d+)\s(AM|PM)/);
                                  const selectedHour = parsedTime ? parseInt(parsedTime[1]) : 12;
                                  const selectedMinute = parsedTime ? parseInt(parsedTime[2]) : 0;
                                  handleTimeSelect(selectedHour, selectedMinute, period);
                                }}
                              >
                                {period}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="event-type-row">
              <div className="event-type-icon">🏷️</div>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                aria-label="Event category"
                className="event-type-select"
              >
                <option value="blue">Work</option>
                <option value="pink">Personal</option>
                <option value="yellow">Important</option>
                <option value="green">Holidays</option>
              </select>
            </div>
            <div className="event-add-actions">
              <button onClick={handleAddEvent} className="event-save-btn">Save</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification for event added */}
      <div className={`event-added-notification ${showNotification ? 'visible' : ''}`}>
        {notificationText}
      </div>
    </div>
  );
}

export default Calendar;