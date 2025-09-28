import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BASE_PRICE = 59.99; // ZAR
const NBT_PRICE = 200; // ZAR per month
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

  const totalPremium = BASE_PRICE * (1 + VAT_RATE);
  const totalCombined = (BASE_PRICE + NBT_PRICE) * (1 + VAT_RATE);

  const handlePay = async (includeNBT = false) => {
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
      const amountZAR = includeNBT ? (BASE_PRICE + NBT_PRICE) * (1 + VAT_RATE) : BASE_PRICE * (1 + VAT_RATE);
      const amountKobo = Math.round(amountZAR * 100);
      const w: any = window;
      const handler = w.PaystackPop.setup({
        key,
        email: session.user.email,
        amount: amountKobo,
        currency: 'ZAR',
        callback: async (response: any) => {
          try {
            // Frontend demo: mark user as premium in profiles table
            await supabase.from('profiles').update({ role: 'premium' }).eq('user_id', session.user.id);
            toast({ title: 'Subscription active', description: 'Thank you! Your subscription is active.' });
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="text-lg text-text-muted">Choose the plan that suits you. Prices shown in ZAR (R).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center">Free</CardTitle>
              <CardDescription className="text-center">Access basic papers and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
                <li>Browse public past papers</li>
                <li>Preview and download free resources</li>
                <li>Save favorites</li>
              </ul>
              <div className="text-center">
                <Button variant="outline">Start for Free</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl text-center">Premium</CardTitle>
              <CardDescription className="text-center">Unlock premium study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-3xl font-bold mb-2">R{formatMoney(BASE_PRICE)}</div>
              <div className="text-center text-sm text-muted-foreground mb-4">VAT included: R{formatMoney(BASE_PRICE * VAT_RATE)}</div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
                <li>All Free features</li>
                <li>Full access to premium papers and memos</li>
                <li>NBT guide access (optional add-on)</li>
              </ul>
              <div className="text-center">
                <Button onClick={() => handlePay(false)}>GetPremium</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center">NBT Add-on</CardTitle>
              <CardDescription className="text-center">Focused NBT preparation materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-3xl font-bold mb-2">R{formatMoney(NBT_PRICE)}</div>
              <div className="text-center text-sm text-muted-foreground mb-4">per month</div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
                <li>NBT practice sets</li>
                <li>Exam strategies and checklists</li>
                <li>Timed practice papers</li>
              </ul>
              <div className="text-center">
                <Button onClick={() => handlePay(true)}>GetPremium + NBT</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="text-lg font-semibold">Combined (Premium + NBT)</div>
            <div className="text-2xl font-bold mt-2">R{formatMoney((BASE_PRICE + NBT_PRICE))} <span className="text-sm text-muted-foreground">(excl. VAT)</span></div>
            <div className="text-sm text-muted-foreground mt-2">Total incl. VAT: R{formatMoney(totalCombined)}</div>
            <div className="mt-4">
              <Button onClick={() => handlePay(true)}>GetPremium + NBT</Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
