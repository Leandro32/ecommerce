import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader, Divider, Spinner, Image, Select, SelectItem, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter, useParams } from 'next/navigation';
import { useProduct } from '@/hooks/queries/useProduct';
import { useCreateProduct, useUpdateProduct } from '@/hooks/queries/useProductMutations';
import { useFragranceNotes } from '@/hooks/queries/useFragranceNoteHooks';
import { FragranceNote } from '@/types/fragrance';
import { addToast } from '@heroui/react';
import { Sex } from '@prisma/client';

interface ProductFragranceNote {
  fragranceNoteId: string;
  percentage: number;
  name?: string; // For display purposes
}

interface ProductForm {
  name: string;
  brand: string;
  sex: Sex[];
  description: string;
  price: number;
  stock: number;
  bottleSize: number;
  bottleType: string;
  packaging: string;
  isDiscounted: boolean;
  discountPrice?: number;
  seoTitle?: string;
  seoDescription?: string;
  imageUrls: string[];
  fragranceNotes: ProductFragranceNote[];
}

export const ProductFormPage: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<ProductForm>>({
    name: '',
    brand: '',
    sex: [],
    description: '',
    price: undefined,
    stock: 0,
    bottleSize: 100,
    bottleType: 'Standard',
    packaging: 'Boxed',
    isDiscounted: false,
    discountPrice: undefined,
    seoTitle: '',
    seoDescription: '',
    imageUrls: [],
    fragranceNotes: [],
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: product, isLoading: isLoadingProduct } = useProduct(id as string);
  const { data: fragranceNotesData, isLoading: isLoadingFragranceNotes } = useFragranceNotes({ limit: 100 });
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        sex: product.sex,
        description: product.description,
        price: product.price,
        stock: product.stock,
        bottleSize: product.bottleSize,
        bottleType: product.bottleType,
        packaging: product.packaging,
        isDiscounted: product.isDiscounted || false,
        discountPrice: product.discountPrice || 0,
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        imageUrls: product.imageUrls || [],
        fragranceNotes: product.fragranceNotes?.map(fn => ({ 
          fragranceNoteId: fn.fragranceNote.id,
          percentage: fn.percentage,
          name: fn.fragranceNote.name
        })) || [],
      });
    }
  }, [isEditMode, product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'stock', 'bottleSize', 'discountPrice'].includes(name) 
        ? (parseFloat(value) || 0)
        : value,
    }));
  };

  const handleSexChange = (keys: any) => {
    const selectedSex = Array.from(keys as Set<string>) as Sex[];
    setFormData(prev => ({ ...prev, sex: selectedSex }));
  };

  const handleNoteSelectionChange = (keys: any) => {
    const selectedIds = Array.from(keys as Set<string>);
    const newNotes = selectedIds.map(id => {
      const existingNote = formData.fragranceNotes?.find(n => n.fragranceNoteId === id);
      if (existingNote) return existingNote;
      const noteData = fragranceNotesData?.fragranceNotes.find(n => n.id === id);
      return { fragranceNoteId: id, percentage: 10, name: noteData?.name || '' };
    });
    setFormData(prev => ({ ...prev, fragranceNotes: newNotes }));
  };

  const handleNotePercentageChange = (noteId: string, percentage: string) => {
    const newPercentage = Number(percentage);
    setFormData(prev => ({
      ...prev,
      fragranceNotes: prev.fragranceNotes?.map(note => 
        note.fragranceNoteId === noteId ? { ...note, percentage: newPercentage } : note
      )
    }));
  };

  const handleRemoveNote = (noteId: string) => {
    setFormData(prev => ({ ...prev, fragranceNotes: prev.fragranceNotes?.filter(n => n.fragranceNoteId !== noteId) }));
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setIsUploadingImage(true);
    const uploadPromises = files.map(async (file) => {
      const data = new FormData();
      data.append('image', file);
      const res = await fetch('/api/v1/admin/upload-image', {
        method: 'POST',
        body: data,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      const { imageUrl: relativeImageUrl } = await res.json();
      const fullImageUrl = new URL(relativeImageUrl, window.location.origin).href;
      return fullImageUrl;
    });

    try {
      const newImageUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, imageUrls: [...(prev.imageUrls || []), ...newImageUrls] }));
      addToast({
        title: 'Success',
        description: `${newImageUrls.length} image(s) uploaded successfully.`,
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

  const handleImageDelete = (urlToDelete: string) => {
    setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls?.filter(url => url !== urlToDelete) }));
    addToast({ title: 'Image Removed', color: 'default' });
  };

  const generateSeoTitle = () => {
    const { name, brand, bottleSize } = formData;
    if (!name || !brand || !bottleSize) {
      addToast({ title: 'Missing Info', description: 'Please fill out Name, Brand, and Bottle Size first.', color: 'warning' });
      return;
    }
    const newSeoTitle = `${name} | ${brand} | ${bottleSize}ml`;
    setFormData(prev => ({ ...prev, seoTitle: newSeoTitle }));
  };

  const generateSeoDescription = () => {
    const { description, name } = formData;
    if (!description) {
      addToast({ title: 'Missing Info', description: 'Please fill out the main Description first.', color: 'warning' });
      return;
    }
    const firstSentence = description.split('.')[0] || '';
    let newSeoDesc = `Discover ${name}. ${firstSentence}.`;
    if (newSeoDesc.length > 155) {
      newSeoDesc = newSeoDesc.substring(0, 152) + '...';
    }
    setFormData(prev => ({ ...prev, seoDescription: newSeoDesc }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
      ...formData, 
      id, 
      fragranceNotes: formData.fragranceNotes?.map(({fragranceNoteId, percentage}) => ({fragranceNoteId, percentage}))
    };

    if (isEditMode) {
      updateProduct(productData as any, { onSuccess: () => router.push('/admin/products') });
    } else {
      createProduct(productData as any, { onSuccess: () => router.push('/admin/products') });
    }
  };

  if (isEditMode && isLoadingProduct) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading product..." /></div>;
  }

  const percentageOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
  const sexOptions = [Sex.WOMAN, Sex.MAN, Sex.UNISEX];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><h2 className="text-xl font-semibold">Product Details</h2></CardHeader>
          <Divider />
          <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Product Name" name="name" value={formData.name || ''} onValueChange={(v) => handleChange({target:{name:'name', value:v}} as any)} required className="md:col-span-2" />
            <Input label="Brand" name="brand" value={formData.brand || ''} onValueChange={(v) => handleChange({target:{name:'brand', value:v}} as any)} required />
            <Input label="Price" name="price" type="number" value={formData.price === 0 ? '' : String(formData.price)} onValueChange={(v) => handleChange({target:{name:'price', value:v}} as any)} required min="0.01" step="0.01" startContent={<Icon icon="lucide:dollar-sign" className="text-default-400" />} />
            <Input label="Stock" name="stock" type="number" value={String(formData.stock)} onValueChange={(v) => handleChange({target:{name:'stock', value:v}} as any)} required />
            <Input label="Bottle Size (ml)" name="bottleSize" type="number" value={String(formData.bottleSize)} onValueChange={(v) => handleChange({target:{name:'bottleSize', value:v}} as any)} required />
            <Select label="Sex" selectionMode="multiple" placeholder="Select target audience" selectedKeys={new Set(formData.sex || [])} onSelectionChange={handleSexChange} required>
              {sexOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </Select>
            <Input label="Bottle Type" name="bottleType" value={formData.bottleType || ''} onValueChange={(v) => handleChange({target:{name:'bottleType', value:v}} as any)} />
            <Input label="Packaging" name="packaging" value={formData.packaging || ''} onValueChange={(v) => handleChange({target:{name:'packaging', value:v}} as any)} />
            <Textarea label="Description" name="description" value={formData.description || ''} onValueChange={(v) => handleChange({target:{name:'description', value:v}} as any)} className="md:col-span-3" required />
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-default-700 mb-1">Product Images <span className="text-danger-500 text-xs">(at least 1 required)</span></label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" disabled={isUploadingImage} multiple />
              {isUploadingImage && <Spinner size="sm" className="mt-2" label="Uploading..." />} 
              <div className="mt-4 flex flex-wrap gap-4">
                {formData.imageUrls?.map((url) => (
                  <div key={url} className="relative group">
                    <Image src={url} alt="Product Preview" width={100} height={100} className="rounded-lg object-cover" />
                    <Button isIconOnly size="sm" color="danger" variant="solid" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onPress={() => handleImageDelete(url)} aria-label="Delete image">
                      <Icon icon="lucide:trash-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="text-xl font-semibold">Pricing & SEO</h2></CardHeader>
          <Divider />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Switch
                name="isDiscounted"
                isSelected={formData.isDiscounted}
                onValueChange={(v) => setFormData(prev => ({...prev, isDiscounted: v}))}
              >
                Is Discounted
              </Switch>
            </div>
            {formData.isDiscounted && (
              <Input
                label="Discount Price"
                name="discountPrice"
                type="number"
                value={formData.discountPrice === 0 ? '' : String(formData.discountPrice)}
                onValueChange={(v) => handleChange({target:{name:'discountPrice', value:v}} as any)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                startContent={<Icon icon="lucide:dollar-sign" className="text-default-400" />}
              />
            )}
            <div className="md:col-span-2 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Input
                  label="SEO Title"
                  name="seoTitle"
                  value={formData.seoTitle || ''}
                  onValueChange={(v) => handleChange({target:{name:'seoTitle', value:v}} as any)}
                  className="flex-grow"
                />
                <Button onPress={generateSeoTitle} size="sm" variant="flat" className="mt-6">Generate</Button>
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <Textarea
                  label="SEO Description"
                  name="seoDescription"
                  value={formData.seoDescription || ''}
                  onValueChange={(v) => handleChange({target:{name:'seoDescription', value:v}} as any)}
                  className="flex-grow"
                />
                <Button onPress={generateSeoDescription} size="sm" variant="flat" className="mt-6">Generate</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
            <CardHeader><h2 className="text-xl font-semibold">Fragrance Notes</h2></CardHeader>
            <Divider />
            <CardBody className="space-y-4">
                <Select label="Select Notes" selectionMode="multiple" placeholder="Choose fragrance notes" selectedKeys={new Set(formData.fragranceNotes?.map(n => n.fragranceNoteId) || [])} onSelectionChange={handleNoteSelectionChange} isLoading={isLoadingFragranceNotes}>
                    {(fragranceNotesData?.fragranceNotes || []).map((note: FragranceNote) => (
                        <SelectItem key={note.id} value={note.id}>{note.name}</SelectItem>
                    ))}
                </Select>
                <div className="space-y-3">
                    {formData.fragranceNotes?.map(note => (
                        <div key={note.fragranceNoteId} className="flex items-center justify-between gap-4 p-2 border rounded-lg">
                            <span className="font-medium">{note.name}</span>
                            <div className="flex items-center gap-2">
                                <Select aria-label={`Percentage for ${note.name}`} size="sm" className="w-32" selectedKeys={[String(note.percentage)]} onChange={(e) => handleNotePercentageChange(note.fragranceNoteId, e.target.value)}>
                                    {percentageOptions.map(p => (
                                        <SelectItem key={p} value={String(p)}>{`${p}%`}</SelectItem>
                                    ))}
                                </Select>
                                <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => handleRemoveNote(note.fragranceNoteId)}>
                                    <Icon icon="lucide:trash-2" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" color="primary" size="lg" isLoading={isCreating || isUpdating || isUploadingImage}>
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};