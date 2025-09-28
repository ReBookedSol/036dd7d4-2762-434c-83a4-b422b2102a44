import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BASE_PRICE = 59.99; // USD or ZAR depending on configured merchant currency
const VAT_RATE = 0.15; // 15%

function formatMoney(n: number) {
  return n.toFixed(2);
}

function loadPaystack() {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('#paystack-inline');
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-inline';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack'));
    document.body.appendChild(script);
  });
}

const Pricing = () => {
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: 'Sign in required', description: 'Please sign in to subscribe.' , variant: 'destructive'});
        return;
      }
      await loadPaystack();
      const key = (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || '';
      if (!key) {
        toast({ title: 'Payment unavailable', description: 'Missing Paystack key.' , variant: 'destructive'});
        return;
      }
      const amountCents = Math.round(BASE_PRICE * (1 + VAT_RATE) * 100);
      const w: any = window;
      const handler = w.PaystackPop.setup({
        key,
        email: session.user.email,
        amount: amountCents,
        currency: 'ZAR',
        callback: async (response: any) => {
          try {
            await supabase.from('profiles').update({ role: 'premium' }).eq('user_id', session.user.id);
            toast({ title: 'Subscription active', description: 'Welcome to ReBooked Genius Premium!' });
            window.location.href = '/profile';
          } catch (e) {
            console.error(e);
          }
        },
        onClose: function(){
          toast({ title: 'Payment cancelled', description: 'You can try again anytime.' });
        }
      });
      handler.openIframe();
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err?.message ?? String(err), variant: 'destructive' });
    }
  };

  const totalWithVat = BASE_PRICE * (1 + VAT_RATE);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="text-lg text-text-muted">Upgrade to ReBooked Genius Premium for full access.</p>
        </div>
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>ReBooked Genius Premium</CardTitle>
            <CardDescription>Unlock premium resources, NBT page and advanced features.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-3xl font-bold">${formatMoney(BASE_PRICE)} <span className="text-sm font-normal text-muted-foreground">excl. VAT</span></div>
              <div className="text-sm text-muted-foreground mt-1">VAT (15%): ${formatMoney(BASE_PRICE * VAT_RATE)}</div>
              <div className="text-xl font-semibold mt-2">Total: ${formatMoney(totalWithVat)}</div>
            </div>
            <Button size="lg" onClick={handleSubscribe}>Subscribe with Paystack</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
