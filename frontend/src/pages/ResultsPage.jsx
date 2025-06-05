import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/pages.css';
import './styles/ResultsPage.css';
import StudySummaryCard from '../components/StudySummaryCard';

const ResultsPage = () => {
  const { id } = useParams(); // Get study ID from URL
  const navigate = useNavigate(); // To navigate programmatically
  const [studies, setStudies] = useState([]);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [error, setError] = useState(null);

  // Loading studies, first fetching from API, fall back to mock data if error or none found.
  useEffect(() => {
    const loadStudies = async () => {
      try {
        const res = await fetch('/api/studies');
        const data = await res.json();

        const validStudies = data.study?.filter(
          (s) => s.status === 'active' || s.status === 'draft'
        ) || [];

        if (validStudies.length === 0) throw new Error('No studies found');
        setStudies(validStudies);

      } catch (err) {
        console.warn('Falling back to mock data:', err.message);
        try {
          const fallback = await fetch('/mockStudies.json').then(res => res.json());
          setStudies(fallback);
        } catch (e) {
          setError('Unable to load any study data.');
        }
      }
    };

    loadStudies();
  }, []);

  // For actually looking at a study.
  useEffect(() => {
    if (id && studies.length > 0) {
      const found = studies.find(s => s._id === id);
      setSelectedStudy(found || null);
    }
  }, [id, studies]);

  // Go back to overview on ESC or Backspace
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Escape' || e.key === 'Backspace') && selectedStudy) {
        setSelectedStudy(null);
        navigate('/results'); // Update URL
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStudy, navigate]);

  const handleCardClick = (study) => {
    navigate(`/results/${study._id}`);
    setSelectedStudy(study);
  };

  const renderTable = () => {
    if (!selectedStudy) return null;

    return (
      <>
        <div className="summary-card summary-card-expanded">
          <h2>Summary of "{selectedStudy.title}"</h2>
          <table>
            <thead>
              <tr>
                <th>Participant ID</th>
                {selectedStudy.questions.map((q, i) => (
                  <th key={i}>{q.questionText}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!selectedStudy.participants || selectedStudy.participants.length === 0 ? (
                <tr>
                  <td colSpan={1 + selectedStudy.questions.length}>
                    No participant data yet.
                  </td>
                </tr>
              ) : (
                selectedStudy.participants.map((p, i) => (
                  <tr key={i}>
                    <td>{p.id}</td>
                    {p.answers.map((a, j) => (
                      <td key={j}>{a}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p
          className="return-text"
          onClick={() => {
            setSelectedStudy(null);
            navigate('/results');
          }}
        >
          ⬅ Press Escape, Backspace, or click here to return to all studies
        </p>
      </>
    );
  };

  return (
    <main className="results-container">
      <h1>Results</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section className="card-container">
        {selectedStudy ? (
          <>
            <StudySummaryCard study={selectedStudy} selected={true} />
            {renderTable()}
          </>
        ) : (
          <div className="summary-card">
            {studies.map((study) => (
              <StudySummaryCard
                key={study._id}
                study={study}
                selected={false}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ResultsPage;
