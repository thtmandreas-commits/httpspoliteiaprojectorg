import { useState } from 'react';
import { questionnaireQuestions, loopStages } from '@/data/loopData';
import { QuestionnaireResult } from '@/types/simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, RotateCcw } from 'lucide-react';

export function YouScreen() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    // Calculate score based on weights
    let totalScore = 0;
    questionnaireQuestions.forEach(q => {
      const answerIndex = answers[q.id];
      if (answerIndex !== undefined) {
        totalScore += q.options[answerIndex].weight;
      }
    });

    // Map score to stage (deterministic logic)
    const avgScore = totalScore / questionnaireQuestions.length;
    let stage: number;
    if (avgScore <= 1.5) stage = 1;
    else if (avgScore <= 2) stage = 2;
    else if (avgScore <= 2.5) stage = 3;
    else if (avgScore <= 3) stage = 4;
    else stage = 5;

    const stageData = loopStages[stage - 1];
    setResult({
      stage,
      stageName: stageData.name,
      interpretation: stageData.description
    });
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  const allAnswered = questionnaireQuestions.every(q => answers[q.id] !== undefined);

  if (result) {
    return (
      <div className="space-y-4">
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              <CardTitle className="text-lg">Your Position</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">Stage {result.stage}</div>
              <div className="text-lg font-semibold mt-1">{result.stageName}</div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {result.interpretation}
            </p>
            <div className="pt-2">
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Questionnaire
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stage visualization */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-1">
              {loopStages.map((s, i) => (
                <div key={s.stage} className="flex-1 flex flex-col items-center">
                  <div 
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                      result.stage === s.stage 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {s.stage}
                  </div>
                  <div className="text-[8px] text-muted-foreground mt-1 text-center leading-tight max-w-12">
                    {s.name.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Personal Reflection</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Answer 5 questions to discover your position in the loop.
        </p>
      </div>

      {questionnaireQuestions.map((q, qIndex) => (
        <Card key={q.id}>
          <CardContent className="py-3">
            <div className="text-sm font-medium mb-3">
              {qIndex + 1}. {q.question}
            </div>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <button
                  key={oIndex}
                  onClick={() => handleAnswer(q.id, oIndex)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                    'border hover:bg-accent',
                    answers[q.id] === oIndex 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border'
                  )}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button 
        onClick={handleSubmit} 
        disabled={!allAnswered}
        className="w-full"
      >
        See My Position
      </Button>
    </div>
  );
}
