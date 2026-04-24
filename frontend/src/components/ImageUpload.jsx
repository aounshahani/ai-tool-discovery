import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { uploadImage } from '../api/assetApi';

const ImageUpload = ({
    onUploadComplete,
    assetType = 'tool_logo',
    tags = [],
    maxSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const fileInputRef = useRef(null);

    // Get upload state from Redux
    const { uploading, uploadProgress, error } = useSelector((state) => state.asset);

    // Auto-upload when file is selected
    useEffect(() => {
        console.log('⚡ ImageUpload useEffect triggered:', {
            selectedFile: selectedFile?.name,
            uploading,
            uploadComplete
        });

        if (selectedFile && !uploading && !uploadComplete) {
            console.log('✅ Conditions met, triggering upload...');
            handleUpload();
        } else {
            console.log('❌ Upload conditions not met:', {
                hasFile: !!selectedFile,
                isUploading: uploading,
                isComplete: uploadComplete
            });
        }
    }, [selectedFile]);

    // Handle file selection
    const handleFileSelect = (file) => {
        console.log('📁 File selected:', file.name, file.type, file.size);
        setUploadComplete(false);

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
            alert(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            alert(`File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`);
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle file input change
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Handle upload
    const handleUpload = async () => {
        console.log('🚀 handleUpload called');
        console.log('📦 Upload parameters:', {
            selectedFile: selectedFile?.name,
            assetType,
            tags
        });

        if (!selectedFile) {
            console.error('❌ Missing file:', { selectedFile: !!selectedFile });
            return;
        }

        try {
            console.log('📤 Calling uploadImage API...');
            const uploadedAsset = await uploadImage(selectedFile, assetType, tags);

            console.log('✅ Upload successful:', uploadedAsset);
            setUploadComplete(true);

            // Call the callback with uploaded asset data
            if (onUploadComplete) {
                onUploadComplete(uploadedAsset);
            }
        } catch (error) {
            console.error('❌ Upload failed:', error);
            setUploadComplete(false);
        }
    };

    // Clear selection
    const handleClear = () => {
        setSelectedFile(null);
        setPreview(null);
        setUploadComplete(false);
        clearError();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* File Input Area */}
            {!preview && !uploading && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragging
                            ? 'border-primary bg-accent-faded'
                            : 'border-border hover:border-primary hover:bg-accent-faded'
                        }
          `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleChange}
                        accept={acceptedTypes.join(',')}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>

                        <div>
                            <p className="text-base font-medium text-foreground">
                                {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                PNG, JPG, WEBP up to {(maxSize / 1024 / 1024).toFixed(0)}MB
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Uploading State */}
            {uploading && (
                <div className="border-2 border-border rounded-lg p-8 bg-card">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <div className="text-center">
                            <p className="text-base font-medium text-foreground">
                                Uploading image...
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {uploadProgress}% complete
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Complete State */}
            {uploadComplete && preview && !uploading && (
                <div className="border-2 border-primary/30 rounded-lg overflow-hidden bg-card">
                    <div className="relative aspect-video bg-muted flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Success Badge */}
                        <div className="absolute top-2 left-2 px-3 py-1 bg-green-500 text-white rounded-full flex items-center space-x-1 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Uploaded</span>
                        </div>

                        {/* Clear Button */}
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* File Info */}
                    <div className="p-4 border-t border-border bg-green-50">
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {selectedFile?.name}
                                </p>
                                <p className="text-xs text-green-600">
                                    Ready to submit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
