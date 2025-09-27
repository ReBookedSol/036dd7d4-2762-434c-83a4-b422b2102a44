import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  created_at: string;
}

export const NotificationBar = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // For now, we'll use mock notifications
    // In the future, this would fetch from a notifications table
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "Welcome!",
        message: "Welcome to ReBooked Genius! Start exploring our vast collection of past papers.",
        type: "info",
        created_at: new Date().toISOString()
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const dismissNotification = (id: string) => {
    setDismissed([...dismissed, id]);
  };

  const activeNotifications = notifications.filter(n => !dismissed.includes(n.id));

  if (activeNotifications.length === 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {activeNotifications.map((notification) => (
          <Alert key={notification.id} className="mb-2 bg-background/95 backdrop-blur shadow-lg border">
            <Bell className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong className="block">{notification.title}</strong>
                {notification.message}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="ml-4 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};