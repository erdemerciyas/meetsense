"use client";

import { useState } from "react";
import type { SiteContent } from "@/content/types";

type Field = "name" | "email" | "company";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TO = "hello@bgts.ai";

export function DemoForm({ c }: { c: SiteContent }) {
  const d = c.demo;
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function check(field: Field, value: string) {
    const ok = field === "email" ? EMAIL.test(value.trim()) : value.trim().length > 1;
    return ok ? undefined : d.errors[field];
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      name: check("name", values.name),
      email: check("email", values.email),
      company: check("company", values.company),
    };
    setErrors(next);
    const firstBad = (Object.keys(next) as Field[]).find((k) => next[k]);
    if (firstBad) {
      document.getElementById(`demo-${firstBad}`)?.focus();
      return;
    }
    setStatus("sending");
    const body = [
      `${d.fields.name}: ${values.name}`,
      `${d.fields.email}: ${values.email}`,
      `${d.fields.company}: ${values.company}`,
      values.message ? `\n${values.message}` : "",
    ].join("\n");
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(d.mailSubject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => setStatus("done"), 400);
  }

  const input = (field: Field, type: string, autoComplete: string) => (
    <div>
      <label htmlFor={`demo-${field}`} className="block text-[0.9375rem] font-semibold">
        {d.fields[field]}
      </label>
      <input
        id={`demo-${field}`}
        name={field}
        type={type}
        autoComplete={autoComplete}
        required
        value={values[field]}
        placeholder={d.placeholders[field]}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={errors[field] ? `demo-${field}-error` : undefined}
        onChange={(e) => {
          const value = e.target.value;
          setValues((v) => ({ ...v, [field]: value }));
          if (errors[field]) setErrors((er) => ({ ...er, [field]: check(field, value) }));
        }}
        onBlur={() => setErrors((er) => ({ ...er, [field]: check(field, values[field]) }))}
        className="field-input mt-1.5"
      />
      {errors[field] && (
        <p id={`demo-${field}-error`} className="mt-1.5 text-[0.875rem] text-ember-ink">
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 px-5 py-6 md:grid-cols-2 md:px-7 md:py-7">
      {input("name", "text", "name")}
      {input("email", "email", "email")}
      <div className="md:col-span-2">{input("company", "text", "organization")}</div>
      <div className="md:col-span-2">
        <label htmlFor="demo-message" className="block text-[0.9375rem] font-semibold">
          {d.fields.message} <span className="font-normal text-ink-3">({d.fields.optional})</span>
        </label>
        <textarea
          id="demo-message"
          name="message"
          rows={3}
          value={values.message}
          placeholder={d.placeholders.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="field-input mt-1.5 resize-y"
        />
      </div>
      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="mono text-[0.75rem] text-ink-3">{d.note}</p>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? d.sending : d.submit}
        </button>
      </div>
      <p role="status" className="text-[0.9375rem] md:col-span-2 empty:hidden">
        {status === "done" ? d.success : ""}
      </p>
    </form>
  );
}
