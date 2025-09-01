import React, { useState } from 'react';

const EducationPanel = () => {
  const [activeSection, setActiveSection] = useState('basics');

  const educationalContent = {
    basics: {
      title: "How Earthquakes Occur",
      content: "Earthquakes are caused by the sudden release of energy stored in Earth's crust. This energy builds up as tectonic plates move past each other, creating stress along fault lines. When the stress exceeds the strength of the rocks, they break suddenly, releasing seismic waves that we feel as earthquakes."
    },
    magnitude: {
      title: "Understanding Magnitude",
      content: "Magnitude measures the energy released by an earthquake at its source. The Moment Magnitude Scale (Mw) has replaced the older Richter scale for measuring large earthquakes. Each whole number increase represents about 32 times more energy release."
    },
    plates: {
      title: "Tectonic Plate Boundaries",
      content: "There are three main types of plate boundaries: divergent (plates moving apart), convergent (plates moving together), and transform (plates sliding past each other). About 95% of earthquakes occur at these boundaries."
    },
    ringOfFire: {
      title: "The Ring of Fire",
      content: "The Ring of Fire is a region around the Pacific Ocean where many earthquakes and volcanic eruptions occur. This horseshoe-shaped belt contains about 75% of the world's active volcanoes and about 90% of the world's earthquakes."
    },
    preparedness: {
      title: "Earthquake Preparedness",
      content: "Key preparedness steps include: Drop, Cover, and Hold On during shaking; have an emergency kit ready; know your building's evacuation routes; and understand your local earthquake risks. Early warning systems can provide seconds to minutes of advance notice."
    }
  };

  const magnitudeTable = [
    { magnitude: "< 2.0", description: "Micro", effects: "Not felt, recorded by seismographs", frequency: "8,000 per day" },
    { magnitude: "2.0-2.9", description: "Minor", effects: "Rarely felt", frequency: "1,000 per day" },
    { magnitude: "3.0-3.9", description: "Minor", effects: "Often felt, no damage", frequency: "49,000 per year" },
    { magnitude: "4.0-4.9", description: "Light", effects: "Noticeable shaking, minor damage", frequency: "6,200 per year" },
    { magnitude: "5.0-5.9", description: "Moderate", effects: "Can damage buildings", frequency: "800 per year" },
    { magnitude: "6.0-6.9", description: "Strong", effects: "Destructive in populated areas", frequency: "120 per year" },
    { magnitude: "7.0-7.9", description: "Major", effects: "Serious damage over large areas", frequency: "18 per year" },
    { magnitude: "8.0-8.9", description: "Great", effects: "Serious damage over very large areas", frequency: "1 per year" },
    { magnitude: "9.0+", description: "Great", effects: "Devastating over vast areas", frequency: "1 per 10-50 years" }
  ];

  const sections = [
    { id: 'basics', title: 'Earthquake Basics' },
    { id: 'magnitude', title: 'Magnitude Scale' },
    { id: 'plates', title: 'Plate Tectonics' },
    { id: 'ringOfFire', title: 'Ring of Fire' },
    { id: 'preparedness', title: 'Preparedness' }
  ];

  return (
    <div>
      <div className="tab-buttons" style={{ marginBottom: '1rem' }}>
        {sections.map(section => (
          <button
            key={section.id}
            className={`tab-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem',
              flex: '1 1 auto',
              minWidth: '0'
            }}
          >
            {section.title}
          </button>
        ))}
      </div>

      {activeSection !== 'magnitude' && (
        <div className="education-section">
          <h3>{educationalContent[activeSection].title}</h3>
          <p>{educationalContent[activeSection].content}</p>

          {activeSection === 'basics' && (
            <div>
              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Key Terms:</h4>
              <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                <li><strong>Epicenter:</strong> Point on Earth's surface directly above the earthquake source</li>
                <li><strong>Hypocenter/Focus:</strong> Underground point where earthquake originates</li>
                <li><strong>Fault:</strong> Fracture in Earth's crust where movement occurs</li>
                <li><strong>Seismic waves:</strong> Energy waves that travel through Earth during earthquakes</li>
              </ul>
            </div>
          )}

          {activeSection === 'plates' && (
            <div>
              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Major Tectonic Plates:</h4>
              <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                <li>Pacific Plate (largest, very active)</li>
                <li>North American Plate</li>
                <li>Eurasian Plate</li>
                <li>African Plate</li>
                <li>Antarctic Plate</li>
                <li>Indo-Australian Plate</li>
                <li>South American Plate</li>
              </ul>
            </div>
          )}

          {activeSection === 'ringOfFire' && (
            <div>
              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Notable Ring of Fire Countries:</h4>
              <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                <li>Japan - Highly seismic, advanced warning systems</li>
                <li>Indonesia - Most active volcanic region</li>
                <li>Philippines - Located on multiple plate boundaries</li>
                <li>Chile - Long coastline along active margin</li>
                <li>Alaska & Western US - Transform and subduction zones</li>
                <li>New Zealand - Complex plate boundary interactions</li>
              </ul>
            </div>
          )}

          {activeSection === 'preparedness' && (
            <div>
              <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Emergency Kit Essentials:</h4>
              <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                <li>Water (1 gallon per person per day for 3 days)</li>
                <li>Non-perishable food for 3 days</li>
                <li>Battery-powered or hand-crank radio</li>
                <li>Flashlight and extra batteries</li>
                <li>First aid kit and medications</li>
                <li>Whistle for signaling help</li>
                <li>Important documents in waterproof container</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {activeSection === 'magnitude' && (
        <div className="education-section">
          <h3>Earthquake Magnitude Scale</h3>
          <p>The magnitude scale is logarithmic - each whole number increase represents about 32 times more energy release.</p>

          <table className="magnitude-scale-table">
            <thead>
              <tr>
                <th>Magnitude</th>
                <th>Class</th>
                <th>Effects</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {magnitudeTable.map((row, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 'bold' }}>{row.magnitude}</td>
                  <td>{row.description}</td>
                  <td style={{ fontSize: '0.7rem' }}>{row.effects}</td>
                  <td style={{ fontSize: '0.7rem' }}>{row.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0f9ff', borderRadius: '0.375rem', border: '1px solid #bae6fd' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#0369a1' }}>Did You Know?</h4>
            <p style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>
              A magnitude 9.0 earthquake releases about 1,000 times more energy than a magnitude 7.0 earthquake, 
              and about 1 million times more energy than a magnitude 5.0 earthquake!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationPanel;