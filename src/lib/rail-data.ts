import type { SiteContent, Ticket } from "@/content/types";
import type { RailTicket } from "@/components/ui/rail3d";
import { personName } from "@/lib/people";

/** Tickets flattened for the 3D scenes' canvas textures: the same rows the HTML ticket shows. */
export function railTickets(c: SiteContent, tickets: Ticket[], fallbackDay: number, at: (t: Ticket) => number = () => 0): RailTicket[] {
  return tickets.map((t) => {
    const owner = personName(t.owner, c.people);
    const unowned = t.kind === "action" && !t.owner;
    return {
      no: t.no,
      kind: t.kind,
      kindLabel: c.ui.kinds[t.kind],
      text: t.text,
      day: t.day ?? fallbackDay,
      at: at(t),
      rows: [
        ...(owner || unowned ? [{ label: t.kind === "action" ? c.ui.owner : c.ui.saidBy, value: owner ?? c.ui.noOwner, alert: unowned }] : []),
        ...(t.due ? [{ label: c.ui.due, value: t.due }] : []),
        { label: c.ui.from, value: t.from },
      ],
    };
  });
}
