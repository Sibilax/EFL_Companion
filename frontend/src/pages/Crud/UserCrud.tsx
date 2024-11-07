import { useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import "../../styles/Crud.scss";

const UserCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "add" | "list" | "delete" | "update"
  >("list");

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_pwd: "",
    user_status: "inactive",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Obtener el token de admin desde localStorage
  const adminToken = localStorage.getItem("adminToken");

  // Configuración de los headers con el token de autorización
  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  // Manejar cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    //importante establecer el tipo de elemento
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      await axios.post("http://localhost:5000/user", formData, config);
      alert("User created successfully");
      setFormData({
        user_name: "",
        user_email: "",
        user_pwd: "",
        user_status: "inactive",
      });
    } catch (error: any) {
      alert("Error creating user");
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
      alert("User deleted successfully");
    } catch (error: any) {
      alert("Error deleting user");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Accede al primer archivo seleccionado
    if (selectedFile) {
      setFile(selectedFile); // Actualiza el estado con el archivo
    }
  };

  const handleUploadCSV = async () => {
    if (!file) return;

    const formData = new FormData(); //nuevo objeto formdata
    formData.append("file", file); //adjunto el archivo file(el real) del campo o key "file"

    try {
      setLoading(true); //para q al ejecutar la funcións e pueda deshabilitar el envío
      await axios.post("http://localhost:5000/user/csv", formData, config);
      alert("Users added successfully");
    } catch (error) {
      alert("Error adding users");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  const handleUpdate = async () => {
    const updatedData: any = {}; //estructura vacía para lmacenar los datos, indico el tipo - any
    if (formData.user_name) updatedData.user_name = formData.user_name; //si se ingresa algo al input, se va a almacenar en esta variable updatedData, con esta clave user_name y el valor del input
    if (formData.user_email) updatedData.user_email = formData.user_email;
    if (formData.user_pwd) updatedData.user_pwd = formData.user_pwd;
    if (formData.user_status) updatedData.user_status = formData.user_status;

    try {
      await axios.put(
        `http://localhost:5000/user/${userId}`,
        updatedData, //envío los datos actualizados al servidor
        config //autenticación q estaba alñmacenada en local storage
      );
      alert("Usuario successfully updated");
      setFormData({
        user_name: "",
        user_email: "",
        user_pwd: "",
        user_status: "inactive",
      });
      setUserId(""); // Limpiar ID después de la actualización
    } catch (error: any) {
      alert("Error updating user");
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
        <button onClick={() => setActiveTab("add")}>Add CSV</button>
      </div>

      {activeTab === "add" && (
        <div className="crud-inputs">
          <h2>Add Users from CSV</h2>
          <div className="input-group">
            <input type="file" accept=".csv" onChange={handleFileChange} />{" "}
            {/*limito la extensión del archivo */}
          </div>

          <div className="crud-buttons">
            <button onClick={handleUploadCSV} disabled={loading}>
              {/*desahabilito la función mientras carga */}
              Upload CSV
            </button>
          </div>
        </div>
      )}

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
        <div>
          <h2>Users List</h2>
          <div className="crud-buttons">
            <button onClick={handleList}>Show Users</button>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="crud-list">
              <ul>
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

                    <div className="crud-buttons">
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
            </div>
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
            <select
              name="user_status"
              value={formData.user_status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
