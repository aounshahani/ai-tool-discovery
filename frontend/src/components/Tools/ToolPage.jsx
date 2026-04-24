import React from "react";
import ToolForm from "./ToolForm";
import Tools from "../../hooks/Tools";
import { useSelector } from "react-redux";

const ToolPage = () => {
  const { createTool } = Tools();
  const { token } = useSelector((state) => state.auth);

  const handleCreateTool = async (toolData) => {
    try {
      await createTool(toolData, token);
      alert("Tool created successfully!");
    } catch (err) {
      alert("Failed to create tool");
      console.error(err);
    }
  };

  return <ToolForm onSubmit={handleCreateTool} token={token} />;
};

export default ToolPage;
