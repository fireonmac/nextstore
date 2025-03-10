import ProductList from "@/app/(main)/_components/ProductList";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { getLatestProducts } from "@/lib/data/query";

const LatestProductList = async () => {
  const products = await getLatestProducts(LATEST_PRODUCTS_LIMIT);
  return <ProductList title="Newest Arrivals" data={products} limit={LATEST_PRODUCTS_LIMIT} />;
};

export default LatestProductList;
