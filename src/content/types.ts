export type MarkKind = "decision" | "action" | "risk";

export type Person = { initials: string; name: string };

export type TranscriptLine = { who: string; time: string; text: string };

/** One printed unit of work: what the meeting produced, with its origin. */
export type Ticket = {
  no: string;
  kind: MarkKind;
  text: string;
  /** Timecode of the sentence it was printed from. */
  from: string;
  owner?: string;
  due?: string;
  /** Rail notch index (0 = first weekday). */
  day?: number;
};

export type Row = { label: string; value: string };

export type Chapter = { id: string; time: string; title: string; text: string };

export type Specimen = {
  name: string;
  purpose: string;
  heading: string;
  rows: Row[];
  flag?: string;
  footer: string;
};

export type SiteContent = {
  locale: string;
  meta: { title: string; description: string };
  ui: {
    skip: string;
    menuOpen: string;
    menuClose: string;
    langSwitch: { label: string; target: string };
    example: string;
    kinds: Record<MarkKind, string>;
    noOwner: string;
    owner: string;
    saidBy: string;
    due: string;
    from: string;
    sources: string;
    assistant: string;
  };
  nav: { links: { href: string; label: string }[]; demo: string };
  people: Person[];
  meeting: { title: string; date: string; platform: string; days: string[] };

  hero: {
    title: string;
    lead: string;
    secondary: string;
    railLabel: string;
    tickets: Ticket[];
  };

  life: {
    id: string;
    title: string;
    lead: string;
    invite: Chapter & {
      points: string[];
      card: { label: string; options: string[]; selected: number; send: string; lobby: string };
    };
    record: Chapter & { points: string[]; status: string; lines: TranscriptLine[] };
    moment: Chapter & { line: TranscriptLine; phrase: string; ticket: Ticket };
    close: Chapter & {
      points: string[];
      doc: {
        title: string;
        meta: string;
        template: string;
        summaryTitle: string;
        summary: string;
        sections: { decisions: string; actions: string; risks: string };
        decisions: Ticket[];
        actions: Ticket[];
        risks: Ticket[];
        share: string[];
      };
    };
    followup: Chapter & { rail: Ticket[]; stalled: Ticket; stamp: string; note: string };
    weekly: Chapter & {
      report: {
        title: string;
        period: string;
        prevLabel: string;
        groups: { label: string; rows: { label: string; value: string; prev: string; flag?: boolean }[] }[];
        notesTitle: string;
        notes: { tag: string; text: string; meetings: string; flag?: boolean }[];
      };
    };
    later: Chapter & {
      pick: string;
      scopes: string;
      qa: { q: string; scope: string; a: string; sources: { ref: string; label: string }[] }[];
    };
  };

  templates: {
    id: string;
    title: string;
    lead: string;
    honest: string;
    custom: string;
    specimens: Specimen[];
  };

  enterprise: { id: string; title: string; lead: string; items: Row[] };

  demo: {
    id: string;
    title: string;
    lead: string;
    formTitle: string;
    fields: { name: string; email: string; company: string; message: string; optional: string };
    placeholders: { name: string; email: string; company: string; message: string };
    errors: { name: string; email: string; company: string };
    submit: string;
    sending: string;
    success: string;
    direct: string;
    mailSubject: string;
    note: string;
  };

  footer: { contact: string; rights: string };
};
