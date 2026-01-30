import { useState } from 'react';
import { Intervention, LoopNode } from '@/types/simulation';
import { interventions, loopNodes } from '@/data/loopData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Shield, Check, Minus } from 'lucide-react';

interface InterventionsScreenProps {
  nodes?: LoopNode[];
}

const effectivenessColors: Record<string, string> = {
  high: 'bg-flow-stabilizing/20 text-flow-stabilizing',
  medium: 'bg-status-stressed/20 text-status-stressed',
  low: 'bg-muted text-muted-foreground',
  uncertain: 'bg-primary/20 text-primary'
};

export function InterventionsScreen({ nodes = loopNodes }: InterventionsScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedIntervention = interventions.find(i => i.id === selectedId);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Policy Interventions</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Select an intervention to see which loop nodes it targets.
        </p>
      </div>

      {/* Intervention List */}
      <div className="grid gap-2">
        {interventions.map((intervention) => (
          <Card
            key={intervention.id}
            className={cn(
              'cursor-pointer transition-all',
              selectedId === intervention.id 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            )}
            onClick={() => setSelectedId(selectedId === intervention.id ? null : intervention.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{intervention.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {intervention.description}
                  </p>
                </div>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full capitalize shrink-0',
                  effectivenessColors[intervention.effectiveness]
                )}>
                  {intervention.effectiveness}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Node Impact Visualization */}
      {selectedIntervention && (
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardContent className="py-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Impact on Loop Nodes
            </div>
            <div className="grid grid-cols-4 gap-2">
              {nodes.map(node => {
                const isTargeted = selectedIntervention.targetNodes.includes(node.id);
                return (
                  <div
                    key={node.id}
                    className={cn(
                      'flex flex-col items-center p-2 rounded-lg text-center',
                      isTargeted 
                        ? 'bg-flow-stabilizing/20 ring-1 ring-flow-stabilizing' 
                        : 'bg-muted/50'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center mb-1',
                      isTargeted ? 'bg-flow-stabilizing text-background' : 'bg-muted'
                    )}>
                      {isTargeted ? <Check className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </div>
                    <span className={cn(
                      'text-[10px] font-medium',
                      isTargeted ? 'text-flow-stabilizing' : 'text-muted-foreground'
                    )}>
                      {node.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-1">Trade-offs</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {selectedIntervention.tradeoffs.map((t, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-flow-accelerating">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
