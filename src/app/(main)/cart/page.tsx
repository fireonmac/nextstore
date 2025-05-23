import { getMyCart } from "@/lib/queries"
import CartTable from "./CartTable";

export const metadata = {
  title: 'Shopping Cart'
}

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <CartTable items={cart?.items} itemsPrice={cart?.itemsPrice} />
  )
}
export default CartPage