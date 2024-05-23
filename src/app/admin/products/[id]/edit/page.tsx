import PageHeader from "@/app/admin/_components/PageHeader";
import { ProductForm } from "@/app/admin/_components/ProductForm";
import db from "@/db/db";
import React from "react";

export default async function ProductEditPage({
  params: { id },
}: {
  params: { id: string };
}) {

    const product = await db.product.findUnique({
      where: {
        id,
      },
    })


  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
