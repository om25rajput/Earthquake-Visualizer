import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom earthquake marker icons
const createEarthquakeIcon = (magnitude) => {
  let color = '#22c55e'; // Green for micro earthquakes
  let size = 8;

  if (magnitude >= 8.0) {
    color = '#7f1d1d'; // Dark red
    size = 24;
  } else if (magnitude >= 7.0) {
    color = '#991b1b'; // Red
    size = 20;
  } else if (magnitude >= 6.0) {
    color = '#dc2626'; // Red
    size = 16;
  } else if (magnitude >= 5.0) {
    color = '#f97316'; // Orange
    size = 14;
  } else if (magnitude >= 4.0) {
    color = '#eab308'; // Yellow
    size = 12;
  } else if (magnitude >= 3.0) {
    color = '#84cc16'; // Light green
    size = 10;
  }

  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: all 0.2s;
    "></div>`,
    className: 'earthquake-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Format earthquake data for display
const formatEarthquakeData = (earthquake) => {
  const timeString = earthquake.time.toLocaleString();
  const magnitudeColor = earthquake.magnitude >= 5.0 ? '#dc2626' : '#374151';

  return `
    <div class="earthquake-popup">
      <h4>${earthquake.place || 'Unknown location'}</h4>
      <p><strong>Magnitude:</strong> <span class="magnitude" style="color: ${magnitudeColor}">${earthquake.magnitude.toFixed(1)}</span></p>
      <p><strong>Depth:</strong> ${earthquake.depth ? earthquake.depth.toFixed(1) + ' km' : 'Unknown'}</p>
      <p><strong>Time:</strong> <span class="time">${timeString}</span></p>
      ${earthquake.tsunami ? '<p><strong>⚠️ Tsunami Alert</strong></p>' : ''}
      ${earthquake.url ? `<p><a href="${earthquake.url}" target="_blank" rel="noopener noreferrer">View Details →</a></p>` : ''}
    </div>
  `;
};

// Legend component
const Legend = () => {
  const legendItems = [
    { range: '< 3.0', color: '#22c55e', label: 'Micro' },
    { range: '3.0-3.9', color: '#84cc16', label: 'Minor' },
    { range: '4.0-4.9', color: '#eab308', label: 'Light' },
    { range: '5.0-5.9', color: '#f97316', label: 'Moderate' },
    { range: '6.0-6.9', color: '#dc2626', label: 'Strong' },
    { range: '7.0-7.9', color: '#991b1b', label: 'Major' },
    { range: '8.0+', color: '#7f1d1d', label: 'Great' }
  ];

  const map = useMap();

  React.useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.style.background = 'rgba(255, 255, 255, 0.95)';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      div.style.fontSize = '12px';
      div.style.lineHeight = '18px';

      div.innerHTML = '<strong>Earthquake Magnitude</strong><br>';

      legendItems.forEach(item => {
        div.innerHTML += `
          <div style="display: flex; align-items: center; margin: 2px 0;">
            <div style="width: 12px; height: 12px; background-color: ${item.color}; border-radius: 50%; margin-right: 6px; border: 1px solid rgba(0,0,0,0.2);"></div>
            <span>${item.range} - ${item.label}</span>
          </div>
        `;
      });

      return div;
    };

    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [map]);

  return null;
};

const MapView = ({ earthquakes }) => {
  const defaultCenter = [20, 0]; // Center of the world map
  const defaultZoom = 2;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {earthquakes.map((earthquake) => (
        <Marker
          key={earthquake.id}
          position={earthquake.coordinates}
          icon={createEarthquakeIcon(earthquake.magnitude)}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ __html: formatEarthquakeData(earthquake) }} />
          </Popup>
        </Marker>
      ))}

      <Legend />
    </MapContainer>
  );
};

export default MapView;