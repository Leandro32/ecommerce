import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Divider, Spinner, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { addToast } from '@heroui/react';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch product data if in edit mode
  const { data: product, error, isLoading } = useSWR<ProductForm>(
    isEditMode ? `/api/v1/admin/products/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
      });
    }
  }, [isEditMode, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append('image', file);

    setIsUploadingImage(true);
    try {
      const res = await fetch('/api/v1/admin/upload-image', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const { imageUrl: relativeImageUrl } = await res.json();
      // Construct full URL for validation using environment variable
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const fullImageUrl = `${baseUrl}${relativeImageUrl}`;
      setFormData(prev => ({ ...prev, imageUrl: fullImageUrl }));
      addToast({
        title: 'Success',
        description: 'Image uploaded successfully.',
        color: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Error',
        description: err.message || 'An error occurred during image upload.',
        color: 'danger',
      });
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode ? `/api/v1/admin/products/${id}` : '/api/v1/admin/products';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to save product');
      }

      addToast({
        title: 'Success',
        description: `Product ${isEditMode ? 'updated' : 'created'} successfully.`, 
        color: 'success',
      });
      navigate('/admin/products');
    } catch (err: any) {
      addToast({
        title: 'Error',
        description: err.message || 'An error occurred while saving the product.',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading product..." />
      </div>
    );
  }

  if (isEditMode && error) {
    return (
      <div className="flex justify-center items-center h-screen text-danger">
        Error loading product: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Product Details</h2>
          </CardHeader>
          <Divider />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onValueChange={(value) => handleChange({ target: { name: 'name', value } } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="Enter product name"
              required
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={String(formData.price)}
              onValueChange={(value) => handleChange({ target: { name: 'price', value } } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="0.00"
              step="0.01"
              required
            />
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onValueChange={(value) => handleChange({ target: { name: 'description', value } } as React.ChangeEvent<HTMLTextAreaElement>)}
              placeholder="Enter product description"
              className="md:col-span-2"
              required
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={String(formData.stock)}
              onValueChange={(value) => handleChange({ target: { name: 'stock', value } } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="0"
              min="0"
              required
            />
            <div>
              <label className="block text-sm font-medium text-default-700 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-default-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100"
                disabled={isUploadingImage}
              />
              {isUploadingImage && <Spinner size="sm" className="mt-2" />} 
              {formData.imageUrl && !isUploadingImage && (
                <div className="mt-4">
                  <Image src={formData.imageUrl} alt="Product Preview" width={100} height={100} className="rounded-lg object-cover" />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" color="primary" size="lg" isLoading={isSubmitting || isUploadingImage}>
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};