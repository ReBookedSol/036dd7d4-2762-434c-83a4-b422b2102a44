import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert max-w-3xl">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>ReBooked Genius ("we", "us") is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.</p>
        <h2>Information We Collect</h2>
        <ul>
          <li>Account information (name, email)</li>
          <li>Usage data (pages viewed, downloads)</li>
          <li>Device and log data (IP address, browser)</li>
          <li>Messages you send us via the contact form</li>
        </ul>
        <h2>How We Use Information</h2>
        <ul>
          <li>Provide and improve our services</li>
          <li>Personalize content and recommendations</li>
          <li>Communicate with you about updates and support</li>
          <li>Ensure security, prevent abuse, and comply with law</li>
        </ul>
        <h2>Data Sharing</h2>
        <p>We do not sell your data. We may share information with service providers who process data on our behalf and with authorities when legally required.</p>
        <h2>Cookies</h2>
        <p>We use cookies to remember preferences and analyze usage. You can control cookies in your browser settings.</p>
        <h2>Data Retention</h2>
        <p>We retain personal data only as long as necessary for the purposes described above or as required by law.</p>
        <h2>Your Rights</h2>
        <ul>
          <li>Access, correct, or delete your data</li>
          <li>Object to processing or withdraw consent where applicable</li>
          <li>Portability of your data</li>
        </ul>
        <h2>Contact</h2>
        <p>For privacy requests, contact: privacy@rebookedgenius.com</p>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
