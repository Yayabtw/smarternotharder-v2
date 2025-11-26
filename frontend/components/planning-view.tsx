"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider"; // Need to check if Slider exists or use native input range
import { Calendar as CalendarIcon, Clock, BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { generateStudyPlan } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PlanningViewProps {
  topics: string[];
  locale: string;
}

interface StudySession {
  date: string;
  topic: string;
  activity: string;
  duration: string;
  description: string;
}

export function PlanningView({ topics, locale }: PlanningViewProps) {
  const t = useTranslations("Planning");
  const [examDate, setExamDate] = useState<string>("");
  const [hoursPerDay, setHoursPerDay] = useState<number>(2);
  const [plan, setPlan] = useState<StudySession[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!examDate) return;
    setLoading(true);
    try {
      const data = await generateStudyPlan(topics, examDate, hoursPerDay, locale);
      setPlan(data.plan);
    } catch (error) {
      console.error("Planning error", error);
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  if (plan) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold">{t('your_plan')}</h2>
             <Button variant="outline" onClick={() => setPlan(null)}>{t('regenerate')}</Button>
        </div>
        
        <div className="space-y-4 relative border-l-2 border-muted ml-4 pl-8 pb-4">
            {plan.map((session, index) => (
                <Card key={index} className="relative mb-6 hover:shadow-md transition-shadow">
                    <div className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-primary border-4 border-background box-content" />
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <CalendarIcon className="w-4 h-4" />
                                {session.date}
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                <Clock className="w-3 h-3" />
                                {session.duration}
                            </div>
                        </div>
                        <CardTitle className="text-lg leading-tight">{session.topic}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-1">{session.activity}</p>
                                <p className="text-sm text-muted-foreground">{session.description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {t('configure_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="exam-date">{t('exam_date')}</Label>
          <Input
            id="exam-date"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="hours">{t('hours_per_day')}</Label>
            <span className="text-sm font-medium">{hoursPerDay}h</span>
          </div>
          <Input 
            id="hours"
            type="range"
            min="1"
            max="12"
            step="1"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
            className="cursor-pointer"
          />
        </div>

        <Button 
            className="w-full" 
            onClick={handleGenerate} 
            disabled={!examDate || loading}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('generating')}
                </>
            ) : (
                t('generate_button')
            )}
        </Button>
      </CardContent>
    </Card>
  );
}

