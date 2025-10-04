import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Briefcase,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const careerScore = 75;
  const skillsCompleted = 12;
  const skillsTotal = 20;
  const applicationsCount = 8;

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
          {/* Recommendations */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                Recommended Actions
              </h2>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {recommendations.map((rec, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {rec.icon}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {rec.description}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">
                            {rec.progress}%
                          </span>
                        </div>
                        <Progress value={rec.progress} className="h-2" />
                      </div>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="mr-2 w-4 h-4" />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 w-4 h-4" />
                  Explore Courses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 w-4 h-4" />
                  Set New Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
