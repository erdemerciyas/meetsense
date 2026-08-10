"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/content/types";

export function CTASection({ content }: { content: SiteContent["cta"] }) {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="cta" className="section-padding">
      <div className="section-shell">
        <div className="surface-card-lg overflow-hidden border-accent/20 p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading
                label={content.label}
                title={content.title}
                subtitle={content.subtitle}
                className="max-w-none"
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="mailto:hello@bgts.ai" variant="secondary">
                  {content.secondary}
                </Button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" aria-live="polite">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  {content.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={submitted}
                  placeholder={content.emailPlaceholder}
                  className="field-input"
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  {content.companyLabel}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  disabled={submitted}
                  placeholder={content.companyPlaceholder}
                  className="field-input"
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitted}>
                {submitted ? content.successMessage : content.submit}
              </Button>
              <p className="text-xs text-muted">{content.footerNote}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
