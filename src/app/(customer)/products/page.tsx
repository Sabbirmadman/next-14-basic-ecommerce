import { ProductCardSkeleton } from "@/components/ProductCard";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Suspense
        fallback={
            <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </>
        }
    >
        <ProductsSuspense productsFetcher={fetchProduct} />
    </Suspense>
</div>
  )
}
