"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { AnalysisView } from "@/components/analysis-view";
import { QuizView } from "@/components/quiz-view";
import { ChatInterface } from "@/components/chat-interface";
import { PlanningView } from "@/components/planning-view";
import { FlashcardView } from "@/components/flashcard-view";
import { analyzeContent, generateQuiz, generateFlashcards } from "@/lib/api";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamificationHeader } from "@/components/gamification-header";
import { useGamification } from "@/contexts/gamification-context";

export default function Home() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const { addXp } = useGamification();
  
  const [step, setStep] = useState<"upload" | "analyzing" | "dashboard">("upload");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  
  const [quizData, setQuizData] = useState<any>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  
  const [flashcardsData, setFlashcardsData] = useState<any>(null);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  const handleUploadSuccess = async (data: any) => {
    setExtractedText(data.extracted_text);
    setStep("analyzing");
    try {
        const analysis = await analyzeContent(data.extracted_text, locale);
        setAnalysisData(analysis);
        setStep("dashboard");
        addXp(50); // +50 XP for analysis
    } catch (error) {
        console.error("Analysis error", error);
        setStep("upload");
        alert("Analysis failed. Please try again.");
    }
  };

  const handleTabChange = async (value: string) => {
    if (value === "quiz" && !quizData && !loadingQuiz) {
        setLoadingQuiz(true);
        try {
            const quiz = await generateQuiz(extractedText, locale);
            setQuizData(quiz);
        } catch (error) {
            console.error("Quiz generation error", error);
        } finally {
            setLoadingQuiz(false);
        }
    } else if (value === "flashcards" && !flashcardsData && !loadingFlashcards) {
        setLoadingFlashcards(true);
        try {
            const data = await generateFlashcards(extractedText, 10, locale);
            setFlashcardsData(data.flashcards);
        } catch (error) {
            console.error("Flashcards error", error);
        } finally {
            setLoadingFlashcards(false);
        }
    }
  };

  const handleQuizComplete = (score: number) => {
      addXp(score * 10); // +10 XP per correct answer
  };

  const handleFlashcardsComplete = () => {
      addXp(20); // Fixed XP for completing flashcards
  };

  const handleReset = () => {
      setStep("upload");
      setAnalysisData(null);
      setExtractedText("");
      setQuizData(null);
      setFlashcardsData(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 gap-8 bg-background text-foreground transition-colors duration-300">
      
      {/* Header / Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <GamificationHeader />
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center gap-4 text-center mb-8 mt-12">
        <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles className="w-6 h-6" />
            <span className="font-bold tracking-wider text-sm uppercase">SmarterNotHarder</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('title')} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600 dark:from-neutral-400 dark:to-white">
             AI Precision
          </span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          {t('description')}
        </p>
      </div>

      <div className="w-full flex justify-center max-w-6xl">
        {step === "upload" && (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
        )}

        {step === "analyzing" && (
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-xl font-medium">{t('processing')}</p>
                <p className="text-sm text-muted-foreground">{t('processing_desc')}</p>
            </div>
        )}

        {step === "dashboard" && analysisData && (
            <Tabs defaultValue="analysis" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-5 mb-8">
                    <TabsTrigger value="analysis">{t('tab_analysis')}</TabsTrigger>
                    <TabsTrigger value="chat">{t('tab_chat')}</TabsTrigger>
                    <TabsTrigger value="quiz">{t('tab_quiz')}</TabsTrigger>
                    <TabsTrigger value="flashcards">{t('tab_flashcards')}</TabsTrigger>
                    <TabsTrigger value="planning">{t('tab_planning')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="mt-0">
                    <AnalysisView analysis={analysisData} onStartQuiz={() => {}} />
                </TabsContent>
                
                <TabsContent value="chat" className="mt-0">
                    <ChatInterface context={extractedText} language={locale} />
                </TabsContent>
                
                <TabsContent value="quiz" className="mt-0">
                    {loadingQuiz ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p>{t('generating_quiz')}</p>
                        </div>
                    ) : quizData ? (
                        <QuizView questions={quizData} onReset={() => setQuizData(null)} onComplete={handleQuizComplete} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            {t('quiz_error')}
                            <button onClick={() => handleTabChange("quiz")} className="block mx-auto mt-2 underline text-primary">Try Again</button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="flashcards" className="mt-0">
                    {loadingFlashcards ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p>{t('generating_flashcards')}</p>
                        </div>
                    ) : flashcardsData ? (
                         <FlashcardView cards={flashcardsData} onReset={() => setFlashcardsData(null)} onComplete={handleFlashcardsComplete} />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            {t('flashcards_error')}
                             <button onClick={() => handleTabChange("flashcards")} className="block mx-auto mt-2 underline text-primary">Try Again</button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="planning" className="mt-0">
                     <PlanningView topics={analysisData.key_concepts || []} locale={locale} />
                </TabsContent>
            </Tabs>
        )}
      </div>
    </main>
  );
}
