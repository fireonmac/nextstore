import sampleData from "@/lib/data/sample-data";
import ProductList from "@/lib/components/feature/product/product-list";

const HomePage = async () => {
  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList
        title="Newest Arrivals"
        data={sampleData.products}
        limit={4}
      />
    </div>
  );
};

export default HomePage;
