import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Send, Eye, Trash2, MessageSquare, Users, Calendar } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target_users: string[] | null;
  active: boolean;
  expires_at: string | null;
  created_by: string;
  created_at: string;
}

export const NotificationManagement = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    target_users: 'all',
    expires_at: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications((data || []).map(item => ({
        ...item,
        type: (item.type as 'info' | 'warning' | 'success' | 'error') || 'info'
      })));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    }
  };

  const handleCreateNotification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const notificationData = {
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        target_users: newNotification.target_users === 'all' ? ['all'] : [newNotification.target_users],
        expires_at: newNotification.expires_at || null,
        created_by: user.id,
        active: true
      };

      const { error } = await supabase
        .from('notifications')
        .insert([notificationData]);

      if (error) throw error;

      toast({
        title: "Notification sent",
        description: "Notification has been broadcast successfully.",
      });

      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        target_users: 'all',
        expires_at: ''
      });
      setIsCreateDialogOpen(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentActive ? "Notification deactivated" : "Notification activated",
        description: "Notification status updated successfully.",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Notification deleted",
        description: "Notification has been deleted successfully.",
      });

      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTargetUsersDisplay = (targetUsers: string[] | null) => {
    if (!targetUsers || targetUsers.includes('all')) return 'All Users';
    return targetUsers.join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Management</h2>
          <p className="text-muted-foreground">Broadcast messages to users across the platform</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send New Notification</DialogTitle>
              <DialogDescription>
                Broadcast a message to users. This will appear in the notification bar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Notification message"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newNotification.type} onValueChange={(value) => setNewNotification({ ...newNotification, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target Users</Label>
                  <Select value={newNotification.target_users} onValueChange={(value) => setNewNotification({ ...newNotification, target_users: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="premium">Premium Users</SelectItem>
                      <SelectItem value="free">Free Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires">Expires At (Optional)</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={newNotification.expires_at}
                  onChange={(e) => setNewNotification({ ...newNotification, expires_at: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateNotification}>
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notifications</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.filter(n => n.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => {
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                return new Date(n.created_at) > dayAgo;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Manage broadcast notifications and their delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {notification.message}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(notification.type)}>
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{getTargetUsersDisplay(notification.target_users)}</TableCell>
                  <TableCell>
                    <Badge variant={notification.active ? "default" : "secondary"}>
                      {notification.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {notification.expires_at 
                      ? new Date(notification.expires_at).toLocaleDateString()
                      : "Never"
                    }
                  </TableCell>
                  <TableCell>
                    {new Date(notification.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(notification.id, notification.active)}
                      >
                        {notification.active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};