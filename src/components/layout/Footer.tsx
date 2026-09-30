import type { SiteContent } from "@/content/types";
import { Logo } from "@/components/ui/Logo";

export function Footer({ c }: { c: SiteContent }) {
  const other = c.ui.langSwitch;
  return (
    <footer className="border-t border-rule">
      <div className="shell flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <Logo />
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] font-medium text-ink-2">
          {c.nav.links.map((link) => (
            <li key={link.href}>
              <a className="hover:text-ink" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9375rem] text-ink-2">
          <a className="text-link" href="mailto:hello@bgts.ai">
            {c.footer.contact}: hello@bgts.ai
          </a>
          <a className="text-link" href={`/${other.target}/`} hrefLang={other.target} lang={other.target}>
            {other.label}
          </a>
          <span className="text-ink-3">{c.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
