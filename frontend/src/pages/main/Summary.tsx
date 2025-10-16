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
      <div className="mt-14 xl:mt-0 lg:mt-0 md:mt-0">
        {data && (
          <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="flex flex-col gap-8 w-1/2 px-8 max-lg:w-full py-6 bg-palette-7 bg-cover h-[100vh] sticky top-0 items-center justify-center">
              <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
                <img
                  src={`${env.apiBaseUrl}/${data[0].image_path}`}
                  alt="Paper preview"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </section>
            <section className="flex flex-col gap-8 w-1/2 px-8 max-lg:w-full py-6 items-center justify-center">
              <PaperSummaryCard data={JSON.parse(data[0].response)} />
            </section>
          </div>
        )}
      </div>
    );
  }
};

export default Summary;
