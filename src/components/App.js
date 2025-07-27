import React, { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";
import AdminNavBar from "./AdminNavBar";

function App() {
  const [questions, setQuestions] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((fetchedQuestions) => {
        if (isMounted) {
          setQuestions(fetchedQuestions);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error));

    return () => {
      isMounted = false;
    };
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  }

  function handleDeleteQuestion(idToDelete) {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== idToDelete)
    );
  }

  function handleUpdateQuestion(updatedQuestion) {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }

  function handleFormSubmissionComplete() {
    setIsFormVisible(false);
  }

  return (
    <main>
      <AdminNavBar
        onShowForm={() => setIsFormVisible(true)}
        onShowList={() => setIsFormVisible(false)}
      />

      {isFormVisible ? (
        <QuestionForm
          onAddQuestion={handleAddQuestion}
          onSubmissionComplete={handleFormSubmissionComplete}
        />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
