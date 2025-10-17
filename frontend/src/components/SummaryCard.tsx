import { env } from "@/api/config/env";
import type { UserSummaryItem } from "@/types";
import { Link } from "react-router-dom";

const SummaryCard = ({ summary }: { summary: UserSummaryItem }) => {
  const thumbnail = summary.image_path
    ? `${env.apiBaseUrl}/${summary.image_path}`
    : "/placeholder.jpg";

  return (
    <Link
      to={`/summary/${summary.doc_id}`}
      className="flex flex-col gap-4 md:h-[450px] sm:h-[300] w-full sm:w-[340px] md:w-[420px] lg:w-[460px] xl:w-[480px]
         bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all animate-in fade-in duration-1000"
    >
      <div className="lex flex-row justify-between items-start min-h-[80px] max-sm:flex-col max-sm:items-start gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="!text-black font-bold text-lg break-words">
            {summary.filename || "Untitled Paper"}
          </h2>
          <p className="text-sm text-gray-500 break-words">
            {summary.question ? `Q: ${summary.question}` : "No query"}
          </p>
        </div>
        <div className="flex-shrink-0 text-xs text-gray-400">
          {new Date(summary.timestamp * 1000).toLocaleDateString()}
        </div>
      </div>

      {thumbnail && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={thumbnail}
              alt="paper thumbnail"
              className="w-full h-[280px] max-sm:h-[180px] object-cover object-center rounded-xl"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default SummaryCard;
