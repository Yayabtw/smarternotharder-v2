"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizViewProps {
  questions: { questions: Question[] }; // Matching the API response structure
  onReset: () => void;
}

export function QuizView({ questions: quizData, onReset }: QuizViewProps) {
  const questions = quizData.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === currentQuestion.correct_answer) {
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
          <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-6xl font-bold text-primary">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-xl text-muted-foreground">
            You answered {score} out of {questions.length} questions correctly.
          </p>
          <Progress value={(score / questions.length) * 100} className="h-3 w-full" />
        </CardContent>
        <CardFooter className="justify-center pt-4">
          <Button onClick={onReset} size="lg" className="gap-2">
            <RotateCcw className="w-4 h-4" /> Try Another Document
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <Progress value={progress} className="h-2" />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correct_answer;
            
            let variant = "outline";
            let className = "justify-start text-left h-auto py-4 px-6 text-base hover:bg-accent hover:text-accent-foreground";
            
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
                    <span className="mr-4 opacity-50 font-mono text-sm">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 ml-2" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-2" />}
                </div>
              </Button>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4 pt-2">
            {isAnswered && (
                <div className="bg-muted/50 p-4 rounded-lg text-sm animate-in fade-in slide-in-from-top-2">
                    <span className="font-semibold block mb-1">Explanation:</span>
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
                    {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"} 
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

