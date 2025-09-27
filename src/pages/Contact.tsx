import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast({ title: "Missing fields", description: "Please fill in all fields." });
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        user_id: user?.id ?? null,
      });
      if (error) throw error;
      toast({ title: "Message sent", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast({ title: "Could not send message", description: err.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll be in touch.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <Textarea rows={6} placeholder="Your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send Message"}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Details</CardTitle>
              <CardDescription>Reach us through the following channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">Email:</span> support@rebookedgenius.com</div>
              <div><span className="font-medium text-foreground">Response time:</span> within 24-48 hours</div>
              <div><span className="font-medium text-foreground">Hours:</span> Mon–Fri, 9am–5pm</div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
