import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Course.scss";
import { motion } from "framer-motion";

// Definir la interfaz para los cursos
interface Curso {
  //esta será la estructura que tenga el objeto response.data
  curso_id: number;
  curso_name: string;
  curso_level: string;
  curso_description: string;
}

// Componente para mostrar un curso, debo indicar si no va a recibir alguno de los props de la respuesta
const Msg: React.FC<Omit<Curso, "curso_id">> = ({
  curso_name,
  curso_level,
  curso_description,
}) => {
  return (
    <motion.div
      className="curso_name"
      initial={{ opacity: 0, y: 10 }} // Animación inicial
      animate={{ opacity: 1, y: 0 }} // Animación al mostrar el curso
      transition={{ duration: 0.5 }} // Duración de la animación
    >
      <h1>
        {curso_name} - {curso_level}
      </h1>
      <div
        className="curso_description"
        dangerouslySetInnerHTML={{ __html: curso_description }} // Renderizar HTML como se debe
      />
    </motion.div>
  );
};

// Componente principal para obtener y renderizar los cursos
const Course: React.FC = () => {
  const [messages, setMessages] = useState<Curso[]>([]); // Estado para almacenar los cursos
  const [error, setError] = useState<string | null>(null);

  // Obtengo los datos desde la base de datos al montar el componente
  useEffect(() => {
    axios
      .get<Curso[]>("http://localhost:5000/cursos") // la respuesta es un array de Curso
      .then((response) => {
        setMessages(response.data); // la lista de cursos se almacena en la variable messages (que se actualiza de array vacío a estos datos)
      })
      .catch((error) => {
        setError("Error loading courses.");
      });
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="courses-container">
      {messages.map((msg) => (
        <Msg
          key={msg.curso_id}
          curso_name={msg.curso_name}
          curso_level={msg.curso_level}
          curso_description={msg.curso_description}
        />
      ))}
    </div>
  );
};

export default Course; //el componente hijo nos e exporta
