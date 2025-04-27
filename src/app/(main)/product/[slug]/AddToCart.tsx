'use client';

import { addItemToCart, removeItemFromCart } from '@/lib/actions';
import { Button } from '@/lib/components/ui/button';
import { ToastAction } from '@/lib/components/ui/toast';
import { useToast } from '@/lib/hooks/use-toast';
import { CartItem } from '@/lib/types';
import { Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddToCart = ({ countInCart, item }: { countInCart: number; item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    // Execute the addItemToCart action
    const res = await addItemToCart(item);

    // Display appropriate toast message based on the result
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }

    toast({
      description: res.message,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          onClick={() => router.push('/cart')}
          altText="Go to cart"
        >
          Go to cart
        </ToastAction>
      ),
    });
  };

  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    toast({
      description: res.message,
      variant: res.success ? 'default' : 'destructive',
    });
  };
  
  return countInCart ? (
    <div className="flex items-center">
      <Button type="button" variant="outline" size="sm" onClick={handleRemoveFromCart}>
        <Minus className="w-4 h-4" />
      </Button>
      <span className="px-2">{countInCart}</span>
      <Button type="button" variant="outline" size="sm" onClick={handleAddToCart}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add to cart
    </Button>
  );
};
export default AddToCart;
