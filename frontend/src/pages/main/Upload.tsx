import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuthContext";
import { UploadIcon } from "lucide-react";
import React, { useState } from "react";

const Upload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    console.log(file);
  };

  return (
    <div className="text-center text-gray-600 flex flex-col items-center h-full justify-center">
      <h2 className="font-semibold mb-4">Hello {user?.username || "Guest"}</h2>
      <p className="mb-6">
        Upload research paper and prompt query to genereate summar!
      </p>
      <div className="flex flex-col items-center gap-4 bg-palette-7 p-3 rounded-2xl w-full md:w-150 shadow-md">
        <FileUploader onFileSelect={handleFileSelect} />
        <Button onClick={handleSubmit} className="w-fit">
          Upload
          <UploadIcon></UploadIcon>
        </Button>
      </div>
    </div>
  );
};

export default Upload;
