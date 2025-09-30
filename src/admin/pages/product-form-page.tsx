import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Input, Textarea, Button, Select, SelectItem, Checkbox, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useForm, Controller } from "react-hook-form";
import { mockProducts, mockCategories } from "../data/mock-data";
import { ImageUploader } from "../components/forms/image-uploader";
import { addToast } from "@heroui/react";

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = React.useState(isEditMode);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      images: [],
      isActive: true,
      isFeatured: false
    }
  });
  
  React.useEffect(() => {
    if (isEditMode) {
      // Simulate API call to get product data
      setTimeout(() => {
        const product = mockProducts.find(p => p.id === id);
        if (product) {
          reset({
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            images: product.images || [],
            isActive: product.isActive !== false,
            isFeatured: product.isFeatured || false
          });
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [id, isEditMode, reset]);
  
  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addToast({
        title: `Product ${isEditMode ? "Updated" : "Created"}`,
        description: `${data.name} has been successfully ${isEditMode ? "updated" : "created"}.`,
        severity: "success"
      });
      
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      addToast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} product. Please try again.`,
        severity: "danger"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{isEditMode ? "Edit Product" : "New Product"}</h1>
          <p className="text-gray-500 text-sm">
            {isEditMode ? "Update product information" : "Create a new product"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="flat" 
            as={Link} 
            to="/admin/products"
            startContent={<Icon icon="lucide:arrow-left" />}
          >
            Cancel
          </Button>
          <Button 
            color="primary"
            isLoading={isSaving}
            onPress={handleSubmit(onSubmit)}
            startContent={<Icon icon="lucide:save" />}
          >
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardBody className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <Icon icon="lucide:loader" className="text-primary text-2xl animate-spin" />
              <p>Loading product data...</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardBody className="space-y-6">
              <h2 className="text-lg font-medium">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Product name is required" }}
                  render={({ field }) => (
                    <Input
                      label="Product Name"
                      placeholder="Enter product name"
                      isRequired
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message}
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="sku"
                  control={control}
                  rules={{ required: "SKU is required" }}
                  render={({ field }) => (
                    <Input
                      label="SKU"
                      placeholder="Enter product SKU"
                      isRequired
                      isInvalid={!!errors.sku}
                      errorMessage={errors.sku?.message}
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      label="Category"
                      placeholder="Select a category"
                      isRequired
                      isInvalid={!!errors.category}
                      errorMessage={errors.category?.message}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        field.onChange(selected);
                      }}
                    >
                      {mockCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="price"
                    control={control}
                    rules={{ 
                      required: "Price is required",
                      min: { value: 0, message: "Price must be positive" }
                    }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        label="Price ($)"
                        placeholder="0.00"
                        isRequired
                        startContent={<div className="text-default-400">$</div>}
                        isInvalid={!!errors.price}
                        errorMessage={errors.price?.message}
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseFloat(value) || 0)}
                      />
                    )}
                  />
                  
                  <Controller
                    name="stock"
                    control={control}
                    rules={{ 
                      required: "Stock is required",
                      min: { value: 0, message: "Stock must be positive" }
                    }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        label="Stock"
                        placeholder="0"
                        isRequired
                        isInvalid={!!errors.stock}
                        errorMessage={errors.stock?.message}
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                      />
                    )}
                  />
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h2 className="text-lg font-medium mb-4">Description</h2>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Product Description"
                      placeholder="Enter detailed product description..."
                      minRows={5}
                      {...field}
                    />
                  )}
                />
              </div>
              
              <Divider />
              
              <div>
                <h2 className="text-lg font-medium mb-4">Images</h2>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      images={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              
              <Divider />
              
              <div>
                <h2 className="text-lg font-medium mb-4">Settings</h2>
                <div className="flex flex-col gap-4">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Product is active and visible in store
                      </Checkbox>
                    )}
                  />
                  
                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Feature this product on homepage
                      </Checkbox>
                    )}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="flat" 
              as={Link} 
              to="/admin/products"
            >
              Cancel
            </Button>
            <Button 
              color="primary"
              type="submit"
              isLoading={isSaving}
              startContent={<Icon icon="lucide:save" />}
            >
              {isEditMode ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};