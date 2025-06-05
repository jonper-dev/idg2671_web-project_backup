import './DeletionConirmationMessage.css'

export default function DeletionConfirmationMessage({ studyName, onConfirm, onCancel }) {
    return (
    <div className="deletionOverlay">
      <div className="deletionBox">
        <p className="deletionText">
        Are you sure you want to delete the study "{studyName}"?<br />
          <strong>This action cannot be undone.</strong>
        </p>
        <div className="deletionButtons">
          <button className="deleteYes" onClick={onConfirm}>Yes</button>
          <button className="deleteNo" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}
