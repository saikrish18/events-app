import React, { useEffect, useState } from 'react';

function NearbyEvents() {
  const [map, setMap] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const [events] = useState([
    {
      name: 'Live Standup-comedy',
      location: 'Hyderabad',
      date: '07/11/2023',
      coordinates: { lat: 17.3850, lng: 78.4867 },
      category: 'Category A',
      description: 'Live performance with fun, come and join',
      externalLink: 'https://events.fullhyderabad.com/live-stand-up-comedy-show-by-ashwin-srinivas/2023-november/tickets-dates-videos-reviews-591923-1.html',
    },
    {
      name: 'Wednesday Night Life',
      location: 'Dilsukhnagar',
      date: '07/11/2023',
      coordinates: { lat: 17.3168, lng: 78.5513 },
      category: 'Category B',
      description: 'Night Life dj event, fun loaded',
      externalLink: 'https://www.fullhyderabad.com/events-in-hyderabad-8th-november-2023-wednesday-nightlife-8738-r.html',
    },
    // Add more event objects as needed
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapOptions = {
            center: { lat: latitude, lng: longitude },
            zoom: 12,
          };
          const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);
          setMap(map);
          events.forEach((event) => {
            const marker = new window.google.maps.Marker({
              position: event.coordinates,
              map,
              title: event.name,
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div><b>${event.name}</b><br>${event.location}<br>${event.date}</div>`,
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
              setSelectedEvent(event);
            });
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Handle geolocation error
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle the case when geolocation is not supported
    }
  }, [events]);

  // Function to handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    map.setCenter(event.coordinates);
  };

  // Filter events based on category and date
  const filteredEvents = events.filter((event) => {
    if (filterCategory === 'all' || event.category === filterCategory) {
      if (filterDate === 'all' || event.date === filterDate) {
        return true;
      }
    }
    return false;
  });

  return (
    <div>
      <div id="map" ></div>
      <div>
        <h2>Nearby Events</h2>
        <div>
          <label>Filter by Category: </label>
          <select
            onChange={(e) => setFilterCategory(e.target.value)}
            value={filterCategory}
          >
            <option value="all">All</option>
            <option value="Category A">Category A</option>
            <option value="Category B">Category B</option>
          </select>
        </div>
        <div>
          <label>Filter by Date: </label>
          <select
            onChange={(e) => setFilterDate(e.target.value)}
            value={filterDate}
          >
            <option value="all">All</option>
            <option value="Date 1">Date 1</option>
            <option value="Date 2">Date 2</option>
          </select>
        </div>
        <ul>
          {filteredEvents.map((event, index) => (
            <li key={index} onClick={() => handleEventSelect(event)}>
              <strong>{event.name}</strong> - {event.location} ({event.date})
              <p>{event.description}</p>
              <a href={event.externalLink} target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {selectedEvent && (
          <div>
            <h3>Selected Event: {selectedEvent.name}</h3>
            <p>{selectedEvent.description}</p>
            <a href={selectedEvent.externalLink} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default NearbyEvents;
