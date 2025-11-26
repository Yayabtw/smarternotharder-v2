"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { AnalysisView } from "@/components/analysis-view";
import { QuizView } from "@/components/quiz-view";
import { analyzeContent, generateQuiz } from "@/lib/api";
import { Loader2, Sparkles } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState<"upload" | "analyzing" | "analysis" | "quiz">("upload");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [quizData, setQuizData] = useState<any>(null);

  const handleUploadSuccess = async (data: any) => {
    setExtractedText(data.extracted_text);
    setStep("analyzing");
    try {
        const analysis = await analyzeContent(data.extracted_text);
        setAnalysisData(analysis);
        setStep("analysis");
    } catch (error) {
        console.error("Analysis error", error);
        setStep("upload"); // Reset on error
        alert("Analysis failed. Please try again.");
    }
  };

  const handleStartQuiz = async () => {
      // Ideally we load quiz data while in analysis view or show loading state
      // Let's show a loading state effectively
      const loadingBtn = document.body; // Just a trick, in reality we would use state
      
      try {
        // Simple loading indicator could be added here
        const quiz = await generateQuiz(extractedText);
        setQuizData(quiz);
        setStep("quiz");
      } catch (error) {
          console.error("Quiz generation error", error);
          alert("Could not generate quiz.");
      }
  };

  const handleReset = () => {
      setStep("upload");
      setAnalysisData(null);
      setExtractedText("");
      setQuizData(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 gap-8 bg-background text-foreground">
      <div className="w-full max-w-5xl flex flex-col items-center gap-4 text-center mb-8">
        <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-6 h-6" />
            <span className="font-bold tracking-wider text-sm uppercase">SmarterNotHarder</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Master Your Coursework <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">
            With AI Precision
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Upload your documents. Get instant summaries, insights, and personalized quizzes to retain more in less time.
        </p>
      </div>

      <div className="w-full flex justify-center">
        {step === "upload" && (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {step === "analyzing" && (
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xl font-medium">Analyzing your document...</p>
                <p className="text-sm text-muted-foreground">Extracting key concepts and difficulty levels.</p>
            </div>
        )}

        {step === "analysis" && analysisData && (
            <AnalysisView analysis={analysisData} onStartQuiz={handleStartQuiz} />
        )}

        {step === "quiz" && quizData && (
            <QuizView questions={quizData} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
