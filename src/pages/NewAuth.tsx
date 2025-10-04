import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Debug helper
  const logDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => `${prev}\n${message}`);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo("");

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      logDebug("Attempting login...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        logDebug("Login successful, creating/updating profile...");

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (profileError) {
          logDebug(`Profile error: ${profileError.message}`);
          // Don't throw, just log
          console.error('Profile error:', profileError);
        }

        toast({
          title: "Success!",
          description: "You've been logged in.",
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      logDebug(`Login error: ${error.message}`);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo("");

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      logDebug("Starting signup process...");

      // First, check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .single();

      if (existingUser) {
        logDebug("User already exists, attempting login...");
        // User exists, try to log in
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;

        toast({
          title: "Welcome back!",
          description: "Logged in with existing account.",
        });
        
        navigate("/dashboard");
        return;
      }

      logDebug("Creating new account...");

      // Create new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      if (error) throw error;

      if (data.user) {
        logDebug("Account created, setting up profile...");

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email: email,
            full_name: name,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          logDebug(`Profile creation error: ${profileError.message}`);
          console.error('Profile creation error:', profileError);
        }

        toast({
          title: "Account Created!",
          description: "Welcome to CareerPath AI!",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      logDebug(`Signup error: ${error.message}`);
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again with different credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">CareerPath AI</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
          <p className="text-muted-foreground">Start your journey to career clarity</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Please wait..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Debug Information */}
            {debugInfo && (
              <div className="mt-4 p-2 bg-muted rounded text-xs font-mono whitespace-pre-wrap">
                {debugInfo}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewAuth;