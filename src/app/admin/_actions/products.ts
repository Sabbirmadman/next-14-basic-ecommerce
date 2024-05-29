"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, {
  message: "File is required",
});

const imageSchema = fileSchema.refine(
  (file) => file.type.startsWith("image/"),
  {
    message: "File must be an image",
  }
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, {
    message: "File is required",
  }),
  image: imageSchema.refine((file) => file.size > 0, {
    message: "Image is required",
  }),
});


const updateSchema = addSchema.extend({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file : fileSchema.optional(),
  image: imageSchema.optional(),
})




async function addProduct(prevState: unknown, formdata: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formdata.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true })
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  )


  const product = await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: filePath,
      imagePath: imagePath,
    },
  });


  redirect("/admin/products")
}


async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = updateSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })

  if (product == null) return notFound()

  let filePath = product.filePath
  if (data.file != null && data.file.size > 0) {
    await fs.unlink(product.filePath)
    filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))
  }

  let imagePath = product.imagePath
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${product.imagePath}`)
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products")
}


async function toggleProductAvailability(productId: string , isAvailableForPurchase : boolean) {
  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      isAvailableForPurchase: isAvailableForPurchase,
    },
  });
}

async function deleteProduct(productId: string) {
  const product = await db.product.delete({
    where: {
      id: productId,
    },
  });

  if(product == null) {
    return notFound()
  }

try {
  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);
} catch (error) {
  console.log(error);
}
  
}

export { addProduct ,toggleProductAvailability ,deleteProduct ,updateProduct  };
