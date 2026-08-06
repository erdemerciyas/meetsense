"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Spotlight } from "@/components/ui/Spotlight";
import type { SiteContent } from "@/content/types";
import { motionDuration, motionEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CTASection({ content }: { content: SiteContent["cta"] }) {
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="cta" className="section-padding relative">
      <SectionDivider />
      <div className="section-shell">
        <Spotlight size={480} color="rgba(91, 95, 199, 0.08)">
          <motion.div
            className="gradient-border-card overflow-hidden rounded-3xl p-8 md:p-12"
            initial={reducedMotion ? false : { opacity: 0, y: 32, filter: "blur(8px)" }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: motionDuration.slow, ease: motionEase }}
          >
            <div className="elevated-card-lg relative overflow-hidden rounded-[calc(1.5rem-1px)] p-8 md:p-12">
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent-warm/5 blur-3xl"
                aria-hidden
              />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
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
          </motion.div>
        </Spotlight>
      </div>
    </section>
  );
}
