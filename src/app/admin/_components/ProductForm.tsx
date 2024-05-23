"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { addProduct, updateProduct } from "../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";
import { MdAttachFile } from "react-icons/md";

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {});
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  const [imageFile, setImageFile] = useState<File | undefined | string>(
    product?.imagePath
  );

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name}
        />
        {error.name && <div className="text-red-500">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price in Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value) || undefined)}
        />

        <div className="text-muted-forground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>

        {error.priceInCents && (
          <div className="text-red-500">{error.priceInCents}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
        />
        {error.description && (
          <div className="text-red-500">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={!product} />
        {product !== null && (
          <div className="text-muted-forground flex gap-2 items-start">
            <MdAttachFile size={32} className="p-2 bg-gray-200 rounded" />{" "}
            {product?.filePath}
          </div>
        )}
        {error.file && <div className="text-red-500">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          accept="image/*"
          id="image"
          name="image"
          required={!product}
          onChange={(e) => setImageFile(e.target.files?.[0])}
        />
        <Image
          src={
            imageFile instanceof File ? URL.createObjectURL(imageFile) : imageFile?.length ? imageFile : "/placeholderImg.svg" 
          }
          alt="placeholder"
          className="max-w-full object-contain"
          width={400}
          height={250}
        />

        {error.image && <div className="text-red-500">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}
