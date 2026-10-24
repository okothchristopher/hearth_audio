import { MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui";
import { CONTACT } from "@/lib/contact";

/** Location and contact, on every renter page. */
export function SiteFooter() {
  return (
    <footer className="ha-footer">
      <div className="ha-footer__inner">
        <Logo variant="symbol-on-light" size={32} withName />
        <section aria-labelledby="contact-heading" className="ha-footer__contact">
          <h2 id="contact-heading" className="ha-footer__heading">
            Get in touch
          </h2>
          <ul className="ha-footer__list">
            <li>
              <MapPin size={18} aria-hidden="true" />
              <span>{CONTACT.area}</span>
            </li>
            <li>
              <Phone size={18} aria-hidden="true" />
              <a href={CONTACT.phoneHref} className="ha-num">
                Call {CONTACT.phone}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
