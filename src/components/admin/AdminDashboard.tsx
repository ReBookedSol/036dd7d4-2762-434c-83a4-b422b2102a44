import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Download, Brain, CreditCard, TrendingUp } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPapers: 0,
    totalDownloads: 0,
    totalAIUsage: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get total papers
        const { count: papersCount } = await supabase
          .from("papers")
          .select("*", { count: "exact", head: true });

        // Get total downloads
        const { count: downloadsCount } = await supabase
          .from("downloads")
          .select("*", { count: "exact", head: true });

        // Get AI usage count
        const { count: aiUsageCount } = await supabase
          .from("ai_usage")
          .select("*", { count: "exact", head: true });

        // Get active subscriptions
        const { count: activeSubsCount } = await supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        // Calculate total revenue
        const { data: revenueData } = await supabase
          .from("subscriptions")
          .select("amount")
          .eq("status", "active");

        const totalRevenue = revenueData?.reduce((sum, sub) => sum + Number(sub.amount), 0) || 0;

        setStats({
          totalUsers: usersCount || 0,
          totalPapers: papersCount || 0,
          totalDownloads: downloadsCount || 0,
          totalAIUsage: aiUsageCount || 0,
          activeSubscriptions: activeSubsCount || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      color: "text-blue-600",
    },
    {
      title: "Total Papers",
      value: stats.totalPapers,
      icon: FileText,
      description: "Uploaded papers",
      color: "text-green-600",
    },
    {
      title: "Downloads",
      value: stats.totalDownloads,
      icon: Download,
      description: "Total downloads",
      color: "text-purple-600",
    },
    {
      title: "AI Usage",
      value: stats.totalAIUsage,
      icon: Brain,
      description: "AI queries made",
      color: "text-orange-600",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: CreditCard,
      description: "Paying users",
      color: "text-pink-600",
    },
    {
      title: "Monthly Revenue",
      value: `R${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      description: "Current MRR",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">New User</Badge>
                <span className="text-sm">5 new users registered today</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Upload</Badge>
                <span className="text-sm">12 papers uploaded this week</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">AI Usage</Badge>
                <span className="text-sm">45 AI queries made today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use the tabs above to manage users, papers, view analytics, and handle reports.
              </p>
              <p className="text-sm text-muted-foreground">
                Monitor AI usage and subscription revenue in real-time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};