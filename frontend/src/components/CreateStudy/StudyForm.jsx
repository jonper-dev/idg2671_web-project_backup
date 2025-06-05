import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudyHeader from "./StudyHeader";
import "./StudyForm.css";
import CreateStudyButton from "../Buttons/CreateStudyButton";
import CreateStudyPublish from "../Buttons/CreateStudyPublish";
import QuestionList from "./QuestionList";
import { toast } from "react-hot-toast";

export default function StudyForm({
  mode = "create",
  initialStudy = {},
  initialQuestions = [],
}) {
  const navigate = useNavigate();
  const researcherId = "6824a97710175a3a9e9bb9f4";

  const [title, setTitle] = useState(() =>
    mode === "edit"
      ? initialStudy.title || ""
      : localStorage.getItem("draft-title") || ""
  );
  const [description, setDescription] = useState(() =>
    mode === "edit"
      ? initialStudy.description || ""
      : localStorage.getItem("draft-description") || ""
  );
  const [startDate, setStartDate] = useState(() =>
    mode === "edit"
      ? initialStudy.startDate || ""
      : localStorage.getItem("draft-startDate") || ""
  );
  const [endDate, setEndDate] = useState(() =>
    mode === "edit"
      ? initialStudy.endDate || ""
      : localStorage.getItem("draft-endDate") || ""
  );

  const [questions, setQuestions] = useState(() =>
    mode === "edit"
      ? initialQuestions
      : JSON.parse(localStorage.getItem("draft-questions")) || [
        { questionText: "", feedbackType: "", artefacts: [] },
      ]
  );

  const [loading, setLoading] = useState(false);

  // LocalStorage syncing (only in create mode)
  useEffect(() => {
    if (mode === "edit") return;

    const interval = setInterval(() => {
      localStorage.setItem("draft-title", title);
      localStorage.setItem("draft-description", description);
      localStorage.setItem("draft-startDate", startDate);
      localStorage.setItem("draft-endDate", endDate);
      localStorage.setItem("draft-questions", JSON.stringify(questions));
      toast.success("Draft saved", { duration: 1500, id: "autosave-toast" });
    }, 10000);

    return () => clearInterval(interval);
  }, [title, description, startDate, endDate, questions, mode]);

  // React-hook for storing and setting the highlighting of invalid questions.
  const [highlightInvalid, setHighlightInvalid] = useState([]);

  const validateForm = () => {
    const invalidIndices = [];
    const validQuestions = questions.filter((q, index) => {
      const isEmpty = !q.questionText.trim() && !q.feedbackType && q.artefacts.length === 0;
      const isIncomplete = (!q.questionText.trim() || !q.feedbackType);

      if (isIncomplete && !isEmpty) {
        invalidIndices.push(index);
        return false;
      }

      return !isEmpty; // Only include valid or complete questions
    });

    if (invalidIndices.length > 0) {
      setHighlightInvalid(invalidIndices);
      toast.error("Some questions are partially filled. Please complete or remove them.");
      return false;
    }

    setHighlightInvalid([]);
    return true;
  };


  const handleSaveOrPublishStudy = async (status) => {
    setLoading(true);

    const incompleteQuestions = [];
    const validQuestions = [];

    questions.forEach((q, idx) => {
      const hasText = q.questionText?.trim();
      const hasType = q.feedbackType?.trim();
      const needsArtefacts =
        ["comparison", "multiple-choice"].includes(q.feedbackType) ||
        q.feedbackType?.includes("slider");
      const hasArtefacts = q.artefacts?.length > 0;

      // Entirely empty questions are skipped.
      if (!hasText && !hasType && !hasArtefacts) return;

      // Partially filled questions are flag as invalid, preventing quiz-creation.
      if (!hasText || !hasType || (needsArtefacts && !hasArtefacts)) {
        incompleteQuestions.push(idx);
        return;
      }

      // Valid question
      validQuestions.push(q);
    });

    if (incompleteQuestions.length > 0) {
      toast.error("You have incomplete questions. Please complete or remove them before submitting.");
      setLoading(false);
      return;
    }

    if (validQuestions.length === 0) {
      toast.error("You must add at least one complete question.");
      setLoading(false);
      return;
    }

    const studyData = {
      researcher: researcherId,
      title,
      description,
      startDate,
      endDate,
      status,
      questions: validQuestions
    };

    try {
      const response = await fetch(
        mode === "edit"
          ? `/api/studies/${initialStudy._id}`
          : "/api/studies",
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studyData),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        const errorMessage =
          result.message || result.errors?.[0] || "Something went wrong.";
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const studyId = mode === "edit"
        ? initialStudy._id
        : result.savedStudy?._id || result._id;

      // Logging process step right before artefact-uploads.
      toast.success("Study created, uploading artefacts...");

      for (const q of questions) {
        for (const artefact of q.artefacts) {
          if (!artefact.url) continue;

          const artefactData = {
            study: studyId,
            researcher: researcherId, // Using the ID from the variable.
            questionText: q.questionText,
            description: "Artefact for question.",
            fileUrl: artefact.url, // Already provided from the uploaded file.
          };

          try {
            const res = await fetch("/api/artefacts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(artefactData),
            });

            const result = await res.json();
            if (!res.ok) {
              throw new Error(result.message || "Failed to save artefact");
            }
          } catch (error) {
            toast.error(`Error uploading artefact: ${error.message}`);
            setLoading(false);
            return;
          }
        }
      }

      if (mode === "create") {
        localStorage.removeItem("draft-title");
        localStorage.removeItem("draft-description");
        localStorage.removeItem("draft-startDate");
        localStorage.removeItem("draft-endDate");
        localStorage.removeItem("draft-questions");
      }

      toast.success(
        `Study ${status === "active" ? "published" : "saved as draft"}!`
      );
      navigate("/dashboard");
    } catch (err) {
      toast.error("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studyFormWrapper">
      <div className="studyFormHeader">
        <h1 className="createStudyTitle">{title.trim() || "New Study"}</h1>
        <div className="buttonLine">
          <CreateStudyButton
            className="CreateStudyButton"
            onClick={() => handleSaveOrPublishStudy("draft")}
            disabled={loading}
          />
          <CreateStudyPublish
            className="CreateStudyPublish"
            onClick={() => handleSaveOrPublishStudy("active")}
            disabled={loading}
          />
        </div>
      </div>

      <StudyHeader
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />

      <div className="dateInputsWrapper">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className="QuestionListWrapper">
        <QuestionList
          questions={questions}
          setQuestions={setQuestions}
          highlightInvalid={highlightInvalid}
        />
      </div>
    </div>
  );
}
