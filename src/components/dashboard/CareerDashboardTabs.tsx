import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareerProgress } from "@/components/profile/CareerProgress";
import { CareerPreferences } from "@/components/profile/CareerPreferences";
import { SkillRecommendations } from "@/components/profile/SkillRecommendations";
import { ProfileSettingsTab } from "@/components/profile/ProfileSettingsTab";
import { SavedOpportunities } from "@/components/profile/SavedOpportunities";
import { ResumeUpload } from "@/components/profile/ResumeUpload";

export function CareerDashboardTabs() {
  return (
    <Tabs defaultValue="progress" className="w-full">
      <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-6">
        <TabsTrigger value="progress">Career Progress</TabsTrigger>
        <TabsTrigger value="preferences">Goals & Preferences</TabsTrigger>
        <TabsTrigger value="recommendations">Skill Recommendations</TabsTrigger>
        <TabsTrigger value="settings">Profile Settings</TabsTrigger>
        <TabsTrigger value="saved">Saved Items</TabsTrigger>
        <TabsTrigger value="resume">Resume Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="progress" className="mt-4">
        <CareerProgress />
      </TabsContent>
      <TabsContent value="preferences" className="mt-4">
        <CareerPreferences />
      </TabsContent>
      <TabsContent value="recommendations" className="mt-4">
        <SkillRecommendations />
      </TabsContent>
      <TabsContent value="settings" className="mt-4">
        <ProfileSettingsTab />
      </TabsContent>
      <TabsContent value="saved" className="mt-4">
        <SavedOpportunities />
      </TabsContent>
      <TabsContent value="resume" className="mt-4">
        <ResumeUpload />
      </TabsContent>
    </Tabs>
  );
}
