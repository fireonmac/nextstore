import LatestProductList from "./LatestProductList";
import { Suspense } from "react";

const HomePage = async () => {
  return (
    <div className="space-y-8">
      <Suspense>
        <LatestProductList />
      </Suspense>
    </div>
  );
};

export default HomePage;
