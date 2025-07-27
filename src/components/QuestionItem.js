import React from "react";

function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleDeleteClick() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          onDeleteQuestion(id);
        } else {
          console.error("Failed to delete question:", r.statusText);
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  }

  function handleCorrectIndexChange(event) {
    const newCorrectIndex = parseInt(event.target.value);

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correctIndex: newCorrectIndex,
      }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        onUpdateQuestion(updatedQuestion);
      })
      .catch((error) => console.error("Error updating question:", error));
  }

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  return (
    <li>
      <h4>{prompt}</h4>
      <p>
        <label htmlFor={`correctAnswer-${id}`}>Correct Answer:</label>
        <select id={`correctAnswer-${id}`} defaultValue={correctIndex} onChange={handleCorrectIndexChange}>
          {options}
        </select>
      </p>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
