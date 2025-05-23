'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/lib/components/ui/table';
import { useToast } from '@/lib/hooks/use-toast';
import { Cart } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/lib/components/ui/button';
import { addItemToCart, removeItemFromCart } from '@/lib/actions';
import { Minus, Plus } from 'lucide-react';

const CartTable = ({ items }: { items?: Cart['items'] }) => {
  // const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!items?.length ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        ></Image>
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId
                            );
                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast({
                                variant: 'destructive',
                                description: res.message,
                              });
                            }
                          })
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default CartTable;
