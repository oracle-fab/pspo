// src/components/PSPOQuiz.js

import React, { useState, useRef, useEffect } from 'react';
import Snake from './Snake';

const styles = {
  quizContainer: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: 'white',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
  },
  timer: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#e74c3c', // Red color for urgency
  },
  
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#2c3e50',
  },
  question: {
    marginBottom: '30px',
    fontSize: '20px',
    lineHeight: '1.5',
    color: '#34495e',
  },
  optionContainer: {
    marginBottom: '15px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  optionHover: {
    backgroundColor: '#f7f9fa',
  },
  optionText: {
    marginLeft: '15px',
    fontSize: '16px',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  progress: {
    height: '6px',
    backgroundColor: '#ecf0f1',
    borderRadius: '3px',
    marginBottom: '20px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  emoji: {
    fontSize: '20px',
    marginLeft: '10px',
  },
};



const PSPOQuiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill([]));
  const [showResult, setShowResult] = useState(Array(questions.length).fill(false));
  const [hoveredOption, setHoveredOption] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds

  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }

    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (index) => {
    const newAnswers = [...answers];
    if (newAnswers[currentQuestion].includes(index)) {
      newAnswers[currentQuestion] = newAnswers[currentQuestion].filter(i => i !== index);
    } else {
      newAnswers[currentQuestion] = [...newAnswers[currentQuestion], index];
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!showResult[currentQuestion]) {
      // If result is not shown, show it (submit functionality)
      const newShowResult = [...showResult];
      newShowResult[currentQuestion] = true;
      setShowResult(newShowResult);
    } else if (currentQuestion < questions.length - 1) {
      // If result is shown and it's not the last question, move to next question
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const question = questions[currentQuestion];
  const selectedAnswers = answers[currentQuestion];
  const resultShown = showResult[currentQuestion];

  const isCorrect = (index) => {
    return question.correctAnswers.includes(index);
  };

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div style={styles.quizContainer} ref={containerRef}>
      <Snake width={containerSize.width} height={containerSize.height} />
      <h1 style={styles.title}>PSPO Mock Exam</h1>
      <div style={styles.timer}>Time Remaining: {formatTime(timeLeft)}</div>
      <div style={styles.progress}>
        <div style={{...styles.progressBar, width: `${((currentQuestion + 1) / questions.length) * 100}%`}} />
      </div>
      <p style={styles.question}>{question.question}</p>
      <div>
        {question.options.map((option, index) => (
          <div key={index} style={styles.optionContainer}>
            <label 
              style={{
                ...styles.option,
                ...(hoveredOption === index ? styles.optionHover : {}),
                backgroundColor: resultShown
                  ? isCorrect(index)
                    ? 'rgba(46, 204, 113, 0.2)'
                    : selectedAnswers.includes(index)
                    ? 'rgba(231, 76, 60, 0.2)'
                    : 'white'
                  : 'white',
              }}
              onMouseEnter={() => setHoveredOption(index)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <input
                type="checkbox"
                checked={selectedAnswers.includes(index)}
                onChange={() => handleAnswer(index)}
                disabled={resultShown}
                style={styles.checkbox}
              />
              <span style={styles.optionText}>
                {option}
                {resultShown && selectedAnswers.includes(index) && !isCorrect(index) && (
                  <span style={styles.emoji}>😞</span>
                )}
              </span>
            </label>
          </div>
        ))}
      </div>
      <div style={styles.buttonContainer}>
        <button 
          onClick={handleBack} 
          disabled={currentQuestion === 0} 
          style={{
            ...styles.button,
            ...(currentQuestion === 0 ? styles.disabledButton : {}),
            ...(hoveredButton === 'back' && currentQuestion !== 0 ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton('back')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Back
        </button>
        <button 
          onClick={handleNext} 
          disabled={isLastQuestion && resultShown}
          style={{
            ...styles.button,
            ...(isLastQuestion && resultShown ? styles.disabledButton : {}),
            ...(hoveredButton === 'next' && !(isLastQuestion && resultShown) ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          {!resultShown ? 'Submit' : isLastQuestion ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PSPOQuiz;