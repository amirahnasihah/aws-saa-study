import type { LabStepContent } from '@/lib/labs'

type LabStepListProps = {
  steps: LabStepContent[]
}

export default function LabStepList({ steps }: LabStepListProps) {
  return (
    <ol className="space-y-4 list-decimal list-inside">
      {steps.map((step) => (
        <li key={step.text} className="text-[0.85rem] text-aws-text leading-relaxed">
          <span>{step.text}</span>
          {step.images && step.images.length > 0 ? (
            <div className="mt-3 ml-0 sm:ml-5 space-y-3 not-prose">
              {step.images.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className="rounded-lg border border-aws-border max-w-full h-auto"
                />
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
