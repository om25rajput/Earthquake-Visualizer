import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import FilterPanel from './components/FilterPanel';
import EducationPanel from './components/EducationPanel';
import StatsPanel from './components/StatsPanel';

const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('filters');
  const [filters, setFilters] = useState({
    minMagnitude: 0,
    maxMagnitude: 10,
    timePeriod: '24hours',
    showTsunami: true,
    region: 'all'
  });

  // Fetch earthquake data
  const fetchEarthquakes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(USGS_API_URL);
      const features = response.data.features || [];

      // Process earthquake data
      const processedEarthquakes = features.map(feature => ({
        id: feature.id,
        magnitude: feature.properties.mag,
        place: feature.properties.place,
        time: new Date(feature.properties.time),
        coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], // [lat, lng]
        depth: feature.geometry.coordinates[2],
        tsunami: feature.properties.tsunami,
        significance: feature.properties.sig,
        url: feature.properties.url,
        type: feature.properties.type
      })).filter(eq => eq.magnitude !== null && eq.coordinates[0] && eq.coordinates[1]);

      setEarthquakes(processedEarthquakes);
    } catch (err) {
      setError('Failed to fetch earthquake data. Please check your connection.');
      console.error('Error fetching earthquakes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter earthquakes based on current filters
  useEffect(() => {
    let filtered = earthquakes.filter(eq => {
      // Magnitude filter
      if (eq.magnitude < filters.minMagnitude || eq.magnitude > filters.maxMagnitude) {
        return false;
      }

      // Time filter
      const now = new Date();
      const timeDiff = now - eq.time;
      switch (filters.timePeriod) {
        case '1hour':
          if (timeDiff > 60 * 60 * 1000) return false;
          break;
        case '6hours':
          if (timeDiff > 6 * 60 * 60 * 1000) return false;
          break;
        case '24hours':
          if (timeDiff > 24 * 60 * 60 * 1000) return false;
          break;
        case '7days':
          if (timeDiff > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        default:
          break;
      }

      // Tsunami filter
      if (!filters.showTsunami && eq.tsunami) {
        return false;
      }

      return true;
    });

    setFilteredEarthquakes(filtered);
  }, [earthquakes, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchEarthquakes();
    // Set up auto-refresh every 15 minutes
    const interval = setInterval(fetchEarthquakes, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchEarthquakes]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      minMagnitude: 0,
      maxMagnitude: 10,
      timePeriod: '24hours',
      showTsunami: true,
      region: 'all'
    });
  };

  if (loading && earthquakes.length === 0) {
    return (
      <div className="app">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading earthquake data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>🌍 Earthquake Visualizer</h1>
          <p>Real-time seismic data for geography students</p>
        </div>

        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'filters' ? 'active' : ''}`}
            onClick={() => setActiveTab('filters')}
          >
            Filters
          </button>
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button 
            className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Learn
          </button>
        </div>

        <div className="sidebar-content">
          {error && (
            <div className="error">
              <p>{error}</p>
              <button onClick={fetchEarthquakes} style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          )}

          {activeTab === 'filters' && (
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              loading={loading}
            />
          )}

          {activeTab === 'stats' && (
            <StatsPanel
              earthquakes={filteredEarthquakes}
              totalEarthquakes={earthquakes.length}
            />
          )}

          {activeTab === 'education' && (
            <EducationPanel />
          )}
        </div>
      </div>

      <div className="map-container">
        <MapView earthquakes={filteredEarthquakes} />
      </div>
    </div>
  );
}

export default App;