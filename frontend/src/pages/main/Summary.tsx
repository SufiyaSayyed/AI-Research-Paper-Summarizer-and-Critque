import { useFetchSummaryByIdQuery } from "@/hooks/queriesAndMutation";
import { useParams } from "react-router-dom";

const Summary = () => {
  const { docId } = useParams();
  const { data, isLoading, isError } = useFetchSummaryByIdQuery(docId!);
  console.log(docId);

  console.log(data);

  if (isLoading) return <p>Loading summary...</p>;
  if (isError) return <p>Failed to fetch summary.</p>;

  return <div>Summary</div>;
};

export default Summary;
