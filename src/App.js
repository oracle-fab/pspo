// src/App.js

import React from 'react';
import PSPOQuiz from './components/PSPOQuiz';
import { pspoQuestions } from './utils/questionParser';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ecf0f1',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <PSPOQuiz questions={pspoQuestions} />
    </div>
  );
}

export default App;