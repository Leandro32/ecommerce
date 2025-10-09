'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { addToast } from '@heroui/react';
import Image from 'next/image'; // Import Image component
import { SingleImageUploader } from '../../../src/admin/components/forms/single-image-uploader';

const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  paragraph: z.string().min(1, 'Paragraph is required'),
  heroImageUrl: z.string().min(1, 'Hero Image URL is required'), // Changed validation
  buttonLayout: z.enum(['none', 'oneButton', 'twoButtons']),
  buttons:
    z
      .array(
        z.object({
          buttonText: z.string().min(1, 'Button text is required'),
          buttonLink: z.string().min(1, 'Button link is required'),
          isExternal: z.boolean(),
          variant: z.enum(['primary', 'secondary']),
        })
      )
      .optional(),
});

type HeroFormData = z.infer<typeof heroSchema>;

export default function HeroAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Keep this state
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue, // Added setValue
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: '',
      paragraph: '',
      heroImageUrl: '',
      buttonLayout: 'none',
      buttons: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'buttons',
  });

  const buttonLayout = watch('buttonLayout');

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const response = await fetch('/api/v1/admin/hero');
        const data = await response.json();
        if (data) {
          reset(data);
        }
      } catch (error) {
        addToast({ title: 'Error', description: 'Failed to fetch hero data', color: 'danger' });
      } finally {
        setIsLoading(false);
      }
    }
    fetchHeroData();
  }, [reset]);

  const onSubmit = async (data: HeroFormData) => {
    try {
      const response = await fetch('/api/v1/admin/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update hero data');
      }

      const updatedData = await response.json();
      reset(updatedData);
      addToast({ title: 'Success', description: 'Hero section updated successfully!', color: 'success' });
    } catch (error) {
      addToast({ title: 'Error', description: 'An error occurred while updating the hero section.', color: 'danger' });
    }
  };

  useEffect(() => {
    const desiredButtonCount =
      buttonLayout === 'oneButton' ? 1 : buttonLayout === 'twoButtons' ? 2 : 0;

    if (fields.length < desiredButtonCount) {
      for (let i = fields.length; i < desiredButtonCount; i++) {
        append({
          buttonText: '',
          buttonLink: '',
          isExternal: false,
          variant: 'primary',
        });
      }
    } else if (fields.length > desiredButtonCount) {
      for (let i = fields.length; i > desiredButtonCount; i--) {
        remove(i - 1);
      }
    }
  }, [buttonLayout, fields, append, remove]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Manage Hero Section</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input id="title" label="Title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Textarea id="paragraph" label="Paragraph" {...register('paragraph')} />
            {errors.paragraph && <p className="text-red-500 text-sm mt-1">{errors.paragraph.message}</p>}
          </div>
          <div>
            <label htmlFor="heroImageUrl" className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
            <SingleImageUploader
              value={watch('heroImageUrl')}
              onChange={(url) => setValue('heroImageUrl', url, { shouldValidate: true })}
              disabled={isUploadingImage}
            />
            {errors.heroImageUrl && <p className="text-red-500 text-sm mt-1">{errors.heroImageUrl.message}</p>}
          </div>
          <div>
            <Select
              label="Button Layout"
              selectedKeys={[buttonLayout]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0];
                reset({ ...watch(), buttonLayout: value as any });
              }}
            >
              <SelectItem key="none" value="none">
                None
              </SelectItem>
              <SelectItem key="oneButton" value="oneButton">
                One Button
              </SelectItem>
              <SelectItem key="twoButtons" value="twoButtons">
                Two Buttons
              </SelectItem>
            </Select>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-4">
              <h3 className="font-semibold">Button {index + 1}</h3>
              <div>
                <Input id={`buttons.${index}.buttonText`} label="Button Text" {...register(`buttons.${index}.buttonText`)} />
                {errors.buttons?.[index]?.buttonText && <p className="text-red-500 text-sm mt-1">{errors.buttons[index].buttonText.message}</p>}
              </div>
              <div>
                <Input id={`buttons.${index}.buttonLink`} label="Button Link" {...register(`buttons.${index}.buttonLink`)} />
                {errors.buttons?.[index]?.buttonLink && <p className="text-red-500 text-sm mt-1">{errors.buttons[index].buttonLink.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id={`buttons.${index}.isExternal`} {...register(`buttons.${index}.isExternal`)} className="h-4 w-4" />
                <label htmlFor={`buttons.${index}.isExternal`}>External Link</label>
              </div>
              <div>
                <Select
                  label="Variant"
                  selectedKeys={[watch(`buttons.${index}.variant`)]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    reset({ ...watch(), buttons: watch('buttons').map((b, i) => i === index ? { ...b, variant: value as any } : b) });
                  }}
                >
                  <SelectItem key="primary" value="primary">
                    Primary
                  </SelectItem>
                  <SelectItem key="secondary" value="secondary">
                    Secondary
                  </SelectItem>
                </Select>
              </div>
            </div>
          ))}

          <Button type="submit" disabled={isUploadingImage}>Save Changes</Button>
        </form>
      </CardBody>
    </Card>
  );
}
