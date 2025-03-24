'use client';

import { addItemToCart } from '@/lib/actions';
import { Button } from '@/lib/components/ui/button';
import { ToastAction } from '@/lib/components/ui/toast';
import { useToast } from '@/lib/hooks/use-toast';
import { CartItem } from '@/lib/types';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddToCart = ({ item }: { item: CartItem }) => {
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
      description: `${item.name} added to the cart`,
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

  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add to cart
    </Button>
  );
};
export default AddToCart;
