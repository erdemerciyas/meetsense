# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: decision makers at companies that run on Microsoft 365 and Teams. That means team leads, project and product managers, HR and hiring managers, and sales managers who evaluate a tool for their team and request a demo. Their job is to stop losing what gets decided in meetings: who owns what, by when, and what is at risk.
Secondary: IT and security reviewers who sign off on anything that joins company meetings and touches company data.

## Product Purpose
MeetSense joins Microsoft Teams meetings as a participant, transcribes the conversation with speaker names, and when the meeting ends produces a single meeting page: summary, decisions, action items with owner and due date, and risks. Success for the visitor: they understand within seconds what the product produces and request a 30-minute demo.

## Positioning
- The unit is **one page per meeting**. Someone who missed the meeting learns in minutes what was said, decided, and owned.
- Analysis follows **meeting-type templates**: Standard, Customer Management (sales), Interview, Daily Standup, plus custom templates. If a conversation does not fit the template, MeetSense says so instead of forcing an analysis.
- It runs on the company's own Microsoft infrastructure (Microsoft sign-in, calendar via Graph or EWS).

## Operating Context
- The bot is sent from the calendar to one meeting or to every meeting in a series. It joins like any other participant. If nobody admits it from the lobby, it records nothing. Recording can be paused or stopped at any time.
- Meeting language is Turkish, English, or auto-detected. The interface and report language are set separately.
- Output is shared by link or downloaded as PDF. Visibility per meeting is open to participants, private, or limited to chosen people. Meetings can be grouped into project or team channels.
- **AI Assistant:** answers questions over one meeting, a series, or all meetings, and lists the sources (transcript timestamps, decisions) under each answer.
- **Weekly insights report:** generated every Sunday. It shows meeting count, time, decisions, actions, and unowned actions against the previous week, plus risks, patterns, and improvement notes linked to their meetings.

## Capabilities and Constraints
- **Meeting page:** summary, highlights, decisions, actions (owner and due date; actions without an owner are flagged), risks, and the transcript with timestamps.
- **Interview template:** a candidate card with criterion scores, strengths, development areas, and warning signals. The AI recommends accept, reject, or hold with reasons; the panel makes the final call. Technical and HR interviews are told apart. Questions are grouped by type, and unanswered or avoided questions are flagged. Salary expectation is reported only as fit with the budget, never as a number. The report exports to PDF.
- **Customer Management template:** BANT analysis, an objection map with suggested answers, a 0–100 deal score (BANT clarity, objection pressure, engagement signals, momentum), and company info. Each section copies to CRM in one click.
- **Daily Standup template:** yesterday, today, and blockers per person.
- **Platform:** Microsoft Teams only. Do not claim Zoom, Google Meet, Jira, Trello, or Azure DevOps. An older site claimed these; they are not confirmed.
- **Site stack:** Next.js 16 static export, Tailwind v4. TR (default) and EN at /tr/ and /en/.
- **Demo form:** a contact form for now; the submission target is undecided (mailto fallback: hello@bgts.ai).
- **"Sign in" link:** not in scope for now.

## Brand Commitments
- Name: MeetSense. The mark is binding: a waveform/flame glyph with an ember gradient (sand #DABBA3 → orange #EF6406 → red #C60F01 → deep #620301 → near-black #060505) and two yellow sparks (#FFC700), used with the "MeetSense" wordmark. File: `public/brand/meetsense-mark.svg`.
- Voice (from the current product copy): plain, concrete, calm. Short declarative sentences about what happens, e.g. "Toplantı bitti. Kararlar, aksiyonlar ve özet hazır." No hype.
- A single visual theme; no dark/light toggle.

## Evidence on Hand
- Product copy and demonstration content (the "Kasım sürümü planlama" meeting, the Can Öztürk interview, the fleet-tracking sales call, the assistant Q&A, the weekly report for 21–27 Sept 2026) are in `.impeccable/reference/text.txt`, with screenshots in `.impeccable/reference/`. All of this is synthetic demo data and must read as an example.
- Videos from the old site (`meetsense-app/public/videos`, GitHub LFS) are available but not required.
- **Absent, never fabricate:** customers, logos, testimonials, usage metrics, benchmarks, pricing, certifications. The product is new and has no customers yet. GDPR compliance is unconfirmed, so don't state it.

## Product Principles
1. Show the output, not the AI. The meeting page is the proof.
2. Respect people in the meeting: nothing is recorded without being admitted, the bot is visible, and the humans make the final call.
3. Honest analysis: say when a template does not fit; never invent certainty.
4. Fit into Microsoft 365 as it already is; no new habits.

## Accessibility & Inclusion
WCAG 2.1 AA: text contrast ≥4.5:1, visible focus, reduced-motion support, and full keyboard use of the tabs and demo form. The content must work fully in both Turkish and English (Turkish casing: İ/ı).
