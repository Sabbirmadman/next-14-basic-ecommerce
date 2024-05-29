import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function getNewestProducts() {
    await wait(1000);
    return db.product.findMany({
        where: {
            isAvailableForPurchase: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

async function getPopularProducts() {
    await wait(1000);
    return db.product.findMany({
        where: {
            isAvailableForPurchase: true,
        },
        orderBy: {
            orders: {
                _count: "desc",
            },
        },
    });
}

function wait(duration: number) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export default function HomePage() {
    return (
        <main className="space-y-12">
            <ProductGridSection
                title="Newest Products"
                fetchProduct={getNewestProducts}
            />

            <ProductGridSection
                title="Popular Products"
                fetchProduct={getPopularProducts}
            />
        </main>
    );
}

type ProductGridSectionProps = {
    title: string;
    fetchProduct: () => Promise<Product[]>;
};

function ProductGridSection({ title, fetchProduct }: ProductGridSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button variant={"outline"} asChild>
                    <Link href="/products">
                        <span>View All</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
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
                    <ProductSuspense productsFetcher={fetchProduct} />
                </Suspense>
            </div>
        </div>
    );
}

async function ProductSuspense({
    productsFetcher,
}: {
    productsFetcher: () => Promise<Product[]>;
}) {
    return (await productsFetcher()).map((product) => (
        <ProductCard
            id={product.id}
            name={product.name}
            priceInCents={product.priceInCents}
            description={product.description}
            imgPath={product.imagePath}
            key={product.id}
        />
    ));
}
