import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Download, Brain, CreditCard, TrendingUp } from "lucide-react";
import { UserManagement } from "./UserManagement";
import { PaperManagement } from "./PaperManagement";
import { PracticeTestManagement } from "./PracticeTestManagement";
import { PromoCodeManagement } from "./PromoCodeManagement";
import { NotificationManagement } from "./NotificationManagement";
import { ContactMessages } from "./ContactMessages";
import { Reports } from "./Reports";
import { Analytics } from "./Analytics";
import { BulkUpload } from "./BulkUpload";
import LearningResourceManagement from "./LearningResourceManagement";
import { SubscriptionManagement } from "./SubscriptionManagement";

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
        const { count: subscriptionsCount } = await supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        // Get total revenue
        const { data: revenueData } = await supabase
          .from("subscriptions")
          .select("amount")
          .eq("status", "active");

        const totalRevenue = revenueData?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

        setStats({
          totalUsers: usersCount || 0,
          totalPapers: papersCount || 0,
          totalDownloads: downloadsCount || 0,
          totalAIUsage: aiUsageCount || 0,
          activeSubscriptions: subscriptionsCount || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPapers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAIUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="papers">Papers</TabsTrigger>
          <TabsTrigger value="practice-tests">Tests</TabsTrigger>
          <TabsTrigger value="promo-codes">Promos</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="learning-center">Learning Center</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activity and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">New User</Badge>
                    <span className="text-sm">3 new users registered today</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Papers</Badge>
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
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="papers">
          <PaperManagement />
        </TabsContent>

        <TabsContent value="practice-tests">
          <PracticeTestManagement />
        </TabsContent>

        <TabsContent value="promo-codes">
          <PromoCodeManagement />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationManagement />
        </TabsContent>

        <TabsContent value="contact">
          <ContactMessages />
        </TabsContent>

        <TabsContent value="reports">
          <Reports />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>

        <TabsContent value="bulk-upload">
          <BulkUpload onUploadComplete={() => {}} />
        </TabsContent>

        <TabsContent value="learning-center">
          <LearningResourceManagement />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};