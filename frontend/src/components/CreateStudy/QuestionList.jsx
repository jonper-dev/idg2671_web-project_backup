import Question from "./Question";
import './QuestionList.css';

export default function QuestionList({ questions, setQuestions }) {
  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { questionText: "", feedbackType: "", artefacts: [] }
    ]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updated = [...questions];
    updated[index] = updatedQuestion;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    // minimum of 4
    if (questions.length <= 4) return; 
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div className="QuestionList">
      {questions.map((question, index) => (
        <Question
          key={index}
          number={index + 1}
          question={question}
          updateQuestion={(updated) => updateQuestion(index, updated)}
          removeQuestion={() => removeQuestion(index)}
        />
      ))}

      <button onClick={addQuestion} className="AddQuestionButton">
        Add question
      </button>
    </div>
  );
}