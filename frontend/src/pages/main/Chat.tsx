import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/useAuthContext";
import { MoveRightIcon } from "lucide-react";
import { useState } from "react";

const Chat = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");

  const handleFileSelect = (selectedFile: File | null) => {
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    console.log(file);
    console.log("query: ", query);
  };

  return (
    <div className="text-center text-gray-600 flex flex-col items-center h-full justify-center">
      <h2 className="font-semibold mb-4">Hello {user?.username || "Guest"}</h2>
      <p className="mb-6">
        Upload research paper and prompt query to genereate summar!
      </p>
      <div className="flex flex-col gap-4 bg-palette-7 p-2 rounded-2xl w-full md:w-150 shadow-md">
        <FileUploader onFileSelect={handleFileSelect} />
        <div className="flex flex-row gap-3">
          <Input
            placeholder="Enter Query"
            className="bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSubmit}>
            <MoveRightIcon></MoveRightIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
