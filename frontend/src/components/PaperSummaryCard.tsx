import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PaperSummaryCardProps } from "@/types";

const PaperSummaryCard: React.FC<PaperSummaryCardProps> = ({ data }) => {
  const {
    title,
    summary,
    strengths,
    limitations,
    future_directions,
    novelty_score,
    technical_depth_score,
    clarity_score,
    practical_impact_score,
    domain,
    keywords,
  } = data;

  const renderList = (
    items: string[],
    emptyText: string,
    icon: React.ReactNode
  ) =>
    items && items.length > 0 ? (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 flex items-center gap-2">
        {icon} {emptyText}
      </p>
    );

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl p-4 bg-white border md:p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {title || "Untitled Paper"}
        </CardTitle>
        <p className="text-gray-600 mt-1 text-sm">Domain: {domain || "N/A"}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <section>
          <h3 className="font-semibold text-lg mb-1">Summary</h3>
          <p className="text-gray-700">{summary}</p>
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-lg mb-1">Strengths</h3>
          {renderList(strengths, "No strengths listed.", "🚫")}
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-1">Limitations</h3>
          {renderList(limitations, "No limitations listed.", "🚫")}
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-1">Future Directions</h3>
          {renderList(future_directions, "No future directions listed.", "🧭")}
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-lg mb-1">Scores</h3>
          <div className="grid grid-cols-2 gap-y-2 text-gray-700">
            <span>🎯 Novelty: {novelty_score}/10</span>
            <span>⚙️ Technical Depth: {technical_depth_score}/10</span>
            <span>🧠 Clarity: {clarity_score}/10</span>
            <span>💡 Practical Impact: {practical_impact_score}/10</span>
          </div>
        </section>

        <Separator />

        <section>
          <h3 className="font-semibold text-lg mb-1">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <Badge key={i} variant="secondary" className="text-sm">
                {kw}
              </Badge>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default PaperSummaryCard;
