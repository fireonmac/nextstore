import { auth } from '@/auth';
import { getMyCart, getUserById } from '@/lib/queries';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './ShippingAddressForm';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User ID not found');
  }

  const user = await getUserById(userId);

  return (
    <>
      <ShippingAddressForm address={user.address} />
    </>
  );
};

export default ShippingAddressPage;
