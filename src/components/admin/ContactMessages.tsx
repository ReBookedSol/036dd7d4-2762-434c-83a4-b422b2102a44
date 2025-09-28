import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Mail, Check, Loader2 } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  responded: boolean;
  created_at: string;
}

export const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    setUpdating(messageId);
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", messageId);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));

      toast({
        title: "Success",
        description: "Message marked as read",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const markAsResponded = async (messageId: string) => {
    setUpdating(messageId);
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ responded: true, read: true })
        .eq("id", messageId);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, responded: true, read: true } : msg
      ));

      toast({
        title: "Success",
        description: "Message marked as responded",
      });
    } catch (error) {
      console.error("Error marking message as responded:", error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (message: ContactMessage) => {
    if (message.responded) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Responded</Badge>;
    }
    if (message.read) {
      return <Badge variant="secondary">Read</Badge>;
    }
    return <Badge variant="destructive">New</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const unreadCount = messages.filter(msg => !msg.read).length;
  const unrespondedCount = messages.filter(msg => !msg.responded).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact Messages
        </CardTitle>
        <CardDescription>
          Manage customer inquiries and support requests
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
          {unrespondedCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unrespondedCount} pending response
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className={!message.read ? "bg-muted/50" : ""}>
                <TableCell className="font-medium">{message.name}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${message.email}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {message.email}
                  </a>
                </TableCell>
                <TableCell className="font-medium">{message.subject}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={message.message}>
                    {message.message}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(message)}
                </TableCell>
                <TableCell>
                  {new Date(message.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {!message.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(message.id)}
                        disabled={updating === message.id}
                      >
                        Mark Read
                      </Button>
                    )}
                    {!message.responded && (
                      <Button
                        size="sm"
                        onClick={() => markAsResponded(message.id)}
                        disabled={updating === message.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};