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

  // Render list only when items exist; no fallback text
  const renderList = (items: string[]) =>
    items && items.length > 0 ? (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : null;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md rounded-2xl p-4 bg-white border md:p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {title || "Paper Analysis"}
        </CardTitle>
        <p className="text-gray-600 mt-1 text-sm">Domain: {domain || "N/A"}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        {summary && (
          <section>
            <h3 className="font-semibold text-lg mb-1">Summary</h3>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {strengths && strengths.length > 0 && (
          <>
            <Separator />
            <section>
              <h3 className="font-semibold text-lg mb-1">Strengths</h3>
              {renderList(strengths)}
            </section>
          </>
        )}

        {limitations && limitations.length > 0 && (
          <>
            <Separator />
            <section>
              <h3 className="font-semibold text-lg mb-1">Limitations</h3>
              {renderList(limitations)}
            </section>
          </>
        )}

        {future_directions && future_directions.length > 0 && (
          <>
            <Separator />
            <section>
              <h3 className="font-semibold text-lg mb-1">Future Directions</h3>
              {renderList(future_directions)}
            </section>
          </>
        )}

        <Separator />

        <section>
          <h3 className="font-semibold text-lg mb-1">Scores</h3>
          <div className="grid grid-cols-2 gap-y-2 text-gray-700">
            <div className="flex flex-row gap-x-2 items-center">
              <img
                src="/assets/icons/novelity.png"
                className="w-4 h-4 object-contain shrink-0"
                alt="novelity"
              />
              <span>Novelty: {novelty_score}/10</span>
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              <img
                src="/assets/icons/tech_depth.png"
                className="w-4 h-4 object-contain shrink-0"
                alt="noveltech_depthity"
              />
              <span>Technical Depth: {technical_depth_score}/10</span>
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              <img
                src="/assets/icons/clarity.png"
                className="w-4 h-4 object-contain shrink-0"
                alt="novelity"
              />
              <span>Clarity: {clarity_score}/10</span>
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              <img
                src="/assets/icons/prac_impact.png"
                className="w-4 h-4 object-contain shrink-0"
                alt="prac_impact"
              />
              <span>Practical Impact: {practical_impact_score}/10</span>
            </div>
          </div>
        </section>

        {keywords && keywords.length > 0 && (
          <>
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaperSummaryCard;
