import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationBar } from "@/components/NotificationBar";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Subjects from "./pages/Subjects";
import BrowsePapers from "./pages/BrowsePapers";
import Grades from "./pages/Grades";
import GradeSubjects from "./pages/GradeSubjects";
import SubjectPapers from "./pages/SubjectPapers";
import StudyGuides from "./pages/StudyGuides";
import PracticeTests from "./pages/PracticeTests";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <NotificationBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/about" element={<About />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/browse-papers" element={<BrowsePapers />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/grades/:gradeId/subjects" element={<GradeSubjects />} />
          <Route path="/grades/:gradeId/subjects/:subjectId/papers" element={<SubjectPapers />} />
          <Route path="/study-guides" element={<StudyGuides />} />
          <Route path="/practice-tests" element={<PracticeTests />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
