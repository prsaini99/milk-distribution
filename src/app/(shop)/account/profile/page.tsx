import { getCurrentUser } from "@/server/services/auth.service";
import { ProfileForm } from "@/components/account/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AccountProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Account settings
        </p>
        <h1 className="mt-1 text-3xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your details and delivery address.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
