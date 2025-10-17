import SummaryCard from "@/components/SummaryCard";
import { useFetchSummariesByUser } from "@/hooks/queriesAndMutation";
import type { UserSummaryItem } from "@/types";

const UserDashboard = () => {
  const { data, isLoading } = useFetchSummariesByUser();

  if (isLoading) return <p>Loading summaries...</p>;

  if (data) console.log("summaries: ", data);

  return (
    <section className="mt-10">
      <div className="flex flex-col md:gap-0 gap-4 mb-4">
        <p className="text-center font-bold md:text-5xl text-3xl text-palette-10">
          Your Insights Hub
        </p>
        <p className="text-center font-medium md:pt-4 text-lg md:text-2xl text-palette-2">
          Review AI-generated summaries and key findings from your research
          uploads.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 p-6 min-h-screen;">
        {data.map((summary: UserSummaryItem) => (
          <SummaryCard key={summary.doc_id} summary={summary} />
        ))}
      </div>
    </section>
  );
};

export default UserDashboard;
