import { useState } from "react";
import {
  AdminCrud,
  UserCrud,
  BlogCrud,
  VideoCrud,
  TagCrud,
  CourseCrud,
  AnswerCrud,
  QuestionCrud,
} from "./index";

import "../../styles/AdminPanel.scss";

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | "admin"
    | "user"
    | "blog"
    | "video"
    | "tag"
    | "course"
    | "answer"
    | "question"
    | null
  >(null);

  return (
    <div className="admin-panel-wrapper">
      <h1>Admin Dashboard</h1>
      <div className="admin-panel-buttons">
        <button onClick={() => setActiveTab("admin")}>Manage Admins</button>
        <button onClick={() => setActiveTab("user")}>Manage Users</button>
        <button onClick={() => setActiveTab("blog")}>Manage Blogs</button>
        <button onClick={() => setActiveTab("video")}>Manage Videos</button>
        <button onClick={() => setActiveTab("tag")}>Manage Tags</button>
        <button onClick={() => setActiveTab("course")}>Manage Courses</button>
        <button onClick={() => setActiveTab("answer")}>Manage Answers</button>
        <button onClick={() => setActiveTab("question")}>
          Manage Questions
        </button>
      </div>

      {activeTab === "admin" && <AdminCrud />}
      {activeTab === "user" && <UserCrud />}
      {activeTab === "blog" && <BlogCrud />}
      {activeTab === "video" && <VideoCrud />}
      {activeTab === "tag" && <TagCrud />}
      {activeTab === "course" && <CourseCrud />}
      {activeTab === "answer" && <AnswerCrud />}
      {activeTab === "question" && <QuestionCrud />}
    </div>
  );
};

export default AdminPanel;
