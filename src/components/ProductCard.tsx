import { formatCurrency } from "@/lib/formatters";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type Product = {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    imgPath: string;
};

export default function ProductCard({
    id,
    name,
    priceInCents,
    description,
    imgPath,
}: Product) {
    return (
        <Card className="flex overflow-hidden flex-col" key={id}>
            <div className="relative w-full h-auto aspect-video">
                <Image
                    src={imgPath}
                    alt={name}
                    layout="fill"
                    className="object-cover"
                />
            </div>

            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {formatCurrency(priceInCents)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-3">{description}</p>
            </CardContent>
            <CardFooter>
                <Button
                    variant={"outline"}
                    asChild
                    className="w-full"
                    disabled
                    size="lg"
                >
                    <Link href={`/products/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col animate-pulse">
            <div className="w-full aspect-video bg-gray-300" />
            <CardHeader>
                <CardTitle>
                    <div className="w-3/4 h-6 rounded-full bg-gray-300" />
                </CardTitle>
                <CardDescription>
                    <div className="w-1/2 h-4 rounded-full bg-gray-300" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="w-full h-4 rounded-full bg-gray-300" />
                <div className="w-full h-4 rounded-full bg-gray-300" />
                <div className="w-3/4 h-4 rounded-full bg-gray-300" />
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled size="lg"></Button>
            </CardFooter>
        </Card>
    );
}
