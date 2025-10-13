import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useSummaryMutation,
  useUploadMutation,
} from "@/hooks/queriesAndMutation";
import { useAuth } from "@/hooks/useAuthContext";
import { usePaper } from "@/hooks/usePaperContext";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Upload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const { docId, setDocId } = usePaper();
  const {
    mutate: uploadPaper,
    isError: isUploadError,
    isPending: isUploadPending,
  } = useUploadMutation();
  const {
    mutate: fetchSummary,
    isError: isFetchSumError,
    isPending: isFetchSumPending,
  } = useSummaryMutation();

  const handleFileSelect = (selectedFile: File | null) => {
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file || !query) {
      toast("Please upload a file first and enter query");
      return;
    }
    const formData = new FormData();
    formData.append("files", file);
    console.log(file);
    uploadPaper(formData, {
      onSuccess: (data) => {
        setDocId(data);
        console.log(docId);
        console.log("Upload successful", data);
        if (!data) {
          toast("Error in uploading file, please try again");
          return;
        }
        fetchSummary({ docId, query });
      },
    });
  };

  return (
    <div className="text-center text-gray-600 flex flex-col items-center h-full justify-center">
      <h2 className="font-semibold mb-4">Hello {user?.username || "Guest"}</h2>
      <p className="mb-6">
        Upload research paper and prompt query to genereate summar!
      </p>
      <div className="flex flex-col items-center gap-4 bg-palette-7 p-3 rounded-2xl w-full md:w-150 shadow-md">
        {(file || !file) && (
          <>
            <FileUploader onFileSelect={handleFileSelect} />
          </>
        )}
        {isUploadPending && (
          <div className="flex flex-col justify-center gap-2 items-center w-full bg-white py-2 md:px-10 rounded-2xl border-2 border-dotted animate-pulse">
            <img
              src="./assets/images/upload.svg"
              alt="uplaoding"
              width={50}
              height={50}
            />
            <p>Uploading Document ...</p>
          </div>
        )}
        {isUploadError && (
          <div className="flex flex-col justify-center gap-2 items-center w-full bg-white py-2 md:px-10 rounded-2xl border-2 border-dotted">
            <img
              src="./assets/images/error.svg"
              alt="error"
              width={50}
              height={50}
            />
            <p>Failed to upload document. Please try again.</p>
          </div>
        )}
        {isFetchSumPending && (
          <div className="flex flex-col justify-center gap-2 items-center w-full bg-white py-2 md:px-10 rounded-2xl border-2 border-dotted animate-pulse">
            <img
              src="./assets/images/fetching_summary.svg"
              alt="fetching"
              width={50}
              height={50}
            />
            <p>Fetching Summary ...</p>
          </div>
        )}
        {isFetchSumError && (
          <div className="flex flex-col justify-center gap-2 items-center w-full bg-white py-2 md:px-10 rounded-2xl border-2 border-dotted">
            <img
              src="./assets/images/error.svg"
              alt="error"
              width={50}
              height={50}
            />
            <p>Failed to fetch summary. Please try again.</p>
          </div>
        )}
        <div className="w-full flex flex-row gap-4 justify-center items-center">
          <Textarea
            placeholder="Enter Query..."
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="bg-white"
          />
          <Button
            onClick={handleUpload}
            className="w-fit"
            disabled={!file || isUploadPending || isFetchSumPending || !query}
          >
            Send
            <SendIcon></SendIcon>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
