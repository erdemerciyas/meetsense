import type { SiteContent } from "./types";

export const enContent: SiteContent = {
  meta: {
    title: "MeetSense | AI Meeting Assistant",
    description:
      "Smart meeting platform for enterprise teams with automatic attendance, live transcription, AI analysis, and work tool integrations.",
    ogTitle: "MeetSense — Transform your meetings with AI",
    ogDescription:
      "Automatic attendance, live transcription, Jira and Trello integration, and enterprise memory.",
  },
  nav: [
    { id: "intro", label: "Overview" },
    { id: "transcript", label: "Transcript" },
    { id: "lifecycle", label: "Lifecycle" },
    { id: "features", label: "Features" },
    { id: "use-cases", label: "Use Cases" },
    { id: "value", label: "Value" },
  ],
  hero: {
    eyebrow: "AI Meeting Assistant",
    title: "Transform your meetings with the power of AI",
    subtitle:
      "Automatic attendance, live transcription, AI analysis, and work-tool integrations that turn conversations into clear action.",
    badges: [
      "Automatic attendance",
      "Live transcription",
      "Jira & Trello",
      "Enterprise memory",
    ],
    ctaPrimary: "Schedule a demo",
    ctaSecondary: "Explore the flow",
    scrollHint: "Scroll down",
  },
  intro: {
    label: "What is MeetSense",
    title: "Turn conversations into clarity — don't let decisions stay verbal",
    subtitle:
      "Every step from calendar to analysis is managed automatically. MeetSense records, understands, and converts meetings into action.",
    steps: [
      {
        id: "join",
        title: "Joins",
        description:
          "Detects scheduled meetings via Google Calendar and Microsoft Outlook integration. The virtual assistant joins based on your rules.",
        highlights: [
          "Automatic meeting detection via calendar sync",
          "Rule-based or manual bot triggering",
          "Teams, Zoom, and Google Meet compatibility",
        ],
      },
      {
        id: "record",
        title: "Records",
        description:
          "Captures high-quality audio throughout the meeting. Nothing is lost — all content is stored on secure infrastructure.",
        highlights: [
          "Enterprise-grade audio quality",
          "Continuous and secure recording",
          "Full meeting coverage",
        ],
      },
      {
        id: "transcribe",
        title: "Transcribes",
        description:
          "Uses speaker diarization to identify who said what, converts speech to searchable text, and provides accuracy scores.",
        highlights: [
          "Speaker-based separation (diarization)",
          "Segment-based audio playback",
          "Accuracy score and edit history",
        ],
      },
      {
        id: "analyze",
        title: "Analyzes",
        description:
          "AI engine extracts decisions, action items, owners, and risks from transcripts; pushes to Jira and Trello automatically.",
        highlights: [
          "Action, decision, and risk detection",
          "Analysis templates by meeting type",
          "Jira, Trello, and Azure DevOps integration",
        ],
      },
    ],
  },
  transcript: {
    label: "Live Transcript",
    title: "Every speaker identified, every decision traceable",
    subtitle:
      "Speaker diarization, segment-based playback, and AI action extraction in one view.",
    lines: [
      {
        speaker: "Sarah",
        speakerColor: "#5b5fc7",
        text: "Our API integration is delayed in sprint goals. We need to update Jira status.",
      },
      {
        speaker: "Michael",
        speakerColor: "#6bb700",
        text: "We decided last week to prioritize the OAuth flow. Documentation is still missing.",
      },
      {
        speaker: "Sarah",
        speakerColor: "#5b5fc7",
        text: "Michael, can you complete the OAuth documentation by Friday?",
        highlight: true,
        highlightLabel: "Action",
      },
      {
        speaker: "Michael",
        speakerColor: "#6bb700",
        text: "Yes, I'll deliver before Friday 5 PM. I'll also notify the QA team.",
        highlight: true,
        highlightLabel: "Owner + Date",
      },
      {
        speaker: "Emily",
        speakerColor: "#00bcf2",
        text: "Risk: Staging environment isn't ready for integration tests. Must be resolved this week.",
        highlight: true,
        highlightLabel: "Risk",
      },
    ],
    actionTitle: "Actions extracted by AI",
    actionItems: [
      "OAuth documentation — Michael — Friday 5 PM",
      "Jira ticket update — Sarah — Today",
      "Staging environment setup — DevOps — This week",
    ],
  },
  lifecycle: {
    label: "Meeting Lifecycle",
    title: "End-to-end flow from start to completion",
    subtitle:
      "Automatic orchestration from calendar to work tracking tools.",
    phases: [
      "Scheduled",
      "Bot Joining",
      "Recording",
      "Processing",
      "Completed",
    ],
    groupLabels: {
      trigger: "Trigger",
      core: "Core",
      output: "Output",
      integration: "Integration",
    },
    flowHint: "Click a phase or node to explore the flow",
    playLabel: "Play flow",
    pauseLabel: "Pause",
    stepLabel: "Step",
    nodes: [
      {
        id: "calendar",
        title: "Calendar",
        description: "Meetings detected automatically",
        group: "trigger",
      },
      {
        id: "manual",
        title: "Manual Trigger",
        description: "One-click bot control",
        group: "trigger",
      },
      {
        id: "bot",
        title: "Bot Joins",
        description: "Virtual assistant enters the call",
        group: "core",
      },
      {
        id: "record",
        title: "Audio Recording",
        description: "High-quality capture starts",
        group: "core",
      },
      {
        id: "meetsense",
        title: "MeetSense",
        description: "Central processing platform",
        group: "core",
      },
      {
        id: "assistant",
        title: "Voice Assistant",
        description: "Live Q&A support",
        group: "core",
      },
      {
        id: "transcript",
        title: "AI Transcript",
        description: "Text + accuracy score",
        group: "output",
      },
      {
        id: "diarization",
        title: "Speaker Separation",
        description: "Clear speaker attribution",
        group: "output",
      },
      {
        id: "analysis",
        title: "Analysis Engine",
        description: "Decision, action, risk extraction",
        group: "output",
      },
      {
        id: "jira",
        title: "Jira",
        description: "Automatic ticket creation",
        group: "integration",
      },
      {
        id: "trello",
        title: "Trello",
        description: "Cards and assignments",
        group: "integration",
      },
      {
        id: "azure",
        title: "Azure DevOps",
        description: "Work item creation",
        group: "integration",
      },
      {
        id: "dashboard",
        title: "Dashboard",
        description: "Reports and insights",
        group: "integration",
      },
    ],
  },
  features: {
    label: "Capabilities",
    title: "Smart features beyond simple recording",
    subtitle:
      "Full capability set from meeting management to enterprise memory.",
    selectHint: "Select a capability to explore details",
    highlightsLabel: "Highlights",
    prevLabel: "Previous",
    nextLabel: "Next",
    categoryLabels: {
      meeting: "Meeting",
      transcription: "Transcript",
      assistant: "Assistant",
      analytics: "Analytics",
    },
    demoLabels: {
      bot: "Bot",
      question: "Question",
      answer: "Answer",
    },
    demos: {
      "smart-meeting": {
        events: [
          { time: "09:00", title: "Sprint Planning" },
          { time: "11:30", title: "Product Review", hasBot: true },
          { time: "14:00", title: "1:1 Sync" },
        ],
      },
      "auto-join": {
        buttonLabel: "Start Bot",
        statusLabel: "Joining meeting…",
      },
      diarization: {
        speakers: [
          { name: "Sarah", text: "Let's clarify sprint goals." },
          { name: "Mike", text: "Backend is ready to ship." },
          { name: "Emma", text: "UI revision lands by Friday." },
        ],
      },
      "segment-audio": {
        lines: [
          "Meeting starts at two PM.",
          "Let's push action items to Jira.",
          "Review capacity for next sprint.",
        ],
      },
      accuracy: {
        auditLog: [
          { user: "Sarah K.", action: "Edit", time: "14:32" },
          { user: "System", action: "Auto", time: "14:28" },
        ],
      },
      "voice-assistant": {
        question: "What was the deployment decision last sprint?",
        answer: "Friday deploy agreed, Mike is owner.",
      },
      chatbot: {
        messages: [
          { role: "user", text: "What risks were discussed in the last product review?" },
          { role: "bot", text: "3 risks found: API latency, capacity, integration." },
        ],
      },
      templates: {
        templates: ["Sprint", "Sales", "Interview", "1:1"],
        templateSections: ["Decisions", "Actions", "Risks"],
      },
      insights: {
        weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    },
    items: [
      {
        id: "smart-meeting",
        title: "Smart meeting management",
        description:
          "Reads your calendar and joins by rule; never miss a meeting.",
        longDescription:
          "Google Calendar and Microsoft Outlook integration automatically detects scheduled meetings. Rule engine lets you decide which calls the bot joins.",
        highlights: [
          "Automatic detection via calendar sync",
          "Rule-based attendance policies",
          "Teams, Zoom, and Google Meet support",
        ],
        category: "meeting",
      },
      {
        id: "auto-join",
        title: "Attendance without you",
        description:
          "One-click bot control; record even when you're not present.",
        longDescription:
          "Trigger the bot manually or via automatic rules. Customize attendance behavior to make recording fully autonomous.",
        highlights: [
          "One-click manual bot trigger",
          "Attendance style and visibility settings",
          "Ready-waiting before meeting starts",
        ],
        category: "meeting",
      },
      {
        id: "diarization",
        title: "Speaker-based separation",
        description:
          "Speaker diarization clearly identifies who said what.",
        longDescription:
          "AI automatically identifies each speaker and labels them in the transcript. Even in crowded meetings, every sentence has a clear owner.",
        highlights: [
          "Automatic speaker recognition",
          "Multi-participant support",
          "Speaker color coding",
        ],
        category: "transcription",
      },
      {
        id: "segment-audio",
        title: "Segment-based audio playback",
        description:
          "Click on transcript lines to instantly play the related audio.",
        longDescription:
          "Every transcript line links to its audio segment. Verify any statement with one click by playing that exact moment.",
        highlights: [
          "Line-level audio playback",
          "Timestamp synchronization",
          "Fast verification workflow",
        ],
        category: "transcription",
      },
      {
        id: "accuracy",
        title: "Accuracy score & full audit trail",
        description:
          "Reliability scoring with complete edit history tracking.",
        longDescription:
          "AI transcript provides a confidence score. Every edit is logged for enterprise audit and compliance with full traceability.",
        highlights: [
          "Confidence score indicator",
          "Edit history and owner tracking",
          "Audit-compliant record keeping",
        ],
        category: "transcription",
      },
      {
        id: "voice-assistant",
        title: "Voice assistant",
        description:
          "Ask questions during meetings; searches history and live transcript.",
        longDescription:
          "Use voice commands during meetings to instantly access past decisions, action items, or specific topics. Assistant scans live transcript and enterprise memory.",
        highlights: [
          "Voice queries during live meetings",
          "History and transcript search",
          "Instant document sharing",
        ],
        category: "assistant",
      },
      {
        id: "chatbot",
        title: "MeetSense Chatbot",
        description:
          "Query your data in natural language; per meeting or channel.",
        longDescription:
          "Ask questions in natural language across all transcripts and analyses before or after meetings. Search a single meeting or entire channel history.",
        highlights: [
          "Natural language queries",
          "Meeting or channel scope",
          "Source-cited answers",
        ],
        category: "assistant",
      },
      {
        id: "templates",
        title: "Analysis templates",
        description:
          "Ready templates for sprint, sales, interview, or 1:1; create custom criteria.",
        longDescription:
          "Choose ready-made analysis templates by meeting type or define your own criteria. Every output follows the same structure for easy comparison and reporting.",
        highlights: [
          "Sprint, sales, interview templates",
          "Custom criteria definition",
          "Consistent output structure",
        ],
        category: "analytics",
      },
      {
        id: "insights",
        title: "Organizational insights",
        description:
          "Weekly summaries, trend analysis, and risk detection at a glance.",
        longDescription:
          "Weekly summaries, decision trends, and risk signals are extracted at team and org level. See the big picture at a glance on the management dashboard.",
        highlights: [
          "Weekly automatic summaries",
          "Decision and risk trend analysis",
          "Management dashboard view",
        ],
        category: "analytics",
      },
    ],
  },
  useCases: {
    label: "Use Cases",
    title: "Where does it create value?",
    subtitle: "Concrete business value through problem, flow, and result.",
    caseLabels: {
      problem: "Problem",
      flow: "Flow",
      result: "Result",
    },
    items: [
      {
        id: "action-tracking",
        title: "Action tracking & work integration",
        problem:
          "Decisions made in meetings remain verbal; ownership and deadlines are unclear.",
        flow: "AI extracts action, owner, priority, and deadline from transcript, converts to Jira/Trello tickets.",
        result: "Every decision becomes an assigned work item automatically.",
      },
      {
        id: "live-info",
        title: "Information during meetings",
        problem:
          '"What did we decide about this last sprint?" slows down the meeting.',
        flow: "Ask the voice assistant; past data and live transcript are searched, answer shared as document.",
        result: "Instant analysis and history without interrupting the meeting.",
      },
      {
        id: "memory",
        title: "Enterprise memory",
        problem:
          "Meeting knowledge scattered in personal notes; lost when employees leave.",
        flow: "Chatbot uses transcript and AI analysis of every completed meeting as source.",
        result: "Meetings become searchable, permanent enterprise memory.",
      },
      {
        id: "templates",
        title: "Standardized analysis with templates",
        problem:
          "Each meeting summarized differently; outputs not comparable.",
        flow: "Meeting-type template selected; AI produces analysis with consistent structure.",
        result: "All meeting outputs become standard, comparable, and complete.",
      },
      {
        id: "visibility",
        title: "Executive visibility",
        problem:
          "Big picture of many meetings — decisions, delays, trends — remains invisible.",
        flow: "Dashboard shows meeting, decision, and action counts; risk analysis flags overdue actions.",
        result: "Team productivity monitored at a glance; risks caught early.",
      },
    ],
  },
  videoShowcase: {
    label: "Product Showcase",
    title: "See MeetSense in action",
    subtitle:
      "Product screen recordings and demo videos are shown here.",
    stats: [
      { id: "meetings", value: 10000, suffix: "+", label: "Meetings processed" },
      { id: "hours", value: 50000, suffix: "+", label: "Transcript hours" },
      { id: "actions", value: 25000, suffix: "+", label: "Actions extracted" },
      { id: "integrations", value: 15, suffix: "+", label: "Integrations" },
    ],
  },
  value: {
    label: "Business Value",
    title: "Value MeetSense brings to your organization",
    subtitle: "Measurable impact from operational efficiency to enterprise memory.",
    items: [
      {
        id: "time",
        title: "Time Savings",
        description: "Note-taking and report writing time eliminated.",
      },
      {
        id: "security",
        title: "Secure Content",
        description: "Sensitive content reaches only authorized people.",
      },
      {
        id: "tracking",
        title: "Action Tracking",
        description: "Every decision recorded, assigned, and tracked.",
      },
      {
        id: "analysis",
        title: "Deep Analysis",
        description: "Risks and open topics detected automatically.",
      },
      {
        id: "nlp",
        title: "Natural Language Query",
        description: "Ask instead of read; get instant answers.",
      },
      {
        id: "trends",
        title: "Trend & Pattern",
        description: "Capture trends from multi-meeting data.",
      },
    ],
  },
  cta: {
    label: "Contact",
    title: "See your workflow in MeetSense",
    subtitle:
      "In a 30-minute demo, let's automate your meetings live with MeetSense.",
    primary: "Schedule a demo",
    secondary: "Contact sales",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    companyLabel: "Company",
    companyPlaceholder: "Company name",
    submit: "Submit request",
    successMessage: "Request received — we'll get back to you shortly.",
    footerNote: "Your data is handled securely. GDPR-compliant infrastructure.",
  },
  ui: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
  },
  footer: {
    brand: "MeetSense",
    tagline: "BGTS AI product family",
    rights: "All rights reserved.",
  },
};
