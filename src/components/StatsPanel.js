import React, { useMemo } from 'react';

const StatsPanel = ({ earthquakes, totalEarthquakes }) => {
  const stats = useMemo(() => {
    if (!earthquakes || earthquakes.length === 0) {
      return {
        count: 0,
        averageMagnitude: 0,
        strongestEarthquake: null,
        recentEarthquake: null,
        magnitudeDistribution: {},
        depthDistribution: { shallow: 0, intermediate: 0, deep: 0 },
        tsunamiAlerts: 0
      };
    }

    // Calculate basic statistics
    const magnitudes = earthquakes.map(eq => eq.magnitude).filter(mag => mag !== null);
    const averageMagnitude = magnitudes.length > 0 ? magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length : 0;

    // Find strongest earthquake
    const strongestEarthquake = earthquakes.reduce((strongest, current) => 
      current.magnitude > (strongest?.magnitude || 0) ? current : strongest
    , null);

    // Find most recent earthquake
    const recentEarthquake = earthquakes.reduce((recent, current) => 
      current.time > (recent?.time || new Date(0)) ? current : recent
    , null);

    // Magnitude distribution
    const magnitudeDistribution = earthquakes.reduce((dist, eq) => {
      const mag = Math.floor(eq.magnitude);
      const key = mag >= 8 ? '8+' : mag < 2 ? '<2' : `${mag}-${mag + 0.9}`;
      dist[key] = (dist[key] || 0) + 1;
      return dist;
    }, {});

    // Depth distribution
    const depthDistribution = earthquakes.reduce((dist, eq) => {
      if (eq.depth === null || eq.depth === undefined) return dist;
      if (eq.depth <= 70) dist.shallow++;
      else if (eq.depth <= 300) dist.intermediate++;
      else dist.deep++;
      return dist;
    }, { shallow: 0, intermediate: 0, deep: 0 });

    // Tsunami alerts
    const tsunamiAlerts = earthquakes.filter(eq => eq.tsunami === 1).length;

    return {
      count: earthquakes.length,
      averageMagnitude,
      strongestEarthquake,
      recentEarthquake,
      magnitudeDistribution,
      depthDistribution,
      tsunamiAlerts
    };
  }, [earthquakes]);

  const formatTime = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.count}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalEarthquakes}</div>
          <div className="stat-label">Total Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageMagnitude.toFixed(1)}</div>
          <div className="stat-label">Average Magnitude</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.tsunamiAlerts}</div>
          <div className="stat-label">Tsunami Alerts</div>
        </div>
      </div>

      {stats.strongestEarthquake && (
        <div className="education-section">
          <h3>🔥 Strongest Recent Earthquake</h3>
          <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #fecaca' }}>
            <p><strong>Magnitude:</strong> {stats.strongestEarthquake.magnitude.toFixed(1)}</p>
            <p><strong>Location:</strong> {stats.strongestEarthquake.place}</p>
            <p><strong>Time:</strong> {formatTime(stats.strongestEarthquake.time)}</p>
            <p><strong>Depth:</strong> {stats.strongestEarthquake.depth ? `${stats.strongestEarthquake.depth.toFixed(1)} km` : 'Unknown'}</p>
          </div>
        </div>
      )}

      {stats.recentEarthquake && (
        <div className="education-section">
          <h3>⏰ Most Recent Earthquake</h3>
          <div style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #bae6fd' }}>
            <p><strong>Magnitude:</strong> {stats.recentEarthquake.magnitude.toFixed(1)}</p>
            <p><strong>Location:</strong> {stats.recentEarthquake.place}</p>
            <p><strong>Time:</strong> {formatTime(stats.recentEarthquake.time)}</p>
            <p><strong>Depth:</strong> {stats.recentEarthquake.depth ? `${stats.recentEarthquake.depth.toFixed(1)} km` : 'Unknown'}</p>
          </div>
        </div>
      )}

      <div className="education-section">
        <h3>📊 Magnitude Distribution</h3>
        <div>
          {Object.entries(stats.magnitudeDistribution)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([range, count]) => {
              const percentage = stats.count > 0 ? (count / stats.count * 100).toFixed(1) : 0;
              return (
                <div key={range} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Magnitude {range}:</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: `${Math.max(percentage, 2)}px`, 
                      height: '12px', 
                      backgroundColor: '#3b82f6', 
                      marginRight: '0.5rem',
                      borderRadius: '2px'
                    }}></div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', minWidth: '60px' }}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="education-section">
        <h3>🌍 Depth Distribution</h3>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Shallow (0-70km):</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{stats.depthDistribution.shallow}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Intermediate (70-300km):</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{stats.depthDistribution.intermediate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem' }}>Deep (300km+):</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{stats.depthDistribution.deep}</span>
          </div>
        </div>
        <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#f9fafb', borderRadius: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
          Most damaging earthquakes occur at shallow depths where energy reaches the surface more easily.
        </div>
      </div>

      {stats.count > 0 && (
        <div className="education-section">
          <h3>📈 Activity Summary</h3>
          <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
            <p>
              Currently displaying <strong>{stats.count}</strong> earthquakes out of <strong>{totalEarthquakes}</strong> total available.
            </p>
            {stats.count > 0 && (
              <p style={{ marginTop: '0.5rem' }}>
                The average magnitude is <strong>{stats.averageMagnitude.toFixed(1)}</strong>, 
                {stats.tsunamiAlerts > 0 && ` with ${stats.tsunamiAlerts} tsunami alert(s) issued.`}
                {stats.tsunamiAlerts === 0 && ' with no tsunami alerts currently active.'}
              </p>
            )}
          </div>
        </div>
      )}

      {stats.count === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <p>No earthquakes match your current filters.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try adjusting your magnitude or time period settings.</p>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;