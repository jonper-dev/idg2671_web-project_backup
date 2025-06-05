import "./StudyHeader.css";

export default function StudyHeader({
  title,
  setTitle,
  description,
  setDescription,
}) {
  return (
    <div className="studyHeaderWrapper">
      <input
        className="studyTitle"
        placeholder="Title"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          localStorage.setItem("draft-title", event.target.value);
        }}
      />

      <input
        className="studyDescription"
        placeholder="Description"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          localStorage.setItem("draft-description", event.target.value);
        }}
      />
    </div>
  );
}
