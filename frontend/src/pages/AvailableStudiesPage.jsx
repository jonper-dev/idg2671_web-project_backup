import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/pages.css'; // Shared styling.
import './styles/AvailableStudiesPage.css'; // Custom-styling, alternatively could be shared with ResultsPage.jsx

export default function AvailableStudiesPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('/api/studies');
        const data = await res.json();
        const activeStudies = data.study?.filter(study => study.status === 'active') || [];
        setStudies(activeStudies);
      } catch (err) {
        console.error('Failed to fetch studies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, []);

  if (loading) return <p>Loading available studies...</p>;

  return (
    <main className="available-studies-container">
      <h1>Available Studies</h1>
      <div className="study-card-container">
        {studies.map(study => (
          <div
            key={study._id}
            className="study-card"
            onClick={() => navigate(`/study/${study._id}`)}
          >
            <h2>{study.title}</h2>
            <p>{study.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
