import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BarChart, BookOpen, Brain } from "lucide-react";

interface AnalysisViewProps {
  analysis: {
    summary: string;
    key_concepts: string[];
    difficulty: string;
    estimated_study_time: string;
  };
  onStartQuiz: () => void;
}

export function AnalysisView({ analysis, onStartQuiz }: AnalysisViewProps) {
  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart className="w-4 h-4" /> Difficulty
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analysis.difficulty}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Study Time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analysis.estimated_study_time}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Concepts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analysis.key_concepts.length}</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.key_concepts.map((concept, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                {concept}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={onStartQuiz} className="gap-2">
            <Brain className="w-5 h-5" /> Start Generated Quiz
        </Button>
      </div>
    </div>
  );
}

