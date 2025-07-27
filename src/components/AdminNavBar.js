import React from "react";

function AdminNavBar({ onShowForm, onShowList }) {
  return (
    <nav>
      <button onClick={onShowForm}>
        New Question
      </button>
      <button onClick={onShowList}>
        View Questions
      </button>
    </nav>
  );
}

export default AdminNavBar;
