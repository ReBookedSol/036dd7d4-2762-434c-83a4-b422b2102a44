import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/ui/navbar";
import { useNavigate } from "react-router-dom";
import { Users, FileText, BarChart3, MessageSquare, Flag, Gift, CreditCard, Download, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { PaperManagement } from "@/components/admin/PaperManagement";
import { Analytics } from "@/components/admin/Analytics";
import { ContactMessages } from "@/components/admin/ContactMessages";
import { Reports } from "@/components/admin/Reports";
import { PromoCodeManagement } from "@/components/admin/PromoCodeManagement";
import { SubscriptionManagement } from "@/components/admin/SubscriptionManagement";
import { PracticeTestManagement } from "@/components/admin/PracticeTestManagement";
import { NotificationManagement } from "@/components/admin/NotificationManagement";

const Admin = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
        return;
      }
      
      if (!isAdmin) {
        navigate("/");
        return;
      }
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!loading && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform from here</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs">
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 text-xs">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="papers" className="flex items-center gap-1 text-xs">
              <FileText className="h-3 w-3" />
              <span className="hidden sm:inline">Papers</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-1 text-xs">
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs">
              <Bell className="h-3 w-3" />
              <span className="hidden sm:inline">Notify</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs">
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-1 text-xs">
              <CreditCard className="h-3 w-3" />
              <span className="hidden sm:inline">Subs</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-1 text-xs">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 text-xs">
              <Flag className="h-3 w-3" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="promos" className="flex items-center gap-1 text-xs">
              <Gift className="h-3 w-3" />
              <span className="hidden sm:inline">Promos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="papers">
            <PaperManagement />
          </TabsContent>

          <TabsContent value="tests">
            <PracticeTestManagement />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>

          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="promos">
            <PromoCodeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;