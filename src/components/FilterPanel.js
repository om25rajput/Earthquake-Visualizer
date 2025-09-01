import React from 'react';

const FilterPanel = ({ filters, onFilterChange, onReset, loading }) => {
  const handleMagnitudeChange = (field, value) => {
    onFilterChange({ [field]: parseFloat(value) });
  };

  const handleTimePeriodChange = (value) => {
    onFilterChange({ timePeriod: value });
  };

  const handleTsunamiToggle = () => {
    onFilterChange({ showTsunami: !filters.showTsunami });
  };

  const timePeriodOptions = [
    { value: '1hour', label: 'Last Hour' },
    { value: '6hours', label: 'Last 6 Hours' },
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: 'all', label: 'All Available' }
  ];

  return (
    <div>
      <div className="filter-group">
        <h3>Magnitude Range</h3>

        <div className="filter-control">
          <label>Minimum Magnitude</label>
          <input
            type="range"
            min="0"
            max="9"
            step="0.1"
            value={filters.minMagnitude}
            onChange={(e) => handleMagnitudeChange('minMagnitude', e.target.value)}
            disabled={loading}
          />
          <div className="filter-value">{filters.minMagnitude.toFixed(1)}</div>
        </div>

        <div className="filter-control">
          <label>Maximum Magnitude</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filters.maxMagnitude}
            onChange={(e) => handleMagnitudeChange('maxMagnitude', e.target.value)}
            disabled={loading}
          />
          <div className="filter-value">{filters.maxMagnitude.toFixed(1)}</div>
        </div>
      </div>

      <div className="filter-group">
        <h3>Time Period</h3>
        <div className="filter-control">
          <label>Show earthquakes from:</label>
          <select
            value={filters.timePeriod}
            onChange={(e) => handleTimePeriodChange(e.target.value)}
            disabled={loading}
          >
            {timePeriodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-group">
        <h3>Additional Filters</h3>
        <div className="filter-control">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.showTsunami}
              onChange={handleTsunamiToggle}
              disabled={loading}
              style={{ marginRight: '0.5rem' }}
            />
            Include Tsunami Warnings
          </label>
        </div>
      </div>

      <div className="magnitude-legend">
        <h3>Magnitude Scale Guide</h3>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
          <span className="legend-text">&lt; 3.0 - Micro (Usually not felt)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#84cc16' }}></div>
          <span className="legend-text">3.0-3.9 - Minor (Often felt)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#eab308' }}></div>
          <span className="legend-text">4.0-4.9 - Light (Noticeable shaking)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
          <span className="legend-text">5.0-5.9 - Moderate (Can cause damage)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
          <span className="legend-text">6.0-6.9 - Strong (Damage in populated areas)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#991b1b' }}></div>
          <span className="legend-text">7.0-7.9 - Major (Serious damage)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#7f1d1d' }}></div>
          <span className="legend-text">8.0+ - Great (Very serious damage)</span>
        </div>
      </div>

      <button 
        className="reset-button"
        onClick={onReset}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Reset Filters'}
      </button>
    </div>
  );
};

export default FilterPanel;