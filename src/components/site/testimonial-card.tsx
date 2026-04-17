import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  context: string;
}

export function TestimonialCard({ quote, author, context }: TestimonialCardProps) {
  return (
    <Card className="h-full space-y-4 bg-[color:color-mix(in_srgb,var(--color-accent-soft)_46%,white)]">
      <p className="font-heading text-3xl text-[var(--color-foreground)]">“</p>
      <p className="text-sm leading-7 text-[var(--color-foreground-soft)]">{quote}</p>
      <div>
        <p className="font-medium text-[var(--color-foreground)]">{author}</p>
        <p className="text-sm text-[var(--color-muted)]">{context}</p>
      </div>
    </Card>
  );
}
