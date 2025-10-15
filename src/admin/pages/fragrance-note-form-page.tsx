
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Card, CardBody, CardHeader, Divider, Spinner, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter, useParams } from 'next/navigation';
import { useFragranceNote, useAddFragranceNote, useUpdateFragranceNote } from '@/hooks/queries/useFragranceNoteHooks';
import { addToast } from '@heroui/react';

interface FragranceNoteForm {
  name: string;
  color: string;
  imageUrl?: string;
}

export const FragranceNoteFormPage: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<Partial<FragranceNoteForm>>({
    name: '',
    color: '#000000',
    imageUrl: '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data: fragranceNote, isLoading: isLoadingNote } = useFragranceNote(id as string);
  const { mutate: addFragranceNote, isPending: isCreating } = useAddFragranceNote();
  const { mutate: updateFragranceNote, isPending: isUpdating } = useUpdateFragranceNote();

  useEffect(() => {
    if (isEditMode && fragranceNote) {
      setFormData({
        name: fragranceNote.name,
        color: fragranceNote.color,
        imageUrl: fragranceNote.imageUrl || '',
      });
    }
  }, [isEditMode, fragranceNote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, color: e.target.value }));
  };

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploadingImage(true);

    const data = new FormData();
    data.append('image', file);

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
      const fullImageUrl = new URL(relativeImageUrl, window.location.origin).href;
      setFormData(prev => ({ ...prev, imageUrl: fullImageUrl }));
      addToast({ title: 'Success', description: 'Image uploaded successfully.', color: 'success' });
    } catch (err: any) {
      addToast({ title: 'Error', description: err.message || 'An error occurred during image upload.', color: 'danger' });
    } finally {
      setIsUploadingImage(false);
    }
  }, []);

  const handleImageDelete = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    addToast({ title: 'Image Removed', description: 'The image has been removed.', color: 'default' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = { ...formData, id };

    if (isEditMode) {
      updateFragranceNote(noteData as any, { onSuccess: () => router.push('/admin/fragrance-notes') });
    } else {
      addFragranceNote(noteData as any, { onSuccess: () => router.push('/admin/fragrance-notes') });
    }
  };

  if (isEditMode && isLoadingNote) {
    return <div className="flex justify-center items-center h-screen"><Spinner label="Loading note..." /></div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Fragrance Note' : 'Create New Fragrance Note'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><h2 className="text-xl font-semibold">Note Details</h2></CardHeader>
          <Divider />
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Note Name"
              name="name"
              value={formData.name}
              onValueChange={(value) => handleChange({ target: { name: 'name', value } } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="e.g., Vanilla, Cedarwood"
              required
            />
            <div className="flex items-center gap-4">
              <label htmlFor="color-picker" className="block text-sm font-medium text-default-700">Color</label>
              <input
                id="color-picker"
                type="color"
                name="color"
                value={formData.color}
                onChange={handleColorChange}
                className="w-12 h-12 p-1 border-default-200 rounded-lg cursor-pointer"
              />
              <Input
                name="color"
                value={formData.color}
                onValueChange={(value) => handleChange({ target: { name: 'color', value } } as React.ChangeEvent<HTMLInputElement>)}
                className="flex-grow"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-default-700 mb-1">Note Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-default-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                disabled={isUploadingImage}
              />
              {isUploadingImage && <Spinner size="sm" className="mt-2" label="Uploading..." />} 
              {formData.imageUrl && (
                <div className="mt-4 relative group w-32">
                  <Image src={formData.imageUrl} alt="Note Preview" width={100} height={100} className="rounded-lg object-cover" />
                  <Button
                    isIconOnly size="sm" color="danger" variant="solid"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPress={handleImageDelete} aria-label="Delete image"
                  >
                    <Icon icon="lucide:trash-2" />
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" color="primary" size="lg" isLoading={isCreating || isUpdating || isUploadingImage}>
            {isEditMode ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </form>
    </div>
  );
};
