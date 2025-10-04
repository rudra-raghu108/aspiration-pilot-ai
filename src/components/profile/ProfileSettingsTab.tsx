import { ProfileEdit } from "./ProfileEdit";
import { AccountSettingsForm } from "./AccountSettingsForm";

export function ProfileSettingsTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ProfileEdit />
      <AccountSettingsForm />
    </div>
  );
}
