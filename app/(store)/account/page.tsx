'use client';

import Image from 'next/image';
import React from 'react';
import { Button, Card, CardBody, Tabs, Tab, Input, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const AccountPage: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [userData, setUserData] = React.useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });
  
  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save the data to the backend here
  };
  
  const wishlistItems = [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      image: 'https://img.heroui.chat/image/clothing?w=200&h=200&u=1'
    },
    {
      id: '2',
      name: 'Slim Fit Jeans',
      price: 59.99,
      image: 'https://img.heroui.chat/image/clothing?w=200&h=200&u=2'
    },
    {
      id: '3',
      name: 'Leather Sneakers',
      price: 89.99,
      image: 'https://img.heroui.chat/image/shoes?w=200&h=200&u=1'
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-6"
    >
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>
      
      <Card className="mb-8">
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
              className="w-20 h-20"
            />
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
              <p className="text-default-500">{userData.email}</p>
              <p className="text-default-500">Member since June 2024</p>
            </div>
            <Button
              color="primary"
              variant="flat"
              startContent={<Icon icon="lucide:log-out" className="text-sm" />}
            >
              Sign Out
            </Button>
          </div>
        </CardBody>
      </Card>
      
      <Tabs aria-label="Account sections">
        <Tab key="profile" title="Profile">
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {!isEditing ? (
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => setIsEditing(true)}
                    startContent={<Icon icon="lucide:edit" className="text-sm" />}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="flat"
                      color="danger"
                      onPress={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      onPress={handleSave}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <Input
                      label="First Name"
                      value={userData.firstName}
                      onValueChange={(value) => handleInputChange('firstName', value)}
                    />
                    <Input
                      label="Last Name"
                      value={userData.lastName}
                      onValueChange={(value) => handleInputChange('lastName', value)}
                    />
                    <Input
                      label="Email"
                      value={userData.email}
                      onValueChange={(value) => handleInputChange('email', value)}
                    />
                    <Input
                      label="Phone"
                      value={userData.phone}
                      onValueChange={(value) => handleInputChange('phone', value)}
                    />
                    <Input
                      label="Address"
                      value={userData.address}
                      onValueChange={(value) => handleInputChange('address', value)}
                    />
                    <Input
                      label="City"
                      value={userData.city}
                      onValueChange={(value) => handleInputChange('city', value)}
                    />
                    <Input
                      label="State/Province"
                      value={userData.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                    />
                    <Input
                      label="ZIP/Postal Code"
                      value={userData.zipCode}
                      onValueChange={(value) => handleInputChange('zipCode', value)}
                    />
                    <Input
                      label="Country"
                      value={userData.country}
                      onValueChange={(value) => handleInputChange('country', value)}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-default-500">First Name</p>
                      <p>{userData.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">Last Name</p>
                      <p>{userData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">Email</p>
                      <p>{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">Phone</p>
                      <p>{userData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">Address</p>
                      <p>{userData.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">City</p>
                      <p>{userData.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">State/Province</p>
                      <p>{userData.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">ZIP/Postal Code</p>
                      <p>{userData.zipCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-default-500">Country</p>
                      <p>{userData.country}</p>
                    </div>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="wishlist" title="Wishlist">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold mb-6">Your Wishlist</h3>
              
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="border border-divider">
                      <CardBody className="p-0">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                          <p className="font-semibold">${item.price.toFixed(2)}</p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              color="primary"
                              fullWidth
                            >
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                            >
                              <Icon icon="lucide:trash-2" />
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon icon="lucide:heart" className="text-4xl text-default-300 mx-auto mb-4" />
                  <p className="text-default-500">Your wishlist is empty.</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </motion.div>
  );
};

export default AccountPage;
