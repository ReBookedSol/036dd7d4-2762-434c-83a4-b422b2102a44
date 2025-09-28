import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-10">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </section>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none p-6">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing ReBooked Genius, you agree to be bound by these Terms. If you do not agree, do not use the service.</p>
              <h2>2. Use of Service</h2>
              <ul>
                <li>You must use the service lawfully and respectfully.</li>
                <li>Do not attempt to disrupt or reverse-engineer the platform.</li>
                <li>Content is for personal educational use unless otherwise stated.</li>
              </ul>
              <h2>3. Accounts</h2>
              <p>You are responsible for safeguarding your account and for all activities under it. Provide accurate information.</p>
              <h2>4. Intellectual Property</h2>
              <p>All site design, logos, and original content are owned by ReBooked Genius. Past papers may be subject to third-party rights and are provided for study purposes.</p>
              <h2>5. Payments and Subscriptions</h2>
              <p>Premium features may require payment. Fees, renewals, and cancellation terms will be presented at checkout.</p>
              <h2>6. Disclaimer</h2>
              <p>The service is provided "as is" without warranties. We do not guarantee results, availability, or accuracy of third-party materials.</p>
              <h2>7. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, ReBooked Genius is not liable for any indirect, incidental, or consequential damages.</p>
              <h2>8. Changes</h2>
              <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>
              <h2>9. Contact</h2>
              <p>For questions, contact: legal@rebookedgenius.com</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
