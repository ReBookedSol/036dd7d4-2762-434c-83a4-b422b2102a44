import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, LogOut, BookOpen, BarChart3, Target, Trophy, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        return;
      }

      setProfile(data);
      setFullName(data.full_name || "");
      setGrade(data.grade || "");
      setSchool(data.school || "");
    };

    getProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          grade,
          school,
        })
        .eq("user_id", session.user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Mock data for analytics
  const performanceData = [
    { name: 'Mathematics', score: 85, color: '#3b82f6' },
    { name: 'Physics', score: 78, color: '#10b981' },
    { name: 'Chemistry', score: 82, color: '#f59e0b' },
    { name: 'English', score: 88, color: '#ef4444' },
  ];

  const progressData = [
    { month: 'Jan', tests: 5, score: 75 },
    { month: 'Feb', tests: 8, score: 78 },
    { month: 'Mar', tests: 6, score: 82 },
    { month: 'Apr', tests: 10, score: 85 },
    { month: 'May', tests: 7, score: 88 },
  ];

  const savedPapers = [
    { title: "Mathematics Paper 1 - 2024", subject: "Mathematics", date: "2024-03-15" },
    { title: "Physical Sciences Paper 2 - 2023", subject: "Physics", date: "2024-03-12" },
    { title: "English HL Paper 1 - 2024", subject: "English", date: "2024-03-10" },
  ];

  const recentTests = [
    { title: "Math Practice Test #5", score: 85, total: 100, date: "2024-03-14" },
    { title: "Physics Mock Exam", score: 78, total: 100, date: "2024-03-12" },
    { title: "Chemistry Quiz", score: 92, total: 100, date: "2024-03-10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Track your progress and manage your learning journey</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="saved">Saved Papers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">83%</div>
                  <p className="text-xs text-muted-foreground">+5% improvement</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Papers Downloaded</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Test Results</CardTitle>
                  <CardDescription>Your latest practice test scores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTests.map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{test.title}</p>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                      </div>
                      <Badge variant={test.score >= 80 ? "default" : test.score >= 60 ? "secondary" : "destructive"}>
                        {test.score}/{test.total}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your learning activity this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedPapers.slice(0, 3).map((paper, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-primary bg-primary/10 p-2 rounded" />
                        <div>
                          <p className="font-medium">{paper.title}</p>
                          <p className="text-sm text-muted-foreground">{paper.subject}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{paper.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Your average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={performanceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="score"
                        label={({ name, score }) => `${name}: ${score}%`}
                      >
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Over Time</CardTitle>
                  <CardDescription>Your improvement trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#3b82f6" name="Average Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>AI-powered insights based on your performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Focus on Physics</h4>
                  <p className="text-sm text-yellow-700">Your physics scores show room for improvement. Consider reviewing electromagnetic concepts.</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800">Strong in Mathematics</h4>
                  <p className="text-sm text-blue-700">Excellent progress in algebra and calculus. Keep practicing complex problems.</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800">Consistent Improvement</h4>
                  <p className="text-sm text-green-700">Your overall performance shows steady improvement. Great work!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Papers & Materials</CardTitle>
                <CardDescription>All your bookmarked study resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedPapers.map((paper, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <Badge variant="outline">{paper.subject}</Badge>
                        </div>
                        <CardTitle className="text-base">{paper.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Saved {paper.date}
                          </span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Year</Label>
                    <Input
                      id="grade"
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g., Grade 12, First Year"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="school">School/Institution</Label>
                    <Input
                      id="school"
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Enter your school or institution"
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </form>

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Account Status</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {profile.role} User
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;