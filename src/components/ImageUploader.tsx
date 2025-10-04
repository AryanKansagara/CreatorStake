import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Check } from "lucide-react";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (file: File | null) => void;
  className?: string;
  aspectRatio?: string;
  placeholderText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImage = "",
  onImageChange,
  className = "",
  aspectRatio = "aspect-square",
  placeholderText = "Upload Image"
}) => {
  const [previewImage, setPreviewImage] = useState<string>(initialImage);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(!!initialImage);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      // Show error for non-image files
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setIsUploaded(true);
      onImageChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setIsUploaded(false);
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`${className} w-full`}>
      <div
        className={`${aspectRatio} relative w-full overflow-hidden rounded-lg transition-all duration-300 ${
          isDragging ? "bg-accent/20 border-2 border-accent" : isUploaded ? "" : "glass-card"
        } ${isDragging ? "scale-[1.02]" : "scale-100"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Preview image */}
        {previewImage && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        {/* Upload overlay */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${
            previewImage ? "opacity-0 hover:opacity-100 bg-black/40" : "opacity-100"
          }`}
        >
          {!previewImage ? (
            <>
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-center text-muted-foreground">{placeholderText}</p>
              <p className="text-xs text-center text-muted-foreground mt-1">Drag & drop or click to browse</p>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-black/50 border-white/30 hover:bg-black/70"
                onClick={triggerFileInput}
              >
                <Camera className="w-4 h-4 mr-1" />
                Change
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-black/50 border-red-500/30 text-red-400 hover:bg-black/70"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Success indicator */}
        {isUploaded && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* Clickable overlay */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={triggerFileInput}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
