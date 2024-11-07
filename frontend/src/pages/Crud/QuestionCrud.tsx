import { useState, useEffect } from "react";
import axios from "axios";

// Definir tipos para las preguntas y respuestas
interface Respuesta {
  quiz_respuesta_id: number;
  quiz_respuesta_opcion: string;
  quiz_respuesta_correcta: boolean;
}

interface Pregunta {
  quiz_pregunta_id: number;
  quiz_pregunta_contenido: string;
  quiz_pregunta_nivel: string;
  respuestas?: Respuesta[];
}

const QuestionCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "create"
    | "list"
    | "upload"
    | "delete"
    | "update"
    | "get"
    | "listWithAnswers"
  >("create");

  const [formData, setFormData] = useState({
    quiz_pregunta_nivel: "",
    quiz_pregunta_contenido: "",
  });
  const [questions, setQuestions] = useState<Pregunta[]>([]); // Arreglo de preguntas
  const [questionId, setQuestionId] = useState<string>("");
  const [singleQuestion, setSingleQuestion] = useState<Pregunta | null>(null); // Pregunta individual, el tipo de dato refiere a la intefaz. Puede sere null o elk contenido puede corresponder a la interfaz
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const adminToken = localStorage.getItem("adminToken");

  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Accede al primer archivo seleccionado del evento
    if (selectedFile) {
      setFile(selectedFile); // Actualiza el estado con el archivo
    }
  };

  const handleUploadQuestionCSV = async () => {
    if (!file) return;

    const formData = new FormData(); //nuevo objeto formdata
    formData.append("file", file); //adjunto el archivo file(el real) del campo o key "file"

    try {
      setLoading(true); //para q al ejecutar la función se pueda deshabilitar el envío
      await axios.post("http://localhost:5000/preguntas/csv", formData, config);
      alert("Questions added successfully");
    } catch (error) {
      alert("Error adding questions");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/pregunta", formData, config);
      alert("Question created successfully");
      setFormData({
        quiz_pregunta_nivel: "",
        quiz_pregunta_contenido: "",
      });
    } catch (error: any) {
      alert("Error al crear pregunta");
    } finally {
      setLoading(false);
    }
  };

  const handleList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/preguntas",
        config
      );
      setQuestions(response.data); // Actualiza el estado con las preguntas obtenidas
    } catch (error: any) {
      alert("Error fetching questions");
    }
  };

  const handleListWithAnswers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/preguntas_con_respuestas",
        config
      );
      setQuestions(response.data); // Actualiza el estado con las preguntas con respuestas
    } catch (error: any) {
      alert("Error fetching questions with answers");
    }
  };

  const handleGetQuestion = async () => {
    if (!questionId) {
      alert("Please, provide the question ID");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/pregunta/${questionId}`,
        config
      );
      setSingleQuestion(response.data); // Actualiza el edo con la pregunta obtenida
    } catch (error: any) {
      alert("Error fetching question");
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      handleList();
    } else if (activeTab === "listWithAnswers") {
      handleListWithAnswers();
    }
  }, [activeTab]); //en vez de una sola vez se ejecuta cada vez q toco una active tab diferente

  useEffect(() => {
    // Limpiar formData al cambiar de pestaña
    setFormData({
      quiz_pregunta_contenido: "",
      quiz_pregunta_nivel: "",
    });
    setQuestionId("");
    setQuestions([]); // Limpiar la lista de preguntas
    setSingleQuestion(null); // Limpiar la pregunta individual
  }, [activeTab]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/pregunta/${questionId}`,
        config
      );
      alert("Question deleted successfully");
      setQuestionId("");
      setFormData({ quiz_pregunta_nivel: "", quiz_pregunta_contenido: "" });
    } catch (error: any) {
      alert("Error deleting question");
    }
  };

  const handleUpdate = async () => {
    const updatedData: any = {};

    if (formData.quiz_pregunta_contenido)
      updatedData.quiz_pregunta_contenido = formData.quiz_pregunta_contenido;
    if (formData.quiz_pregunta_nivel)
      updatedData.quiz_pregunta_nivel = formData.quiz_pregunta_nivel;

    if (!questionId) {
      alert("Please, provide the ID of the quation to update.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/pregunta/${questionId}`,
        updatedData,
        config
      );
      alert("Question updated successfully");

      setFormData({
        quiz_pregunta_nivel: "",
        quiz_pregunta_contenido: "",
      });
      setQuestionId("");
    } catch (error: any) {
      alert("Error updating question");
    }
  };

  return (
    <div className="crud-wrapper">
      <h1>Questions CRUD Panel</h1>

      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Add Question</button>

        <button
          onClick={() => {
            setActiveTab("list");
            handleList();
          }}
        >
          Show Questions
        </button>

        <button
          onClick={() => {
            setActiveTab("listWithAnswers");
            handleListWithAnswers();
          }}
        >
          Show Questions With Answers
        </button>

        <button
          onClick={() => {
            setActiveTab("delete");
          }}
        >
          Delete Question
        </button>

        <button
          onClick={() => {
            setActiveTab("update");
          }}
        >
          Update Question
        </button>

        <button
          onClick={() => {
            setActiveTab("get");
          }}
        >
          Fetch Question
        </button>

        <button
          onClick={() => {
            setActiveTab("upload");
          }}
        >
          Upload Questions
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="crud-inputs">
          <h2>Upload Questions from CSV</h2>
          <div className="input-group">
            <input type="file" accept=".csv" onChange={handleFileChange} />{" "}
            {/*limito la extensión del archivo */}
          </div>

          <div className="crud-buttons">
            <button onClick={handleUploadQuestionCSV} disabled={loading}>
              {/*deshabilito la función mientras carga */}
              Upload CSV
            </button>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Add Question</h2>
          <div className="input-group">
            <input
              type="text"
              name="quiz_pregunta_contenido" /*tiene que coincidir exactamente con la columna del backend, lo q puede varias es el placeholder */
              value={formData.quiz_pregunta_contenido || ""}
              placeholder="Content"
              onChange={handleChange}
            />
            <input
              type="text"
              name="quiz_pregunta_nivel"
              value={formData.quiz_pregunta_nivel || ""}
              placeholder="Level"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate} disabled={loading}>
              Add Question
            </button>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="crud-list">
          <h2>List of Questions</h2>
          <ul>
            {questions.map((question) => (
              <li key={question.quiz_pregunta_id}>
                <strong>ID:</strong> {question.quiz_pregunta_id} <br />
                <strong>Level:</strong> {question.quiz_pregunta_nivel} <br />
                <strong>Content:</strong> {question.quiz_pregunta_contenido}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "listWithAnswers" && (
        <div className="crud-list">
          <h2>List of questions with answers</h2>
          <ul>
            {questions.map((question) => (
              <li key={question.pregunta.quiz_pregunta_id}>
                {" "}
                {/*respuestas = db.relationship('QuizRespuesta', cascade="all, delete", backref='pregunta')*/}
                <strong>ID:</strong> {question.pregunta.quiz_pregunta_id} <br />
                <strong>Level:</strong> {question.pregunta.quiz_pregunta_nivel}{" "}
                <br />
                <strong>Content:</strong>{" "}
                {question.pregunta.quiz_pregunta_contenido} <br />
                <strong>Answers:</strong>
                <ul>
                  {question.respuestas?.map((respuesta) => (
                    <li key={respuesta.quiz_respuesta_id}>
                      <strong>{respuesta.quiz_respuesta_opcion})</strong>{" "}
                      {respuesta.quiz_respuesta_correcta
                        ? "Correcta"
                        : "Incorrecta"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "get" && (
        <div className="crud-inputs">
          <h2>Fetch Question</h2>
          <input
            type="text"
            value={questionId}
            placeholder="ID de la Pregunta"
            onChange={(e) => setQuestionId(e.target.value)}
          />
          <div className="crud-buttons">
            <button onClick={handleGetQuestion}>Fetch Question</button>
          </div>
          {singleQuestion && (
            <div className="crud-list">
              <h3>Question:</h3>
              <p>ID: {singleQuestion.quiz_pregunta_id}</p>
              <p>Content: {singleQuestion.quiz_pregunta_contenido}</p>
              <p>Level: {singleQuestion.quiz_pregunta_nivel}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete Question</h2>
          <div className="input-group">
            <input
              type="text"
              value={questionId}
              placeholder="ID de la Pregunta"
              onChange={(e) => setQuestionId(e.target.value)}
            />
          </div>

          <div className="crud-buttons">
            <button onClick={handleDelete}>Delete Question</button>
          </div>
        </div>
      )}

      {activeTab === "update" && (
        <div className="crud-inputs">
          <h2>Update Question</h2>
          <div className="input-group">
            <input
              type="text"
              value={questionId}
              placeholder="Question ID"
              onChange={(e) => setQuestionId(e.target.value)}
            />
            <input
              type="text"
              name="quiz_pregunta_contenido"
              value={formData.quiz_pregunta_contenido || ""}
              placeholder="New content"
              onChange={handleChange}
            />
            <input
              type="text"
              name="quiz_pregunta_nivel"
              value={formData.quiz_pregunta_nivel || ""}
              placeholder="New level"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleUpdate}>Update Question</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCrud;
