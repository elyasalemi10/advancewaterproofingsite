import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProcessStep {
  title: string
  description: string
  icon?: React.ReactNode
}

interface ProcessTimelineProps {
  steps: ProcessStep[]
  className?: string
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4 group">
          {/* Step Number */}
          <div className="flex-shrink-0 relative">
            <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {step.icon || (
                <span className="text-lg font-bold">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-primary/20"></div>
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 pt-2">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {step.title}
            </h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
