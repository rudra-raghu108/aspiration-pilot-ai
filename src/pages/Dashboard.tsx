import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Briefcase,
  BookOpen,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { CareerDashboardTabs } from "@/components/dashboard/CareerDashboardTabs";

import { ProfileEdit } from "@/components/profile/ProfileEdit";
import { ResumeUpload } from "@/components/profile/ResumeUpload";
import { analyzeCareerPath } from "@/lib/ai-services";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [careerScore, setCareerScore] = useState(75);
  const [skillsCompleted, setSkillsCompleted] = useState(12);
  const [skillsTotal, setSkillsTotal] = useState(20);
  const [applicationsCount, setApplicationsCount] = useState(8);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          // Get AI analysis
          const analysis = await analyzeCareerPath(profile);
          // Update UI with real data
          // TODO: Update stats based on analysis
        }
      }
    };

    loadUserData();
  }, []);

  const recommendations = [
    {
      title: "Complete Python Certification",
      description: "Boost your data science profile",
      progress: 60,
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "Apply to Senior Developer Roles",
      description: "Based on your experience",
      progress: 30,
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      title: "Update Your LinkedIn Profile",
      description: "Increase visibility by 40%",
      progress: 0,
      icon: <Target className="w-5 h-5" />,
    },
  ];

  const insights = [
    {
      title: "Your Career Match Score",
      value: `${careerScore}%`,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Skills Completed",
      value: `${skillsCompleted}/${skillsTotal}`,
      change: "+3 this month",
      trend: "up",
    },
    {
      title: "Active Applications",
      value: applicationsCount.toString(),
      change: "2 responses",
      trend: "up",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, Alex!
          </h1>
          <p className="text-muted-foreground">
            Here's your personalized career guidance for today
          </p>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {insight.value}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span>{insight.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Career Dashboard Tabs */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <CareerDashboardTabs />
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Career Path Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Career Path Progress</CardTitle>
                <CardDescription>Your journey to Software Architect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-foreground">Junior Developer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-foreground">Mid-Level Developer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/10" />
                    <span className="text-sm font-medium text-foreground">
                      Senior Developer
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                    <span className="text-sm text-muted-foreground">
                      Lead Developer
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border" />
                    <span className="text-sm text-muted-foreground">
                      Software Architect
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowProfileEdit(true)}
                >
                  <Briefcase className="mr-2 w-4 h-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowResumeUpload(true)}
                >
                  <BookOpen className="mr-2 w-4 h-4" />
                  Upload Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 w-4 h-4" />
                  View AI Analysis
                </Button>
              </CardContent>
            </Card>

            {/* Profile Edit Dialog */}
            {showProfileEdit && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                  <ProfileEdit />
                  <Button variant="outline" onClick={() => setShowProfileEdit(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}

            {/* Resume Upload Dialog */}
            {showResumeUpload && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
                <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
                  <ResumeUpload />
                  <Button variant="outline" onClick={() => setShowResumeUpload(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
