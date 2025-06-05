import { useNavigate } from 'react-router-dom';
import './styles/components.css';

function StudySummaryCard({ study, selected }) {
  const navigate = useNavigate();
  const participantCount = study.participants?.length || 0;
  const cardClasses = `summary-card${selected ? ' summary-card--expanded' : ''}`;

  const handleClick = () => {
    navigate(`/results/${study._id}`);
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      <h2>{study.title}</h2>
      <div className="details-area">
        {/* Displaying description if it exists */}
        {study.description && <p>{study.description}</p>}
        <p>Study ID: <span>{study._id}</span></p>
        <p>{participantCount} participant{participantCount !== 1 ? 's' : ''}</p>
        {/* Only display this paragraph when the card is not selected. */}
        {!selected && (
          <p>Click to view results for this study.</p>
        )}
      </div>
    </div>
  );
}

export default StudySummaryCard;
