'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui';
import { toast } from 'sonner';

const heroSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  paragraph: z.string().min(1, 'Paragraph is required'),
  heroImageUrl: z.string().url('Invalid URL'),
  buttonLayout: z.enum(['none', 'oneButton', 'twoButtons']),
  buttons: z
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
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
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
        toast.error('Failed to fetch hero data');
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
      toast.success('Hero section updated successfully!');
    } catch (error) {
      toast.error('An error occurred while updating the hero section.');
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
        <CardTitle>Manage Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="paragraph">Paragraph</Label>
            <Textarea id="paragraph" {...register('paragraph')} />
            {errors.paragraph && <p className="text-red-500 text-sm mt-1">{errors.paragraph.message}</p>}
          </div>
          <div>
            <Label htmlFor="heroImageUrl">Hero Image URL</Label>
            <Input id="heroImageUrl" {...register('heroImageUrl')} />
            {errors.heroImageUrl && <p className="text-red-500 text-sm mt-1">{errors.heroImageUrl.message}</p>}
          </div>
          <div>
            <Label htmlFor="buttonLayout">Button Layout</Label>
            <Select onValueChange={(value) => reset({ ...watch(), buttonLayout: value as any })} value={buttonLayout}>
              <SelectTrigger>
                <SelectValue placeholder="Select button layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="oneButton">One Button</SelectItem>
                <SelectItem value="twoButtons">Two Buttons</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-4">
              <h3 className="font-semibold">Button {index + 1}</h3>
              <div>
                <Label htmlFor={`buttons.${index}.buttonText`}>Button Text</Label>
                <Input id={`buttons.${index}.buttonText`} {...register(`buttons.${index}.buttonText`)} />
                {errors.buttons?.[index]?.buttonText && <p className="text-red-500 text-sm mt-1">{errors.buttons[index].buttonText.message}</p>}
              </div>
              <div>
                <Label htmlFor={`buttons.${index}.buttonLink`}>Button Link</Label>
                <Input id={`buttons.${index}.buttonLink`} {...register(`buttons.${index}.buttonLink`)} />
                {errors.buttons?.[index]?.buttonLink && <p className="text-red-500 text-sm mt-1">{errors.buttons[index].buttonLink.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id={`buttons.${index}.isExternal`} {...register(`buttons.${index}.isExternal`)} className="h-4 w-4" />
                <Label htmlFor={`buttons.${index}.isExternal`}>External Link</Label>
              </div>
              <div>
                <Label htmlFor={`buttons.${index}.variant`}>Variant</Label>
                <Select onValueChange={(value) => reset({ ...watch(), buttons: watch('buttons').map((b, i) => i === index ? { ...b, variant: value as any } : b) })} value={watch(`buttons.${index}.variant`)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button type="submit">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
