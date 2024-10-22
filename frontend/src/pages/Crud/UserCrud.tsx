import { useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import "../../styles/Crud.scss";

const UserCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "list" | "delete" | "update"
  >("list");

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_pwd: ""
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  // Obtener el token de admin desde localStorage
  const adminToken = localStorage.getItem("adminToken");

  // Configuración de los headers con el token de autorización
  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      await axios.post("http://localhost:5000/user", formData, config);
      alert("User creado con éxito");
      setFormData({ user_name: "", user_email: "", user_pwd: "" });
    } catch (error: any) {
      alert("Error al crear usuario");
    } finally {
      setLoading(false); // Desactiva el estado de carga al final
    }
  };

  const handleList = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/users", config);
      setUsers(response.data);
    } catch (error: any) {
      alert("Error al listar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/user/${userId}`, config);
      alert("Usuario eliminado con éxito");
    } catch (error: any) {
      alert("Error al eliminar usuario");
    }
  };

  const handleUpdate = async () => {
    const updatedData: any = {}; //estructura vacía para lmacenar los datos, indico el tipo - any
    if (formData.user_name) updatedData.user_name = formData.user_name; //si se ingresa algo al input, se va a almacenar en esta variable updatedData, con esta clave user_name y el valor del input
    if (formData.user_email) updatedData.user_email = formData.user_email;
    if (formData.user_pwd) updatedData.user_pwd = formData.user_pwd;

    try {
      await axios.put(
        `http://localhost:5000/user/${userId}`,
        updatedData, //envío los datos actualizados al servidor
        config //autenticación q estaba alñmacenada en local storage
      );
      alert("Usuario actualizado con éxito");
      setFormData({ user_name: "", user_email: "", user_pwd: "" });
      setUserId(""); // Limpiar ID después de la actualización
    } catch (error: any) {
      alert("Error al actualizar usuario");
    }
  };

  return (
    <div className="crud-wrapper">
      <h1>User CRUD Panel</h1>
      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Create User</button>
        <button onClick={() => setActiveTab("list")}>Show Users</button>
        <button onClick={() => setActiveTab("delete")}>Delete User</button>
        <button onClick={() => setActiveTab("update")}>Update User</button>
      </div>

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Create User</h2>
          <div className="input-group">
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="password"
              name="user_pwd"
              value={formData.user_pwd}
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate} disabled={loading}>
              Add User
            </button>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="crud-list">
          <h2>Users List</h2>
          <div className="crud-buttons">
            <button onClick={handleList}>Show Users</button>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <ul className="user-list">
              {users.map((user: any) => (
                <li key={user.user_id}>
                  <div>
                    <strong>ID:</strong> {user.user_id}
                  </div>

                  <div>
                    <strong>Name: </strong>
                    {user.user_name}
                  </div>

                  <div>
                    <strong>Email: </strong>
                    {user.user_email}
                  </div>

                  <div className="button-container">
                    <button
                      onClick={() => {
                        setUserId(user.user_id);
                        const confirmDelete = window.confirm(
                          `Do you want to delete the user with the follwing ID: ${user.user_id}?`
                        );
                        if (confirmDelete) {
                          handleDelete();
                        }
                      }}
                    >
                      Delete User
                    </button>

                    <button
                      onClick={() => {
                        setUserId(user.user_id);
                        setActiveTab("update");
                      }}
                    >
                      Update User
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete User</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder=" User ID "
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleDelete}>Delete User</button>
          </div>
        </div>
      )}

      {activeTab === "update" && (
        <div className="crud-inputs">
          <h2>Update User</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="password"
              name="user_pwd"
              value={formData.user_pwd}
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleUpdate}>Update User</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCrud;
