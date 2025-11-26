"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Question {
  id: number;
  type: string; // "multiple_choice" | "true_false"
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizViewProps {
  questions: { questions: Question[] };
  onReset: () => void;
  onComplete?: (score: number) => void;
}

export function QuizView({ questions: quizData, onReset, onComplete }: QuizViewProps) {
  const t = useTranslations("Quiz");
  const questions = quizData.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  // Effect to trigger onComplete when results are shown
  useEffect(() => {
      if (showResults && onComplete) {
          onComplete(score);
      }
  }, [showResults, score, onComplete]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    // Normalize comparison for True/False (case insensitive)
    const isCorrect = option.toLowerCase() === currentQuestion.correct_answer.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center p-8">
        <CardHeader>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-6xl font-bold text-primary">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-xl text-muted-foreground">
            {t('score')}: {score} / {questions.length}
          </p>
          <Progress value={(score / questions.length) * 100} className="h-3 w-full" />
        </CardContent>
        <CardFooter className="justify-center pt-4">
          <Button onClick={onReset} size="lg" className="gap-2">
            <RotateCcw className="w-4 h-4" /> {t('try_another')}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
        <span className="flex items-center gap-2">
            {t('question')} {currentIndex + 1} / {questions.length}
            {currentQuestion.type === 'true_false' && (
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full font-mono">Vrai/Faux</span>
            )}
        </span>
        <span>{t('current_score')}: {score}</span>
      </div>
      <Progress value={progress} className="h-2" />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed flex gap-3">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className={cn(
            "space-y-3",
            currentQuestion.type === 'true_false' ? "grid grid-cols-2 gap-4 space-y-0" : ""
        )}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            // Loose comparison for flexibility
            const isCorrect = option.toLowerCase() === currentQuestion.correct_answer.toLowerCase();
            
            let className = "justify-start text-left h-auto py-4 px-6 text-base hover:bg-accent hover:text-accent-foreground transition-all";
            
            if (currentQuestion.type === 'true_false') {
                className = "justify-center text-center font-bold text-lg py-8";
            }

            if (isAnswered) {
              if (isCorrect) {
                className += " bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-500";
              } else if (isSelected && !isCorrect) {
                className += " bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/20 hover:text-red-500";
              } else {
                className += " opacity-50";
              }
            } else if (isSelected) {
                 className += " border-primary ring-1 ring-primary";
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={cn("w-full whitespace-normal", className)}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
              >
                <div className="flex items-center w-full">
                    {currentQuestion.type !== 'true_false' && (
                        <span className="mr-4 opacity-50 font-mono text-sm">{String.fromCharCode(65 + index)}.</span>
                    )}
                    <span className={currentQuestion.type === 'true_false' ? "mx-auto" : "flex-1"}>
                        {option}
                    </span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 ml-2 flex-shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-2 flex-shrink-0" />}
                </div>
              </Button>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 pt-2">
            {isAnswered && (
                <div className="bg-muted/50 p-4 rounded-lg text-sm animate-in fade-in slide-in-from-top-2 border-l-4 border-primary">
                    <span className="font-semibold block mb-1 flex items-center gap-2">
                        {t('explanation')}
                    </span>
                    {currentQuestion.explanation}
                </div>
            )}
            
            <div className="flex justify-end">
                <Button 
                    onClick={handleNext} 
                    disabled={!isAnswered}
                    size="lg"
                    className="gap-2"
                >
                    {currentIndex < questions.length - 1 ? t('next') : t('finish')} 
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
