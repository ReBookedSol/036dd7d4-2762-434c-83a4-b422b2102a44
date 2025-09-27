import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Download, Brain, CreditCard } from "lucide-react";

export const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    dailyUsers: 0,
    dailyDownloads: 0,
    dailyAIUsage: 0,
    topSubjects: [],
    recentActivity: [],
    aiTokensUsed: 0,
    aiCost: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Daily users (new signups today)
      const { count: dailyUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      // Daily downloads
      const { count: dailyDownloads } = await supabase
        .from("downloads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      // Daily AI usage
      const { count: dailyAIUsage } = await supabase
        .from("ai_usage")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      // AI tokens and cost
      const { data: aiData } = await supabase
        .from("ai_usage")
        .select("tokens_used, cost");

      const totalTokens = aiData?.reduce((sum, item) => sum + item.tokens_used, 0) || 0;
      const totalCost = aiData?.reduce((sum, item) => sum + Number(item.cost), 0) || 0;

      // Top subjects (most papers)
      const { data: subjectData } = await supabase
        .from("papers")
        .select(`
          subjects:subject_id (name),
          subject_id
        `)
        .eq("approved", true);

      const subjectCounts = subjectData?.reduce((acc: any, paper) => {
        const subjectName = paper.subjects?.name || "Unknown";
        acc[subjectName] = (acc[subjectName] || 0) + 1;
        return acc;
      }, {});

      const topSubjects = Object.entries(subjectCounts || {})
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setAnalytics({
        dailyUsers: dailyUsers || 0,
        dailyDownloads: dailyDownloads || 0,
        dailyAIUsage: dailyAIUsage || 0,
        topSubjects,
        recentActivity: [],
        aiTokensUsed: totalTokens,
        aiCost: totalCost,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.dailyUsers}</div>
            <p className="text-xs text-muted-foreground">New registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads Today</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.dailyDownloads}</div>
            <p className="text-xs text-muted-foreground">Papers downloaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage Today</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.dailyAIUsage}</div>
            <p className="text-xs text-muted-foreground">AI queries made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tokens Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.aiTokensUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total tokens consumed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Subjects</CardTitle>
            <CardDescription>Most popular subjects by paper count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topSubjects.map((subject: any, index) => (
                <div key={subject.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subject.count} papers
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Usage Overview</CardTitle>
            <CardDescription>Token consumption and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Tokens Used</span>
                <span className="text-sm">{analytics.aiTokensUsed.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total AI Cost</span>
                <span className="text-sm">R{analytics.aiCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Queries Today</span>
                <span className="text-sm">{analytics.dailyAIUsage}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Monitor AI usage to optimize costs and performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};