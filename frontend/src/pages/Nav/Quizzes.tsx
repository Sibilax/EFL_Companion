import React, { useState } from "react";
import axios from "axios";
import Quiz from "react-quiz-component";
import "../../styles/Quizzes.scss";

interface Respuesta {
  quiz_respuesta_contenido: string;
  quiz_respuesta_correcta: boolean;
}

interface Pregunta {
  pregunta: {
    quiz_pregunta_contenido: string;
  };
  respuestas: Respuesta[];
}

interface QuizData {
  quizTitle: string;
  quizSynopsis: string;
  questions: {
    question: string;
    questionType: string;
    answerSelectionType: string;
    answers: string[];
    correctAnswer: string;
    messageForCorrectAnswer: string;
    messageForIncorrectAnswer: string;
    explanation: string;
    point: string;
  }[];
}

const Quizzes: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [result, setResult] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchQuizData = async (nivel: string) => {
    try {
      setQuizData(null); // Limpiar el quizData al cambiar el nivel
      setErrorMessage(null);
      const response = await axios.get<Pregunta[]>(
        `http://localhost:5000/preguntas_con_respuestas?nivel=${nivel}&limit_preguntas=15`
      );
      const transformedData = transformData(response.data);
      setQuizData(transformedData);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("There are no quizzes available yet for that level.");
      } else if (error.response) {
        setErrorMessage(
          `Error: ${error.response.status} - ${error.response.statusText}`
        );
      } else {
        setErrorMessage("Network error: Could not reach the server.");
      }
    }
  };

  const transformData = (data: Pregunta[]): QuizData => {
    return {
      quizTitle: "English Quiz",
      quizSynopsis: "Test your English skills with these questions.",
      questions: data.map((item) => {
        const correctAnswerIndex = item.respuestas.findIndex(
          (respuesta) => respuesta.quiz_respuesta_correcta === true
        );
        const correctAnswer =
          item.respuestas[correctAnswerIndex].quiz_respuesta_contenido;

        return {
          question: item.pregunta.quiz_pregunta_contenido,
          questionType: "text",
          answerSelectionType: "single",
          answers: item.respuestas.map(
            (respuesta) => respuesta.quiz_respuesta_contenido
          ),
          correctAnswer: (correctAnswerIndex + 1).toString(),
          messageForCorrectAnswer: `✔️ Correct! The correct answer is: "${correctAnswer}"`,
          messageForIncorrectAnswer: `❌ Incorrect! The correct answer is: "${correctAnswer}"`,
          explanation: "",
          point: "1",
        };
      }),
    };
  };

  const handleComplete = (obj: any) => {
    setShowResult(true);
    setResult({
      correct: obj.numberOfCorrectAnswers,
      incorrect: obj.numberOfIncorrectAnswers,
    });
  };

  //volver a la pantalla de selección de nivel
  const handleBackToLevels = () => {
    setQuizData(null); //no mostrar preguntas, si es null n hay cuestionario activo --> !quizData &&
    setShowResult(false); //ocultar resultados
    setErrorMessage(null); //limpiar errores
  };

  const handleLevelSelect = (nivel: string) => {
    setShowResult(false); // Resetea los resultados al cambiar de nivel
    fetchQuizData(nivel);
  };

  return (
    <div className="quiz-wrapper">
      {!quizData && (
        <>
          <h1>Choose your level</h1>
          <div className="quiz-btn">
            <button onClick={() => handleLevelSelect("b1")}>B1</button>
            <button onClick={() => handleLevelSelect("b2")}>B2</button>
            <button onClick={() => handleLevelSelect("c1")}>C1</button>
          </div>
        </>
      )}

      {errorMessage && <div className="error-msg">{errorMessage}</div>}

      {!quizData && !errorMessage && (
        <div className="quiz-instructions">
          Select a level and take the quiz to test your grammar and vocabulary
          skills.
        </div>
      )}

      {showResult && (
        <div className="quiz-results">
          <h2>
            Your Results: {result.correct}/{result.incorrect}
          </h2>
          <button onClick={handleBackToLevels}>Back to level selection</button>
        </div>
      )}

      {!showResult && quizData && (
        <>
          <Quiz
            quiz={quizData}
            shuffle={true} // Aleatorizar las respuestas
            showInstantFeedback={true} // Mostrar feedback inmediato
            showDefaultResult={false} // Noesactivar el resultado por defecto
            onComplete={handleComplete} // Manejar la finalización del quiz
            timer={300} // Añadir un temporizador en segundos
            enableProgressBar={true} // Habilitar la barra de progreso
          />

          <button onClick={handleBackToLevels} className="back-button">
            Back to quizzes
          </button>
        </>
      )}
    </div>
  );
};

export default Quizzes;
