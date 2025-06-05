import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateStudyButton from "../components/Buttons/CreateStudyButton";
import dummyStudies from "./DummyStudies";
import "./styles/DashboardPage.css";

const Dashboard = () => {
  const [studies, setStudies] = useState(dummyStudies); // Initializing with dummy data.
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await fetch('/api/studies', {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Failed to fetch real studies');
        }

        const data = await res.json();
        setStudies(data);
      } catch (err) {
        console.error(err);
        setError('Could not load actual studies. Showing sample data.');
        // Keeping the dummy studies as fallback.
      }
    };

    fetchStudies();
  }, []);


  return (
    <div className="DashboardWrapper">
      <div className="DashboardHeader">
        <h1>Dashboard</h1>
        <Link to="/create-study" className="DashboardButton">Create Study</Link>
      </div>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      <div className="DashboardTable">
        <table>
          <thead>
            <tr>
              <th>Study</th>
              <th>Created</th>
              <th>Respondents</th>
              <th>Results</th>
              <th>Edit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study, index) => (
              <tr key={index}>
                <td>{study.name || study.study}</td>
                <td>{new Date(study.createdAt || study.created).toLocaleDateString()}</td>
                <td>{study.respondents || (study.participants?.length || 0)}</td>
                <td>
                  <Link to={`/results/${study._id || study.id}`} className="view-link">
                    View
                  </Link>
                </td>
                <td>
                  {study.status === "Active" && (
                    <Link to={`/edit/${study._id || study.id}`} className="edit-link">
                      Edit
                    </Link>
                  )}
                </td>
                <td className={(study.status || "unknown").toLowerCase()}>
                  {study.status || "unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
