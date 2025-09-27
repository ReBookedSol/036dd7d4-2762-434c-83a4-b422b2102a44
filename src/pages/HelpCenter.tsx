import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-10">
          <Badge variant="secondary">Help Center</Badge>
          <h1 className="text-4xl font-bold">How can we help?</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Search our FAQs or browse common topics to get quick answers.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search help articles and FAQs" className="pl-9" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="a1">
                <AccordionTrigger>How do I find past papers?</AccordionTrigger>
                <AccordionContent>Use Browse Papers to filter by subject, grade, year, or type. You can also search directly from the header.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2">
                <AccordionTrigger>Do I need an account?</AccordionTrigger>
                <AccordionContent>You can browse for free. Create an account to save favorites, track downloads, and access premium content.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Downloads & Access</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="b1">
                <AccordionTrigger>Are downloads free?</AccordionTrigger>
                <AccordionContent>Many resources are free. Certain premium or curated guides may require a subscription.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="b2">
                <AccordionTrigger>Where are my downloads?</AccordionTrigger>
                <AccordionContent>Check your browser's downloads folder. You can also find your history in your Profile when logged in.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
