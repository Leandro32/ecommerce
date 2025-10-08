import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { toast } from "sonner";

interface SingleImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/v1/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      onChange(data.imageUrl); // Pass the uploaded image URL to the parent
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  };

  const handleRemoveImage = () => {
    onChange(""); // Clear the image URL in the parent form
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative group w-48 h-24 rounded-md overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Image Preview"
            layout="fill"
            objectFit="cover"
          />
          <Button
            isIconOnly
            size="sm"
            color="danger"
            variant="solid"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onPress={handleRemoveImage}
            disabled={disabled || isUploading}
          >
            <Icon icon="lucide:trash-2" />
          </Button>
        </div>
      )}

      {!value && (
        <Button
          onPress={() => fileInputRef.current?.click()}
          startContent={<Icon icon="lucide:upload" />}
          disabled={disabled || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF. Max file size: 5MB.
      </p>
    </div>
  );
};
