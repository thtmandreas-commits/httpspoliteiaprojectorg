import { useState } from 'react';
import { QuestionnaireQuestion, QuestionnaireResult } from '@/types/simulation';
import { questionnaireQuestions, loopNodes } from '@/data/loopData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChevronRight, RotateCcw } from 'lucide-react';

interface QuestionnaireProps {
  className?: string;
}

export function Questionnaire({ className }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  const progress = (Object.keys(answers).length / questionnaireQuestions.length) * 100;
  const question = questionnaireQuestions[currentQuestion];

  const handleAnswer = (optionText: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: optionText }));
  };

  const calculateResult = () => {
    const nodeScores: Record<string, number> = {};
    
    questionnaireQuestions.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(o => o.text === answer);
      if (option) {
        nodeScores[option.nodeAffinity] = (nodeScores[option.nodeAffinity] || 0) + option.weight;
      }
    });

    const sortedNodes = Object.entries(nodeScores).sort((a, b) => b[1] - a[1]);
    const primaryNode = sortedNodes[0]?.[0] || 'labor';
    const secondaryNode = sortedNodes[1]?.[0] || 'income';

    const primaryNodeData = loopNodes.find(n => n.id === primaryNode);
    const secondaryNodeData = loopNodes.find(n => n.id === secondaryNode);

    const interpretations: Record<string, string> = {
      labor: "Your position is directly exposed to AI-driven labor displacement. Focus on building skills in areas AI struggles with: creativity, complex judgment, and human connection.",
      income: "Economic insecurity defines your relationship with the loop. Building financial resilience and diversifying income sources may reduce vulnerability.",
      capital: "You're positioned to benefit from AI productivity gains, but dependent on stable consumption. Without broad prosperity, even capital concentration faces limits.",
      fiscal: "Your reliance on government systems makes you sensitive to fiscal pressures from aging and declining tax bases. Policy changes directly affect you.",
      fertility: "Family formation concerns connect you to the demographic dimension. Economic security and policy support for families influence your trajectory.",
      aging: "Life stage positions you in the dependency side of demographics. Healthcare access, pension stability, and intergenerational support are key concerns.",
      consumption: "Your spending patterns connect you to the economic circulation. Income stability directly impacts your quality of life.",
      ai: "You're close to AI development and deployment. Your choices influence the pace and direction of automation."
    };

    setResult({
      primaryNode,
      secondaryNode,
      interpretation: interpretations[primaryNode] || "Your position intersects multiple loop dynamics.",
      vulnerabilities: [
        primaryNodeData?.label || 'Unknown',
        secondaryNodeData?.label || 'Unknown'
      ]
    });
  };

  const goNext = () => {
    if (currentQuestion < questionnaireQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    const primaryNodeData = loopNodes.find(n => n.id === result.primaryNode);
    
    return (
      <div className={cn('space-y-4', className)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Loop Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-sm text-muted-foreground mb-2">Primary Exposure</div>
              <div className="text-2xl font-bold text-primary">
                {primaryNodeData?.label}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {result.interpretation}
            </p>
            
            <div>
              <div className="text-xs font-medium mb-2">Your Vulnerabilities</div>
              <div className="flex gap-2">
                {result.vulnerabilities.map((v, i) => (
                  <span key={i} className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            
            <Button variant="outline" onClick={reset} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Questionnaire
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-sm font-semibold">Personal Reflection</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Map your position within the doom loop based on your circumstances.
        </p>
      </div>
      
      <Progress value={progress} className="h-1" />
      
      <Card>
        <CardHeader className="pb-2">
          <div className="text-xs text-muted-foreground">
            Question {currentQuestion + 1} of {questionnaireQuestions.length}
          </div>
          <CardTitle className="text-base">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={handleAnswer}
          >
            {question.options.map((option, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg border transition-colors',
                  answers[question.id] === option.text
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                )}
              >
                <RadioGroupItem value={option.text} id={`${question.id}-${i}`} />
                <Label
                  htmlFor={`${question.id}-${i}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <Button
            onClick={goNext}
            disabled={!answers[question.id]}
            className="w-full"
          >
            {currentQuestion < questionnaireQuestions.length - 1 ? (
              <>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : (
              'See Results'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
