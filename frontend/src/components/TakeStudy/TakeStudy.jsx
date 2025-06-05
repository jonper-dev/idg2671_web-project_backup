import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TakeStudy() {
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [participantId, setParticipantId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchStudy = async () => {
      const res = await fetch(`/api/studies/${id}`);
      const data = await res.json();
      setStudy(data.study);
    };

    fetchStudy();

    const existingId = sessionStorage.getItem("participantId");
    if (existingId) {
      setParticipantId(existingId);
    } else {
      const createParticipant = async () => {
        const res = await fetch("/api/participants", { method: "POST" });
        const data = await res.json();
        sessionStorage.setItem("participantId", data._id);
        setParticipantId(data._id);
      };
      createParticipant();
    }
  }, [id]);

  const handleAnswer = (value) => {
    if (!study?.questions?.[currentIndex]) return;
    const question = study.questions[currentIndex];
    setResponses((prev) => ({
      ...prev,
      [currentIndex]: {
        questionText: question.questionText,
        feedbackType: question.feedbackType,
        answer: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      studyId: study._id,
      participantId,
      answers: Object.values(responses),
    };

    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) setSubmitted(true);
    setSubmitting(false);
  };

  if (!study || !study.questions || !study.questions[currentIndex]) {
    return <p>Loading study...</p>;
  }

  const question = study.questions[currentIndex];
  const answer = responses[currentIndex]?.answer || "";
  const totalQuestions = study.questions.length;

  if (submitted) {
    return (
      <section className="take-study-section">
        <div className="thank-you-message">
          <h2>Thank you for your participation!</h2>
          <p>Your answers have been submitted successfully.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="take-study-section">
      <div className="study-header">
        <h1>{study.title}</h1>
        <p>{study.description}</p>
        <p className="progress-indicator">
          Question {currentIndex + 1} of {totalQuestions}
        </p>
      </div>

      <div className="question-block">
        <h2>{question.questionText}</h2>

        {question.artefacts?.map((a, i) => (
          <img
            key={i}
            src={a.url}
            alt={`Artefact ${i + 1}`}
            className="artefact-image"
          />
        ))}

        {(() => {
          switch (question.feedbackType) {
            case "text-field":
              return (
                <textarea
                  value={answer}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Your response"
                />
              );
            case "percent-slider":
            case "range-slider":
            case "bullet-slider":
              return (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={answer || 50}
                  onChange={(e) => handleAnswer(Number(e.target.value))}
                />
              );
            case "comparison":
              return (
                <div className="comparison-buttons">
                  <button onClick={() => handleAnswer("left")}>Left</button>
                  <button onClick={() => handleAnswer("right")}>Right</button>
                </div>
              );
            default:
              return <p>Unsupported question type</p>;
          }
        })()}
      </div>

      <div className="nav-controls">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
        >
          Back
        </button>

        {currentIndex < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={!responses[currentIndex]}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!responses[currentIndex] || submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </section>
  );
}
