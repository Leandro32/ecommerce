'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TiptapEditor from './TiptapEditor';
import { ImageUploader } from '@/admin/components/forms/image-uploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProduct } from '@/hooks/queries/useProduct';
import { useUpdateProduct } from '@/hooks/queries/useProductMutations';
import { useRouter } from 'next/navigation';
import { Input, Button, Select, SelectItem, Checkbox } from '@heroui/react';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  brand: z.string().min(1, 'Brand is required'),
  sex: z.enum(['WOMAN', 'MAN', 'UNISEX']),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  discountPrice: z.number().min(0, 'Discount price must be a positive number').optional().nullable(),
  isDiscounted: z.boolean(),
  stock: z.number().min(0, 'Stock must be a positive number'),
  bottleSize: z.number().min(0, 'Bottle size must be a positive number'),
  bottleType: z.string().min(1, 'Bottle type is required'),
  packaging: z.string().min(1, 'Packaging is required'),
  averageRating: z.number().min(0).max(5).optional().nullable(),
  shippingWeight: z.number().min(0, 'Shipping weight must be a positive number').optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  imageUrls: z.array(z.string().url('Invalid URL')),
  fragranceNotes: z.object({
    topNotes: z.string(),
    middleNotes: z.string(),
    baseNotes: z.string(),
  }).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductForm({ productId }: { productId: string }) {
  const router = useRouter();
  const { data: product, isLoading, isError } = useProduct(productId);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset(product as any);
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormValues) => {
    updateProduct(data as any, {
      onSuccess: () => router.push('/admin/products'),
    });
  };

  if (isError) return <div>Failed to load product</div>;
  if (isLoading || !product) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Name"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Slug"
                isInvalid={!!errors.slug}
                errorMessage={errors.slug?.message}
                endContent={
                  <Button
                    isIconOnly
                    onClick={() => {
                      const name = watch('name');
                      const slug = name
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                      setValue('slug', slug);
                    }}
                  >
                    Generate
                  </Button>
                }
              />
            )}
          />
        </div>

        <div className="sm:col-span-6">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <TiptapEditor {...field} />}
          />
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Brand"
                isInvalid={!!errors.brand}
                errorMessage={errors.brand?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Sex" isInvalid={!!errors.sex} errorMessage={errors.sex?.message}>
                <SelectItem key="WOMAN" value="WOMAN">
                  Woman
                </SelectItem>
                <SelectItem key="MAN" value="MAN">
                  Man
                </SelectItem>
                <SelectItem key="UNISEX" value="UNISEX">
                  Unisex
                </SelectItem>
              </Select>
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Price"
                isInvalid={!!errors.price}
                errorMessage={errors.price?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="discountPrice"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Discount Price"
                isInvalid={!!errors.discountPrice}
                errorMessage={errors.discountPrice?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-1">
          <Controller
            name="isDiscounted"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} isSelected={field.value} onValueChange={field.onChange}>
                Is Discounted
              </Checkbox>
            )}
          />
        </div>

        <div className="sm:col-span-1">
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Stock"
                isInvalid={!!errors.stock}
                errorMessage={errors.stock?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="bottleSize"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                label="Bottle Size (ml)"
                isInvalid={!!errors.bottleSize}
                errorMessage={errors.bottleSize?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="bottleType"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Bottle Type"
                isInvalid={!!errors.bottleType}
                errorMessage={errors.bottleType?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="packaging"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Packaging"
                isInvalid={!!errors.packaging}
                errorMessage={errors.packaging?.message}
              />
            )}
          />
        </div>

        <div className="sm:col-span-6">
          <Controller
            name="imageUrls"
            control={control}
            render={({ field }) => <ImageUploader {...field} />}
          />
          {errors.imageUrls && <p className="mt-2 text-sm text-red-600">{errors.imageUrls.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="fragranceNotes.topNotes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Top Notes"
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="fragranceNotes.middleNotes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Middle Notes"
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="fragranceNotes.baseNotes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Base Notes"
              />
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <Controller
            name="seoTitle"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="SEO Title"
              />
            )}
          />
        </div>

        <div className="sm:col-span-3">
          <Controller
            name="seoDescription"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="SEO Description"
              />
            )}
          />
        </div>

      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="bordered"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            className="ml-3"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
