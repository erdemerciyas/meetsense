import type { Person } from "@/content/types";

export function personName(id: string | undefined, people: Person[]) {
  if (!id) return undefined;
  return people.find((p) => p.initials === id)?.name ?? id;
}
