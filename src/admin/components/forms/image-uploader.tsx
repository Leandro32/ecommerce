import React from "react";
import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleAddImage = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, you would upload these files to your server/cloud storage.
    // For now, we'll use object URLs for local preview.
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    
    onChange([...images, ...newImages]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <Image 
              src={image} 
              alt={`Product image ${index + 1}`} 
              width={128}
              height={128}
              className="w-full h-32 object-cover rounded-md border border-gray-200"
            />
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="solid"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onPress={() => handleRemoveImage(index)}
            >
              <Icon icon="lucide:trash-2" />
            </Button>
          </div>
        ))}
        
        <Card 
          isPressable 
          onPress={handleAddImage}
          className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 bg-gray-50"
        >
          <div className="flex flex-col items-center p-4">
            <Icon icon="lucide:upload" className="text-gray-400 text-2xl mb-2" />
            <span className="text-sm text-gray-500">Add Image</span>
          </div>
        </Card>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF. Max file size: 5MB.
      </p>
    </div>
  );
};