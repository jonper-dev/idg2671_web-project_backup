import Question from "./Question";
import './QuestionList.css';

export default function QuestionList({ questions, setQuestions, highlightInvalid = [] }) {
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
    // A minimum of 1 question is required.
    if (questions.length <= 1) {
      console.log("Can't delete. A study must have at least one question.");
      return;
    }
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div className="QuestionList">
      {questions.map((question, index) => (
        <Question
          key={index}
          className={`question-block ${highlightInvalid.includes(index) ? 'invalid' : ''}`}
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
