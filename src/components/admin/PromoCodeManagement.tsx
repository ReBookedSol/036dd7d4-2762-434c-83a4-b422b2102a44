import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Gift, Plus, Power, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number | null;
  discount_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

export const PromoCodeManagement = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: "",
    description: "",
    discountPercent: "",
    discountAmount: "",
    maxUses: "",
    expiresAt: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch promo codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("promo_codes")
        .insert({
          code: newPromo.code.toUpperCase(),
          description: newPromo.description || null,
          discount_percent: newPromo.discountPercent ? parseInt(newPromo.discountPercent) : null,
          discount_amount: newPromo.discountAmount ? parseFloat(newPromo.discountAmount) : null,
          max_uses: newPromo.maxUses ? parseInt(newPromo.maxUses) : null,
          expires_at: newPromo.expiresAt || null,
          created_by: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Promo code created successfully",
      });

      setNewPromo({
        code: "",
        description: "",
        discountPercent: "",
        discountAmount: "",
        maxUses: "",
        expiresAt: "",
      });
      setIsDialogOpen(false);
      fetchPromoCodes();
    } catch (error: any) {
      console.error("Error creating promo code:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePromoCode = async (promoId: string, active: boolean) => {
    setUpdating(promoId);
    try {
      const { error } = await supabase
        .from("promo_codes")
        .update({ active })
        .eq("id", promoId);

      if (error) throw error;

      setPromoCodes(promoCodes.map(promo => 
        promo.id === promoId ? { ...promo, active } : promo
      ));

      toast({
        title: "Success",
        description: `Promo code ${active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error("Error toggling promo code:", error);
      toast({
        title: "Error",
        description: "Failed to update promo code",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (promo: PromoCode) => {
    if (!promo.active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (promo.max_uses && promo.current_uses >= promo.max_uses) {
      return <Badge variant="destructive">Max Uses Reached</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Promo Code Management
        </CardTitle>
        <CardDescription>
          Create and manage promotional codes for discounts
        </CardDescription>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-fit">
              <Plus className="h-4 w-4 mr-2" />
              Create Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Promo Code</DialogTitle>
              <DialogDescription>
                Create a new promotional code with discount settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({...newPromo, code: e.target.value})}
                  placeholder="e.g., SAVE20"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newPromo.description}
                  onChange={(e) => setNewPromo({...newPromo, description: e.target.value})}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountPercent">Discount %</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    value={newPromo.discountPercent}
                    onChange={(e) => setNewPromo({...newPromo, discountPercent: e.target.value})}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label htmlFor="discountAmount">Discount Amount (R)</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    step="0.01"
                    value={newPromo.discountAmount}
                    onChange={(e) => setNewPromo({...newPromo, discountAmount: e.target.value})}
                    placeholder="50.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="maxUses">Max Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={newPromo.maxUses}
                  onChange={(e) => setNewPromo({...newPromo, maxUses: e.target.value})}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newPromo.expiresAt}
                  onChange={(e) => setNewPromo({...newPromo, expiresAt: e.target.value})}
                />
              </div>
              <Button onClick={createPromoCode} className="w-full">
                Create Promo Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="font-medium font-mono">{promo.code}</TableCell>
                <TableCell>{promo.description || "No description"}</TableCell>
                <TableCell>
                  {promo.discount_percent && `${promo.discount_percent}%`}
                  {promo.discount_amount && `R${promo.discount_amount}`}
                </TableCell>
                <TableCell>
                  {promo.current_uses} / {promo.max_uses || "∞"}
                </TableCell>
                <TableCell>
                  {promo.expires_at 
                    ? new Date(promo.expires_at).toLocaleDateString()
                    : "Never"
                  }
                </TableCell>
                <TableCell>
                  {getStatusBadge(promo)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePromoCode(promo.id, !promo.active)}
                    disabled={updating === promo.id}
                  >
                    <Power className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};