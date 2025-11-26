"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardViewProps {
  cards: Flashcard[];
  onReset: () => void;
  onComplete?: () => void;
}

export function FlashcardView({ cards, onReset, onComplete }: FlashcardViewProps) {
  const t = useTranslations("Flashcards");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
      if (finished && onComplete) {
          onComplete();
      }
  }, [finished, onComplete]);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
        setTimeout(() => setCurrentIndex(currentIndex - 1), 200);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (finished) {
      return (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
              <h2 className="text-2xl font-bold">{t('completed')}</h2>
              <Button onClick={onReset} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t('restart')}
              </Button>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-6">
        <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {cards.length}
        </div>
        
        <div 
            className="relative w-full h-[300px] cursor-pointer perspective-1000 group"
            onClick={handleFlip}
        >
            <div className={cn(
                "relative w-full h-full transition-all duration-500 transform-style-3d",
                isFlipped ? "rotate-y-180" : ""
            )}>
                {/* Front */}
                <Card className="absolute w-full h-full flex items-center justify-center p-8 text-center backface-hidden">
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">{t('front')}</span>
                        <p className="text-xl font-medium">{cards[currentIndex].front}</p>
                    </div>
                </Card>

                {/* Back */}
                <Card className="absolute w-full h-full flex items-center justify-center p-8 text-center backface-hidden rotate-y-180 bg-primary/5 border-primary">
                     <div className="space-y-4">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">{t('back')}</span>
                        <p className="text-xl font-medium">{cards[currentIndex].back}</p>
                    </div>
                </Card>
            </div>
        </div>

        <div className="flex gap-4">
            <Button onClick={handlePrev} disabled={currentIndex === 0} variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button onClick={handleFlip} variant="default" className="min-w-[120px]">
                {isFlipped ? t('show_front') : t('show_back')}
            </Button>
            <Button onClick={handleNext} variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
  );
}
