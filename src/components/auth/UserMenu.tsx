import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

/** Header account chip: avatar initial (links to account) + logout. */
export function UserMenu({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        title="My account"
        className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/20"
      >
        {initial}
      </Link>
      <LogoutButton className="hidden items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground sm:inline-flex" />
    </div>
  );
}
