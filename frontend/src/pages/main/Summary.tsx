import { env } from "@/api/config/env";
import PaperSummaryCard from "@/components/PaperSummaryCard";
import { useFetchSummaryByIdQuery } from "@/hooks/queriesAndMutation";
import { useParams } from "react-router-dom";

const Summary = () => {
  const { docId } = useParams();
  const { data } = useFetchSummaryByIdQuery(docId!);
  console.log(docId);

  console.log(data);
  if (data) {
    console.log("formatted response: ", JSON.parse(data[0].response));
    console.log(data[0].image_path);
    // const data = [
    //   {
    //     _id: "68efcba3c7012fb6956d4a5a",
    //     doc_id: "a0284ec0-b62c-45d7-a8b1-2866db75a8fc",
    //     requester: "abc04",
    //     question: "generate summary",
    //     response:
    //       '{\n  "title": null,\n  "summary": "This study proposes a technique that uses Natural Language Processing (NLP) to understand SMS content and user activity, categorizing communications received by the user. The suggested technique is implemented as a Java application developed with Android Studio, featuring a user interface.",\n  "strengths": [\n    "Utilizes Natural Language Processing for content understanding.",\n    "Considers user activity based on communication categories.",\n    "Implemented as a practical Android application using Java."\n  ],\n  "limitations": [],\n  "future_directions": [],\n  "novelty_score": 6,\n  "technical_depth_score": 6,\n  "clarity_score": 8,\n  "practical_impact_score": 7,\n  "domain": "Natural Language Processing, Mobile Development",\n  "keywords": [\n    "SMS",\n    "Natural Language Processing",\n    "User Activity",\n    "Android Application",\n    "Java"\n  ],\n  "sources": []\n}',
    //     sources: ["ASIANCON2023_Paper0694 (1).pdf"],
    //     timestamp: 1760545699.999903,
    //   },
    // ];

    // const formattedResponse = JSON.parse(data[0].response);
    // console.log("formattedResponse: ", formattedResponse);
    return (
      <div>
        {data && (
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full px-4 py-6">
            <img
              src={`${env.apiBaseUrl}/${data[0].image_path}`}
              alt="Paper preview"
              className="w-full max-w-xs h-auto rounded-lg shadow md:max-w-md md:h-full object-cover"
            />
            <PaperSummaryCard data={JSON.parse(data[0].response)} />
          </div>
        )}
      </div>
    );
  }
};

export default Summary;
