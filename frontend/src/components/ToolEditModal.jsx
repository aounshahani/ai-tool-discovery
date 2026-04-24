import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import ToolForm from './Tools/ToolForm';

const ToolEditModal = ({ tool, onClose, onUpdate }) => {
    const { token } = useSelector((state) => state.auth);

    // Wrapper to handle the form submission logic for updates
    // Since ToolForm is designed for creation, we might need to adapt it or pass initial data
    // Ideally ToolForm should accept initialValues. Let's assume we can modify ToolForm or it handles it.
    // If ToolForm doesn't support initialValues, we might need to modify it.
    // Let's check ToolForm again. It uses internal state.
    // We should modify ToolForm to accept `initialData` prop.

    // For now, I'll assume I'll modify ToolForm to accept initialData.

    const handleUpdate = async (formData) => {
        try {
            await axios.put(`/tools/${tool._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onUpdate();
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update tool");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full my-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Tool</h2>
                    {/* We need to pass initialData to ToolForm */}
                    <ToolForm
                        onSubmit={handleUpdate}
                        token={token}
                        initialData={tool}
                        isEditing={true}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default ToolEditModal;
