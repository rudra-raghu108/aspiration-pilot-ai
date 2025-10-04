import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface UserSettings {
  theme: string;
  email_notifications: boolean;
}

const themeOptions = [
  { value: "default", label: "Default" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "forest", label: "Forest" },
  { value: "midnight", label: "Midnight" },
];

export function AccountSettingsForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    theme: "default",
    email_notifications: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("theme, email_notifications")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Unable to load settings",
          description: "We couldn't fetch your preferences. Try again later.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setSettings({
          theme: data.theme ?? "default",
          email_notifications: data.email_notifications ?? true,
        });
      }
    };

    loadSettings();
  }, [user, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: "You must be signed in",
        description: "Log in to update your account settings.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      theme: settings.theme,
      email_notifications: settings.email_notifications,
      updated_at: new Date().toISOString(),
    });

    setIsSaving(false);

    if (error) {
      toast({
        title: "Unable to save settings",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Settings updated",
      description: "Your preferences were saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Dashboard Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about job matches and career insights.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, email_notifications: checked }))
              }
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
