import { formatSize } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const maxFileSize = 20 * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  return (
    <div className="w-full bg-white py-2 md:px-10 rounded-2xl border-2 border-dotted">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {selectedFile ? (
            <div
              className="flex flex-col sm:flex-row items-center justify-between sm:justify-around gap-4 sm:gap-20 py-5 px-3 sm:px-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* File details */}
              <div className="flex flex-row sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
                <img
                  src="./assets/images/pdf.png"
                  alt="pdf"
                  className="size-10 flex-shrink-0"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 text-center sm:text-left w-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[200px] sm:max-w-xs mx-auto sm:mx-0">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatSize(maxFileSize)}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
                  onClick={removeFile}
                >
                  <X />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                <Upload width={30} height={30} />
              </div>
              <p className="md:text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="md:text-lg text-gray-500">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
