import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Input, Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useForm, Controller } from "react-hook-form";
import { addToast } from "@heroui/react";
import { LineItemBuilder } from "../components/orders/line-item-builder";

interface OrderFormData {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  billing_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }>;
  notes: string;
}

export const OrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);
  const [sameAsShipping, setSameAsShipping] = React.useState(true);
  
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
    defaultValues: {
      customer: {
        name: "",
        email: "",
        phone: ""
      },
      shipping_address: {
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
        phone: ""
      },
      billing_address: {
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
        phone: ""
      },
      items: [],
      notes: ""
    }
  });
  
  const watchedItems = watch("items");
  const shippingAddress = watch("shipping_address");
  
  // Calculate order totals
  const subtotal = React.useMemo(() => {
    return watchedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [watchedItems]);
  
  const shipping = 10; // Fixed shipping cost for demo
  const tax = subtotal * 0.07; // 7% tax rate for demo
  const total = subtotal + shipping + tax;
  
  // Update billing address when shipping address changes and sameAsShipping is true
  React.useEffect(() => {
    if (sameAsShipping) {
      setValue("billing_address", { ...shippingAddress });
    }
  }, [sameAsShipping, shippingAddress, setValue]);
  
  const onSubmit = async (data: OrderFormData) => {
    if (data.items.length === 0) {
      addToast({
        title: "Error",
        description: "Please add at least one product to the order",
        severity: "danger"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addToast({
        title: "Order Created",
        description: "New order has been successfully created",
        severity: "success"
      });
      
      navigate("/admin/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      addToast({
        title: "Error",
        description: "Failed to create order. Please try again.",
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
          <h1 className="text-2xl font-semibold">New Order</h1>
          <p className="text-gray-500 text-sm">Create a new customer order</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="flat" 
            as={Link} 
            to="/admin/orders"
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
            Create Order
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    name="customer.name"
                    control={control}
                    rules={{ required: "Customer name is required" }}
                    render={({ field }) => (
                      <Input
                        label="Customer Name"
                        placeholder="Full name"
                        isRequired
                        isInvalid={!!errors.customer?.name}
                        errorMessage={errors.customer?.name?.message}
                        {...field}
                      />
                    )}
                  />
                  
                  <Controller
                    name="customer.email"
                    control={control}
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        type="email"
                        label="Email"
                        placeholder="customer@example.com"
                        isRequired
                        isInvalid={!!errors.customer?.email}
                        errorMessage={errors.customer?.email?.message}
                        {...field}
                      />
                    )}
                  />
                  
                  <Controller
                    name="customer.phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Phone"
                        placeholder="(123) 456-7890"
                        {...field}
                      />
                    )}
                  />
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="shipping_address.name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <Input
                        label="Full Name"
                        placeholder="Recipient name"
                        isRequired
                        isInvalid={!!errors.shipping_address?.name}
                        errorMessage={errors.shipping_address?.name?.message}
                        {...field}
                      />
                    )}
                  />
                  
                  <Controller
                    name="shipping_address.phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Phone"
                        placeholder="(123) 456-7890"
                        {...field}
                      />
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <Controller
                      name="shipping_address.street"
                      control={control}
                      rules={{ required: "Street address is required" }}
                      render={({ field }) => (
                        <Input
                          label="Street Address"
                          placeholder="123 Main St, Apt 4B"
                          isRequired
                          isInvalid={!!errors.shipping_address?.street}
                          errorMessage={errors.shipping_address?.street?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  
                  <Controller
                    name="shipping_address.city"
                    control={control}
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <Input
                        label="City"
                        placeholder="City"
                        isRequired
                        isInvalid={!!errors.shipping_address?.city}
                        errorMessage={errors.shipping_address?.city?.message}
                        {...field}
                      />
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="shipping_address.state"
                      control={control}
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <Input
                          label="State/Province"
                          placeholder="State"
                          isRequired
                          isInvalid={!!errors.shipping_address?.state}
                          errorMessage={errors.shipping_address?.state?.message}
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="shipping_address.zip"
                      control={control}
                      rules={{ required: "ZIP code is required" }}
                      render={({ field }) => (
                        <Input
                          label="ZIP/Postal Code"
                          placeholder="12345"
                          isRequired
                          isInvalid={!!errors.shipping_address?.zip}
                          errorMessage={errors.shipping_address?.zip?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  
                  <Controller
                    name="shipping_address.country"
                    control={control}
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <Input
                        label="Country"
                        placeholder="Country"
                        isRequired
                        isInvalid={!!errors.shipping_address?.country}
                        errorMessage={errors.shipping_address?.country?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Billing Address</h2>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="sameAsShipping" className="text-sm">
                      Same as shipping address
                    </label>
                  </div>
                </div>
                
                {!sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="billing_address.name"
                      control={control}
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <Input
                          label="Full Name"
                          placeholder="Billing name"
                          isRequired
                          isInvalid={!!errors.billing_address?.name}
                          errorMessage={errors.billing_address?.name?.message}
                          {...field}
                        />
                      )}
                    />
                    
                    <Controller
                      name="billing_address.phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Phone"
                          placeholder="(123) 456-7890"
                          {...field}
                        />
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <Controller
                        name="billing_address.street"
                        control={control}
                        rules={{ required: "Street address is required" }}
                        render={({ field }) => (
                          <Input
                            label="Street Address"
                            placeholder="123 Main St, Apt 4B"
                            isRequired
                            isInvalid={!!errors.billing_address?.street}
                            errorMessage={errors.billing_address?.street?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    
                    <Controller
                      name="billing_address.city"
                      control={control}
                      rules={{ required: "City is required" }}
                      render={({ field }) => (
                        <Input
                          label="City"
                          placeholder="City"
                          isRequired
                          isInvalid={!!errors.billing_address?.city}
                          errorMessage={errors.billing_address?.city?.message}
                          {...field}
                        />
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        name="billing_address.state"
                        control={control}
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                          <Input
                            label="State/Province"
                            placeholder="State"
                            isRequired
                            isInvalid={!!errors.billing_address?.state}
                            errorMessage={errors.billing_address?.state?.message}
                            {...field}
                          />
                        )}
                      />
                      
                      <Controller
                        name="billing_address.zip"
                        control={control}
                        rules={{ required: "ZIP code is required" }}
                        render={({ field }) => (
                          <Input
                            label="ZIP/Postal Code"
                            placeholder="12345"
                            isRequired
                            isInvalid={!!errors.billing_address?.zip}
                            errorMessage={errors.billing_address?.zip?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    
                    <Controller
                      name="billing_address.country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <Input
                          label="Country"
                          placeholder="Country"
                          isRequired
                          isInvalid={!!errors.billing_address?.country}
                          errorMessage={errors.billing_address?.country?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Order Items</h2>
                <Controller
                  name="items"
                  control={control}
                  render={({ field }) => (
                    <LineItemBuilder
                      items={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </CardBody>
            </Card>
            
            <Card>
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Order Notes</h2>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Notes"
                      placeholder="Add any additional notes about this order"
                      {...field}
                    />
                  )}
                />
              </CardBody>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardBody>
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping:</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax (7%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    color="primary"
                    className="w-full"
                    size="lg"
                    isLoading={isSaving}
                    onPress={handleSubmit(onSubmit)}
                    startContent={<Icon icon="lucide:check" />}
                  >
                    Create Order
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500">
                    This will create a new order with status "Solicitud / Nuevo"
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};