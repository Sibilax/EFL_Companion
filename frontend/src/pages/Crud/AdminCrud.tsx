import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Crud.scss";

const AdminCrud: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "list" | "delete" | "update"
  >("list");
  const [formData, setFormData] = useState({
    admin_name: "",
    admin_email: "",
    admin_pwd: "",
    admin_role: "",
  });
  const [admins, setAdmins] = useState([]); 
  const [adminId, setAdminId] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  // Configuración de los headers con el token de autorización
  const config = {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  };

  // Manejar el cambio en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:5000/admin", formData, config);
      alert("Admin created successfully");

      setFormData({
        admin_name: "",
        admin_email: "",
        admin_pwd: "",
        admin_role: "",
      });
    } catch (error: any) {
      alert("Error al crear admin");
    }
  };


  const handleList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admins", config);
      setAdmins(response.data);
    } catch (error: any) {
      alert("Error al obtener la lista de admins");
    }
  };


  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/admin/${adminId}`, config);
      alert("Admin eliminado con éxito");
    } catch (error: any) {
      alert("Error al eliminar admin");
    }
  };


  const handleUpdate = async () => {
    const updatedData: any = {};

    // Solo agregar los campos que tienen un valor no vacío
    if (formData.admin_name) updatedData.admin_name = formData.admin_name;
    if (formData.admin_email) updatedData.admin_email = formData.admin_email;
    if (formData.admin_pwd) updatedData.admin_pwd = formData.admin_pwd;
    if (formData.admin_role) updatedData.admin_role = formData.admin_role;

    if (!adminId) {
      alert("Please provide the Admin ID to update.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/admin/${adminId}`,
        updatedData,
        config
      );
      alert("Admin updated successfully");

      // Limpiar los campos del formulario e ID
      setFormData({
        admin_name: "",
        admin_email: "",
        admin_pwd: "",
        admin_role: "",
      });
      setAdminId(""); 
    } catch (error: any) {
      alert("Error updating admin");
    }
  };

  // useEffect para cargar la lista automáticamente cuando la pestaña "list" está activa
  useEffect(() => {
    if (activeTab === "list") {
      handleList(); 
    }
  }, [activeTab]);

  return (
    <div className="crud-wrapper">
      <h1>Admin CRUD Panel</h1>

      <div className="crud-buttons">
        <button onClick={() => setActiveTab("create")}>Create Admin</button>
        <button onClick={() => setActiveTab("list")}>Show Admins</button>
        <button onClick={() => setActiveTab("delete")}>Delete Admin</button>
        <button onClick={() => setActiveTab("update")}>Update Admin</button>
      </div>

      {activeTab === "create" && (
        <div className="crud-inputs">
          <h2>Create Admin</h2>
          <div className="input-group">
            <input
              type="text"
              name="admin_name"
              value={formData.admin_name || ""}
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="email"
              name="admin_email"
              value={formData.admin_email || ""}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="password"
              name="admin_pwd"
              value={formData.admin_pwd || ""}
              placeholder="Password"
              onChange={handleChange}
            />
            <input
              type="text"
              name="admin_role"
              value={formData.admin_role || ""}
              placeholder="Role"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleCreate}>Add Admin</button>
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="crud-buttons">
          <h2>Admins List</h2>
          <ul>
            {admins.map((admin: any) => (
              <li key={admin.id}><strong>ID: </strong>{admin.admin_id} <strong> - Name: </strong>{admin.admin_name}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "delete" && (
        <div className="crud-inputs">
          <h2>Delete Admin</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="ID del Admin"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleDelete}>Delete Admin</button>
          </div>
        </div>
      )}

      {activeTab === "update" && (
        <div className="crud-inputs">
          <h2>Update Admin</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
            <input
              type="text"
              name="admin_name"
              value={formData.admin_name || ""}
              placeholder="Name"
              onChange={handleChange}
            />
            <input
              type="email"
              name="admin_email"
              value={formData.admin_email || ""}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="password"
              name="admin_pwd"
              value={formData.admin_pwd || ""}
              placeholder="Password"
              onChange={handleChange}
            />
            <input
              type="text"
              name="admin_role"
              value={formData.admin_role || ""}
              placeholder="Role"
              onChange={handleChange}
            />
          </div>
          <div className="crud-buttons">
            <button onClick={handleUpdate}>Update Admin</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCrud;
