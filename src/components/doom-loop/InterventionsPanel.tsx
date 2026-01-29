import { Intervention, SimulationParams } from '@/types/simulation';
import { interventions } from '@/data/loopData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';

interface InterventionsPanelProps {
  onApplyIntervention: (effects: Partial<SimulationParams>) => void;
  className?: string;
}

const effectivenessConfig = {
  high: { icon: CheckCircle, color: 'text-status-stable', bg: 'bg-status-stable/10' },
  medium: { icon: Zap, color: 'text-status-stressed', bg: 'bg-status-stressed/10' },
  low: { icon: AlertTriangle, color: 'text-flow-accelerating', bg: 'bg-flow-accelerating/10' },
  uncertain: { icon: HelpCircle, color: 'text-muted-foreground', bg: 'bg-muted' }
};

export function InterventionsPanel({ onApplyIntervention, className }: InterventionsPanelProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-sm font-semibold">Policy Interventions</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Explore how different policies might weaken or fail to break parts of the loop.
        </p>
      </div>
      
      <div className="space-y-3">
        {interventions.map((intervention) => {
          const config = effectivenessConfig[intervention.effectiveness];
          const Icon = config.icon;
          
          return (
            <Card key={intervention.id} className="overflow-hidden">
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium">
                    {intervention.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={cn('text-[10px] shrink-0', config.bg, config.color)}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {intervention.effectiveness}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 pt-0 space-y-3">
                <p className="text-xs text-muted-foreground">
                  {intervention.description}
                </p>
                
                <div>
                  <div className="text-xs font-medium mb-1">Targets:</div>
                  <div className="flex flex-wrap gap-1">
                    {intervention.targetNodes.map(node => (
                      <span
                        key={node}
                        className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                      >
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium mb-1">Tradeoffs:</div>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {intervention.tradeoffs.map((tradeoff, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-flow-accelerating">•</span>
                        {tradeoff}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onApplyIntervention(intervention.paramEffects)}
                >
                  Apply to Simulation
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
