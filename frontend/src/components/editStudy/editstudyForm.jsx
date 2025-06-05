import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudyHeader from "../CreateStudy/StudyHeader";
import QuestionList from "../CreateStudy/QuestionList";
import CreateStudyButton from "../Buttons/CreateStudyButton";
import CreateStudyPublish from "../Buttons/CreateStudyPublish";
import { toast } from "react-hot-toast";
import "../CreateStudy/StudyForm.css";

export default function EditStudyForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [questions, setQuestions] = useState([]);
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudy = async () => {
      try {
        const studyRes = await fetch(`/api/studies/${id}`);
        const studyData = await studyRes.json();
        if (!studyRes.ok) throw new Error("Study not found");

        const artefactRes = await fetch(`/api/artefacts?study=${id}`);
        const artefactData = await artefactRes.json();

        const studyQuestions =
        studyData.study.questions?.length > 0
          ? studyData.study.questions
          : [
              { questionText: "", feedbackType: "", artefacts: [] },
              { questionText: "", feedbackType: "", artefacts: [] },
              { questionText: "", feedbackType: "", artefacts: [] },
              { questionText: "", feedbackType: "", artefacts: [] },
              { questionText: "", feedbackType: "", artefacts: [] },
            ];
              const artefacts = artefactData.artefacts || [];

              const groupedQuestions = studyQuestions.map((q) => {
                const matchingArtefacts = artefacts
                  .filter((a) => a.title === q.questionText)
                  .map((a) => ({
                    url: a.fileUrl,
                    file: { name: a.fileUrl.split("/").pop() }
                  }));
              
                return {
                  questionText: q.questionText || "",
                  feedbackType: q.feedbackType || "",
                  artefacts: matchingArtefacts,
                };
              });

              

        setStudy(studyData.study);
        setTitle(studyData.study.title);
        setDescription(studyData.study.description || "");
        setStartDate(studyData.study.startDate || "");
        setEndDate(studyData.study.endDate || "");
        setQuestions(groupedQuestions);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStudy();
  }, [id]);

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Study title is required.");
      return false;
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after start date.");
      return false;
    }
    if (questions.length === 0) {
      toast.error("You must add at least one question.");
      return false;
    }
    const hasValidQuestion = questions.some((q) => {
      if (!q.questionText.trim() || !q.feedbackType) return false;
      if (
        ["comparison", "multiple-choice"].includes(q.feedbackType) ||
        q.feedbackType.includes("slider")
      ) {
        return q.artefacts.length > 0;
      }
      return true;
    });
    if (!hasValidQuestion) {
      toast.error("At least one complete question with artefact is required.");
      return false;
    }
    return true;
  };

const handleSubmit = async (status) => {
  const isValid = validateForm();
  if (!isValid) {
    console.warn("Validation failed — submission aborted.");
    return;
  }

  setLoading(true);

  const updatedStudy = {
    title,
    description,
    startDate,
    endDate,
    researcher: study.researcher,
    status,
    questions: questions.map(q => ({
        questionText: q.questionText,
        feedbackType: q.feedbackType,
        artefacts: q.artefacts
      }))
      
  };

  try {
    const res = await fetch(`/api/studies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudy),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to update study");

    const savedQuestions = result.questions || study.questions;

    await fetch(`/api/artefacts?study=${id}`, { method: "DELETE" });

    let totalUploads = 0;

    for (const q of questions) {
      const match = savedQuestions.find(
        (sq) => sq.questionText === q.questionText && sq.feedbackType === q.feedbackType
      );
      if (!match) continue;

      const expectedCount = q.feedbackType === "comparison" ? 2 : 1;
      const artefactsToUpload = q.artefacts.filter((a) => a.file).slice(0, expectedCount);

      for (const artefact of artefactsToUpload) {
        const formData = new FormData();
        formData.append("file", artefact.file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.message || "Upload failed");

        const artefactData = {
          study: id,
          researcher: study.researcher,
          question: match._id,
          questionText: q.questionText,
          description: "Artefact for question",
          fileUrl: artefact.url,
        };

        await fetch("/api/artefacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(artefactData),
        });

        totalUploads++;
      }
    }

    if (totalUploads > 0) {
      toast.success(`Uploaded ${totalUploads} artefact${totalUploads > 1 ? "s" : ""}`);
    }

    toast.success(`Study ${status === "active" ? "published" : "saved"}!`);
    navigate("/dashboard");
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  if (loading) return <p>Loading...</p>;
  if (!study) return <p>Study not found</p>;

  return (
    <div className="studyFormWrapper">
      <div className="studyFormHeader">
        <h1 className="createStudyTitle">
          Editing: {title || "Untitled Study"}
        </h1>
        <div className="buttonLine">
          <CreateStudyButton
            className="CreateStudyButton"
            onClick={() => handleSubmit("draft")}
            disabled={loading}
          />
          <CreateStudyPublish
            className="CreateStudyPublish"
            onClick={() => handleSubmit("active")}
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
        <QuestionList questions={questions} setQuestions={setQuestions} />
      </div>
    </div>
  );
}
