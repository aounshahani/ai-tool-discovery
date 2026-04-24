// // src/hooks/Tools.js

// import { useEffect } from 'react';
// import ToolStore from '../store/ToolStore';
// import axios from '../api/axios';

// const Tools = () => {
//   const { tools, selectedCategory, loading, error, setTools, setCategories, setLoading, setError } = ToolStore();

//   useEffect(() => {
//     const fetchTools = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get('/tools');
//         const allTools = response.data;
//         setTools(allTools);

//         // Extract unique categories for filtering
//         const uniqueCategories = [...new Set(allTools.map(tool => tool.category))];
//         setCategories(['All', ...uniqueCategories]);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch tools');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTools();
//   }, [setTools, setCategories, setLoading, setError]);

//   // Filter tools based on selected category
//   const filteredTools = selectedCategory === 'All'
//     ? tools
//     : tools.filter(tool => tool.category === selectedCategory);

//   return { filteredTools, loading, error };
// };

// export default Tools;

// src/hooks/Tools.js
import { useEffect } from "react";
import ToolStore from "../store/ToolStore";
import axios from "../api/axios";

const Tools = () => {
  const {
    tools,
    selectedCategory,
    loading,
    error,
    setTools,
    setCategories,
    setLoading,
    setError,
  } = ToolStore();

  // 🔹 Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/tools");
        const allTools = response.data;
        setTools(allTools);

        // Extract unique categories for filtering
        const uniqueCategories = [
          ...new Set(allTools.map((tool) => tool.category)),
        ];
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch tools");
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [setTools, setCategories, setLoading, setError]);

  // 🔹 Create tool
  const createTool = async (toolData, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/tools", toolData, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔐 send JWT
        },
      });

      // Add newly created tool to state
      setTools([...tools, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create tool");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filter tools based on selected category
  const filteredTools =
    selectedCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === selectedCategory);

  return { filteredTools, loading, error, createTool };
};

export default Tools;
