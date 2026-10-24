import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

type Common = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconStart?: LucideIcon;
  iconEnd?: LucideIcon;
  children?: ReactNode;
  className?: string;
};

type Props =
  | (Common & {
      href: string;
      /** Full page load (plain <a>) instead of client navigation, e.g. from global-error */
      reload?: boolean;
    } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">)
  | (Common & { href?: undefined; reload?: undefined } & Omit<ComponentProps<"button">, "className" | "children">);

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  iconStart: Start,
  iconEnd: End,
  children,
  className = "",
  reload = false,
  ...rest
}: Props) {
  const cls = `ha-btn ha-btn--${variant} ha-btn--${size}${block ? " ha-btn--block" : ""} ${className}`;
  const is = size === "sm" ? 16 : 18;
  const inner = (
    <>
      {Start && <Start size={is} />}
      {children}
      {End && <End size={is} />}
    </>
  );
  if (rest.href !== undefined && reload) {
    return (
      <a className={cls} href={rest.href}>
        {inner}
      </a>
    );
  }
  if (rest.href !== undefined) {
    return (
      <Link className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  size = "md",
  outline = false,
  className = "",
  ...rest
}: {
  icon: LucideIcon;
  label: string;
  size?: Size;
  outline?: boolean;
} & Omit<ComponentProps<"button">, "children">) {
  const px = { sm: 32, md: 40, lg: 48 }[size];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`ha-iconbtn${outline ? " ha-iconbtn--outline" : ""} ${className}`}
      style={{ width: px, height: px }}
      {...rest}
    >
      <Icon size={size === "sm" ? 16 : 20} />
    </button>
  );
}
