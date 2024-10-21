import { useState, useEffect } from "react";
import axios from "axios";

// Define el tipo para los cursos
interface Course {
  curso_id: number;
  curso_name: string;
  curso_description: string;
  curso_level: string;
  curso_img?: string; // La imagen es opcional
}

const CourseCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"create" | "list" | "update" | "delete">("create");
  const [formData, setFormData] = useState({
    id: "", // Campo para el ID del curso
    name: "",
    description: "",
    level: "",
    img: "",
  });
  const [deleteId, setDeleteId] = useState<string>(""); // Para el input del ID
  const [courses, setCourses] = useState<Course[]>([]); // Almacena los cursos
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Manejo de errores

  const adminToken = localStorage.getItem("adminToken");

  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  // Manejador para cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Crear curso
  const handleCreate = async () => {
    try {
      await axios.post(
        "http://localhost:5000/curso",
        {
          curso_name: formData.name,
          curso_description: formData.description,
          curso_level: formData.level,
          curso_img: formData.img || null, // img es opcional
        },
        config
      );
      alert("Course created successfully");
      resetForm();
      fetchAllCourses(); // Actualiza la lista
    } catch (error: any) {

      alert("Error creating the course");
    }
  };

  // Obtener todos los cursos
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/cursos", config);
      if (response.data && Array.isArray(response.data)) {
        setCourses(response.data); // Almacena los cursos obtenidos
        setErrorMessage(null); // Limpia cualquier mensaje de error
      } else {
        alert("No courses found.");
      }
    } catch (error: any) {
      alert("Error fetching courses.");
    }
  };

  // Actualizar curso por ID, campos opcionales
  const handleUpdate = async () => {
    if (!formData.id) {
      alert("Please, add an ID.");
      return;
    }

    // Crear un objeto solo con los campos que el usuario quiere actualizar
    const updatedFields: any = {};
    if (formData.name) updatedFields.curso_name = formData.name;
    if (formData.description) updatedFields.curso_description = formData.description;
    if (formData.level) updatedFields.curso_level = formData.level;
    if (formData.img) updatedFields.curso_img = formData.img;

    try {
      await axios.put(
        `http://localhost:5000/curso/${formData.id}`, // Usa el ID ingresado manualmente
        updatedFields, // Solo enviar campos que el usuario quiere modificar
        config
      );
      alert("Course updated successfully");
      resetForm();
      fetchAllCourses(); // Actualiza la lista de cursos
    } catch (error: any) {
      alert("Error updating the course");
    }
  };

  // Eliminar curso por ID
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/curso/${id}`, config);
      alert("Course deleted");
      fetchAllCourses(); // Actualiza la lista
      setDeleteId(""); // Limpiar campo después de eliminar
    } catch (error: any) {
      alert("Error deleting the course");
    }
  };

  // Establecer datos del curso en el formulario para editar
  const handleEdit = (course: Course) => {
    setFormData({
      id: course.curso_id.toString(), // Guardar el ID en formData para usar en la actualización
      name: course.curso_name,
      description: course.curso_description,
      level: course.curso_level,
      img: course.curso_img || "", 
    });
    setActiveTab("update");
  };

  // Restablecer formulario
  const resetForm = () => {
    setFormData({
      id: "", // Limpiar el ID
      name: "",
      description: "",
      level: "",
      img: "",
    });
    setActiveTab("create");
  };

  useEffect(() => {
    fetchAllCourses();  
  }, []);

  return (
    <div className="crud-wrapper">
      <h1>Courses Crud Panel</h1>

      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Add Course</button>
        <button
          onClick={() => {
            setActiveTab("list");
            fetchAllCourses();
          }}
        >
          Show Courses
        </button>
        <button onClick={() => setActiveTab("delete")}>Delete Course</button>
        <button onClick={() => setActiveTab("update")}>Update Course</button>
      </div>
      

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Add Course</h2>
          <div className="input-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Course"
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
            />
            <input
              type="text"
              name="level"
              value={formData.level}
              placeholder="Level"
              onChange={handleChange}
            />
            <input
              type="text"
              name="img"
              value={formData.img}
              placeholder="Image URL (optional)"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate}>Add Course</button>
          </div>
        </div>
      )}


      {activeTab === "list" && (
        <div>
          <h2>Courses</h2>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <ul>
            {courses.length > 0 ? (
              courses.map((course) => (
                <li key={course.curso_id}>
                  <strong>ID:</strong> {course.curso_id} {" - "}
                  <strong>Name:</strong> {course.curso_name} {" - "}
                  <strong>Description:</strong> {course.curso_description} {" - "}
                  <strong>Level:</strong> {course.curso_level} {" - "}
                  <strong>Image:</strong> {course.curso_img || "No image"}
  
                </li>
              ))
            ) : (
              <p>No courses available</p>
            )}
          </ul>
        </div>
      )}

       {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete Course by ID</h2>
          <div className="input-group">
            <input
              type="text"
              value={deleteId}
              placeholder="Course ID"
              onChange={(e) => setDeleteId(e.target.value)}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={() => handleDelete(Number(deleteId))}>Delete Course</button>
          </div>
        </div>
      )}


      {activeTab === "update" && (
        <div className="crud-inputs">
          <h2>Update Course</h2>
          <div className="input-group">
            <input
              type="text"
              name="id"
              value={formData.id} //ID ingresado manualmente
              placeholder="Course ID"
              onChange={handleChange} //editar el ID
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Course name (optional)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="Descripction (optional)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="level"
              value={formData.level}
              placeholder="Level (optional)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="img"
              value={formData.img}
              placeholder="URL of the image (optional)"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleUpdate}>Update Course</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCrud;
