import type { SiteContent } from "./types";

export const en: SiteContent = {
  locale: "en",
  meta: {
    title: "MeetSense | Work said in Teams meetings gets an owner",
    description:
      "MeetSense joins your Teams meeting, writes down the conversation and records every decision, every task taken on and every risk with its owner and the second it was said.",
  },
  ui: {
    skip: "Skip to content",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langSwitch: { label: "Türkçe", target: "tr" },
    example: "Example data",
    kinds: { decision: "Decision", action: "Action", risk: "Risk" },
    noOwner: "No owner",
    owner: "Owner",
    saidBy: "Said by",
    due: "Due",
    from: "Source",
    sources: "Records it relies on",
    assistant: "AI Assistant",
  },
  nav: {
    links: [
      { href: "#akis", label: "Life of a meeting" },
      { href: "#sablonlar", label: "Templates" },
      { href: "#kurumsal", label: "Enterprise" },
    ],
    demo: "Request a demo",
  },
  people: [
    { initials: "SA", name: "Selin Aydın" },
    { initials: "MK", name: "Mert Koç" },
    { initials: "AD", name: "Ayşe Demir" },
    { initials: "OY", name: "Okan Yıldız" },
  ],
  meeting: {
    title: "Izmir office move plan",
    date: "October 6, 2026, 10:00–10:40",
    platform: "Microsoft Teams",
    days: ["Mon 5", "Tue 6", "Wed 7", "Thu 8", "Fri 9"],
  },

  hero: {
    title: "Work said out loud finds its owner.",
    lead: "MeetSense joins your Teams meeting and writes down what's said. Every decision made, every task taken on and every risk raised is recorded with who said it, by when, and at which second.",
    primary: "Request a demo",
    secondary: "Follow one meeting from start to finish",
    railLabel: "This week's rail",
    tickets: [
      { no: "01", kind: "decision", text: "Move set for the weekend of December 14", from: "10:04", owner: "SA", day: 1 },
      { no: "02", kind: "action", text: "Collect three moving quotes", from: "10:07", owner: "MK", due: "Oct 9", day: 4 },
      { no: "03", kind: "risk", text: "Server room cooling may not cope with the archive servers", from: "10:11", owner: "AD", day: 1 },
    ],
  },

  life: {
    id: "akis",
    title: "The life of a meeting",
    lead: "A Tuesday morning, a 40-minute office move meeting. From the calendar invite to a question asked a month later, see what MeetSense does at each stop.",
    invite: {
      id: "davet",
      time: "Tue 09:55",
      title: "One more name on the invite",
      text: "Open the meeting from your calendar and add the AI Bot. Agenda, link and time stay the same; the bot is added to the invite as one more participant.",
      points: [
        "Adding the bot to a single meeting or to a whole recurring series is your call.",
        "If the organiser doesn't let the bot in from the lobby, MeetSense records nothing.",
      ],
      card: {
        label: "Add the AI Bot",
        options: ["This meeting only", "The whole recurring series"],
        selected: 0,
        send: "Add",
        lobby: "Waiting in the lobby: MeetSense AI",
      },
    },
    record: {
      id: "kayit",
      time: "Tue 10:00",
      title: "You talk, the notes get taken",
      text: "From the moment it's let in, the bot writes down who says what, by name and to the second. Nobody has to hold a pen to keep up.",
      points: [
        "Recording can be paused mid-meeting, resumed later, or ended altogether.",
        "People can speak Turkish or English; set the language yourself or leave it to MeetSense.",
      ],
      status: "Recording",
      lines: [
        { who: "SA", time: "10:02", text: "The lease ends in December and we don't want to renew it." },
        { who: "OY", time: "10:03", text: "The new building won't have its internet line before December 1." },
        { who: "SA", time: "10:04", text: "Then let's decide: we're moving on the weekend of December 14." },
        { who: "MK", time: "10:07", text: "I'll collect three quotes from moving companies by Friday." },
      ],
    },
    moment: {
      id: "an",
      time: "Tue 10:04",
      title: "A decision is recorded the second it's made",
      text: "While people keep talking, decisions, actions and risks are pulled out of the sentences. Each record stays tied to its own sentence and second, so months later the answer to \"who said that, and when?\" is one click away.",
      line: { who: "SA", time: "10:04", text: "Then let's decide: we're moving on the weekend of December 14." },
      phrase: "we're moving on the weekend of December 14",
      ticket: { no: "01", kind: "decision", text: "Move set for the weekend of December 14", from: "10:04", owner: "SA" },
    },
    close: {
      id: "kapanis",
      time: "Tue 10:40",
      title: "When the last person leaves, the record prints",
      text: "As soon as the meeting ends, one record is prepared with the sections the chosen template asks for. Someone who was in another meeting at that hour reads it and catches everything they missed.",
      points: [
        "The record can be passed on as a link or kept as a PDF file.",
        "Who can open it is set per meeting: attendees, only you, or people you pick.",
      ],
      doc: {
        title: "Izmir office move plan",
        meta: "October 6, 2026, 10:00–10:40 · Microsoft Teams · 4 attendees",
        template: "Standard template",
        summaryTitle: "Summary",
        summary: "The lease won't be renewed; because the internet line isn't ready before December 1, the move is set for the weekend of December 14. Mert has the moving quotes, Okan the network survey. Server room cooling is a risk for the archive servers. Nobody has taken the staff announcement yet.",
        sections: { decisions: "Decisions", actions: "Actions", risks: "Risks" },
        decisions: [
          { no: "01", kind: "decision", text: "Move set for the weekend of December 14.", from: "10:04", owner: "SA" },
          { no: "04", kind: "decision", text: "Everyone works remotely during move week.", from: "10:09", owner: "SA" },
        ],
        actions: [
          { no: "02", kind: "action", text: "Collect three moving quotes", from: "10:07", owner: "MK", due: "Oct 9" },
          { no: "05", kind: "action", text: "Get the new building's network surveyed", from: "10:03", owner: "OY", due: "Oct 8" },
          { no: "06", kind: "action", text: "Write the move announcement for staff", from: "10:15", due: "Oct 16" },
        ],
        risks: [
          { no: "03", kind: "risk", text: "Server room cooling may not cope with the archive servers.", from: "10:11", owner: "AD" },
        ],
        share: ["Copy link", "Download as PDF"],
      },
    },
    followup: {
      id: "takip",
      time: "Thu 14:30",
      title: "Work without an owner never makes the rail",
      text: "Every task someone takes on hangs on the rail with their name and due day. Work that was mentioned but claimed by nobody waits off the rail, where everyone can see it.",
      rail: [
        { no: "05", kind: "action", text: "Get the new building's network surveyed", from: "10:03", owner: "OY", due: "Oct 8", day: 3 },
        { no: "02", kind: "action", text: "Collect three moving quotes", from: "10:07", owner: "MK", due: "Oct 9", day: 4 },
      ],
      stalled: { no: "06", kind: "action", text: "Write the move announcement for staff", from: "10:15", due: "Oct 16" },
      stamp: "No owner",
      note: "Okan raised it at 10:15; nobody picked it up.",
    },
    weekly: {
      id: "haftalik",
      time: "Sun 20:00",
      title: "Sunday evening, the week's tally",
      text: "As the week closes, every meeting's record adds up on one slip: how many hours were spent talking, how many decisions and tasks came out, how many tasks still have no owner. Last week's figures sit alongside, and topics that keep coming back across meetings are written out separately.",
      report: {
        title: "The week's tally",
        period: "October 5–11, 2026",
        prevLabel: "last week",
        groups: [
          {
            label: "Time",
            rows: [
              { label: "Meetings", value: "11", prev: "9" },
              { label: "Total time", value: "7 h 20 min", prev: "6 h 45 min" },
            ],
          },
          {
            label: "Output",
            rows: [
              { label: "Decisions", value: "17", prev: "13" },
              { label: "Actions", value: "26", prev: "23" },
            ],
          },
          {
            label: "Attention",
            rows: [{ label: "Unowned actions", value: "3", prev: "2", flag: true }],
          },
        ],
        notesTitle: "What the report points out",
        notes: [
          { tag: "Calendar risk", text: "Only two weeks of slack remain between the move date and the end of the lease.", meetings: "Move plan · Facilities call", flag: true },
          { tag: "Open topic", text: "Parking at the new building was discussed but not yet decided.", meetings: "Move plan · HR weekly" },
          { tag: "Habit", text: "6 of the week's 17 decisions were taken in the last five minutes of a meeting.", meetings: "Across 11 meeting records" },
        ],
      },
    },
    later: {
      id: "sonra",
      time: "Nov 3",
      title: "A question asked a month later is answered with its source",
      text: "Whatever you ask the AI Assistant, it builds the answer from what was said in your meetings, the decisions taken and the tasks opened. Under the answer it shows which record and which second it relies on.",
      pick: "Example questions put to the assistant",
      scopes: "A question can be limited to one meeting, one meeting series, or every record.",
      qa: [
        {
          q: "Why was the move set for December 14?",
          scope: "This series",
          a: "Because the internet line at the new building wasn't coming before December 1. In the October 6 move meeting, Selin said the lease wouldn't be renewed, and the date was set for the weekend of December 14.",
          sources: [
            { ref: "#01 · 10:04", label: "Decision · Izmir office move plan" },
            { ref: "10:03", label: "Transcript · Okan Yıldız" },
          ],
        },
        {
          q: "Who ended up writing the staff announcement?",
          scope: "All",
          a: "It was left unowned on October 6. Ayşe took it on in the October 13 HR weekly and it was marked done on October 16.",
          sources: [
            { ref: "#06 · 10:15", label: "Action · Izmir office move plan" },
            { ref: "09:12", label: "Transcript · HR weekly, October 13" },
          ],
        },
        {
          q: "What was decided about server room cooling?",
          scope: "All",
          a: "In the October 8 facilities call it was decided to rent an extra cooling unit; the archive servers move once it's installed, a week after the office move.",
          sources: [
            { ref: "#03 · 10:11", label: "Risk · Izmir office move plan" },
            { ref: "14:26", label: "Decision · Facilities call, October 8" },
          ],
        },
      ],
    },
  },

  templates: {
    id: "sablonlar",
    title: "The kind of meeting decides the shape of the record",
    lead: "A sales call yields a deal score, a candidate interview an assessment card, a morning check-in a list of blockers. If no template was picked for a meeting, the default you set is used.",
    honest: "If a conversation doesn't match the chosen template, MeetSense doesn't fill the gaps with guesses; it says plainly what doesn't fit and what information is missing.",
    custom: "For your own kinds of meetings, build a new template section by section, duplicate an existing one and change it, or make it your team's default.",
    specimens: [
      {
        name: "Standard",
        purpose: "Every meeting",
        heading: "Summary, highlights, decisions, actions",
        rows: [
          { label: "Decisions", value: "2" },
          { label: "Actions", value: "3" },
          { label: "Unowned", value: "1" },
        ],
        flag: "Unowned work on its own line",
        footer: "Link or PDF",
      },
      {
        name: "Customer Management",
        purpose: "Sales calls",
        heading: "Deal score 72/100",
        rows: [
          { label: "Budget", value: "Clear" },
          { label: "Authority", value: "Clear" },
          { label: "Need", value: "Clear" },
          { label: "Timeline", value: "Unclear" },
        ],
        flag: "Unanswered objection: setup time",
        footer: "Sections come out CRM-ready",
      },
      {
        name: "Interview",
        purpose: "Candidate interviews",
        heading: "AI recommendation: Hold",
        rows: [
          { label: "Type", value: "Technical" },
          { label: "Criteria", value: "5 headings" },
          { label: "Salary", value: "Within budget" },
        ],
        flag: "Sidestepped question flagged",
        footer: "The panel makes the call · PDF",
      },
      {
        name: "Daily Standup",
        purpose: "Team check-ins",
        heading: "Yesterday, today, blockers",
        rows: [
          { label: "People", value: "6" },
          { label: "Blockers", value: "2" },
        ],
        footer: "Three lines per person",
      },
    ],
  },

  enterprise: {
    id: "kurumsal",
    title: "Nothing new added to your Microsoft 365",
    lead: "No new account for the team to open, no new screen to learn. MeetSense works inside the Microsoft setup your company already runs.",
    items: [
      { label: "Sign-in", value: "Everyone signs in with their company Microsoft account. Anyone who prefers can use MeetSense straight from Teams." },
      { label: "Calendar", value: "Cloud calendars connect via Microsoft Graph; Exchange servers running in-house connect via EWS." },
      { label: "Visibility", value: "Who can open a meeting's record is set meeting by meeting." },
      { label: "Channels", value: "Meetings of the same project or team collect in one channel; everyone in it reaches what's shared there." },
      { label: "Sharing", value: "Records are passed on as links or exported as PDF." },
      { label: "Language", value: "Spoken language, interface language and record language are chosen independently." },
    ],
  },

  demo: {
    id: "demo",
    title: "Let's watch your next meeting together",
    lead: "In a real meeting of your own team, let's see together what MeetSense records, and in whose name.",
    formTitle: "Demo request",
    fields: { name: "Full name", email: "Work email", company: "Company", message: "Note", optional: "optional" },
    placeholders: {
      name: "Your full name",
      email: "name.surname@company.com",
      company: "Your company's name",
      message: "Team size, meeting types or times that suit you",
    },
    errors: {
      name: "Enter your name.",
      email: "Enter a valid work email, for example name.surname@company.com.",
      company: "Enter your company's name.",
    },
    submit: "Send demo request",
    sending: "Preparing email",
    success: "Your request is ready in your email app. It reaches our team when you press Send.",
    direct: "Prefer to write directly",
    mailSubject: "MeetSense demo request",
    note: "The form turns your details into a ready-to-send message in your email app.",
  },

  footer: { contact: "Contact", rights: "© 2026 BGTS" },
};
