import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareerProgress } from "@/components/profile/CareerProgress";
import { CareerPreferences } from "@/components/profile/CareerPreferences";
import { SkillRecommendations } from "@/components/profile/SkillRecommendations";

export function CareerDashboardTabs() {
  return (
    <Tabs defaultValue="progress" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="progress">Career Progress</TabsTrigger>
        <TabsTrigger value="preferences">Goals & Preferences</TabsTrigger>
        <TabsTrigger value="recommendations">Skill Recommendations</TabsTrigger>
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
    </Tabs>
  );
}