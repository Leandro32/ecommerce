import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { ImageUploader } from "../components/forms/image-uploader";
import { HeroData, Button as HeroButton } from "../../types/hero";

export const HeroPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<HeroData>>({
    title: "",
    paragraph: "",
    heroImageUrl: "",
    buttonLayout: "none",
    buttons: [],
  });

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const response = await fetch("/api/v1/admin/hero");
        const data = await response.json();
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to fetch hero data",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchHeroData();
  }, []);

  const handleFormChange = (field: keyof Partial<HeroData>, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonChange = (
    index: number,
    field: keyof HeroButton,
    value: any,
  ) => {
    const newButtons = [...formData.buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setFormData((prev) => ({ ...prev, buttons: newButtons }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = "PUT";
      const url = "/api/v1/admin/hero";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update hero data");
      }

      const updatedData = await response.json();
      setFormData(updatedData);
      addToast({
        title: "Success",
        description: "Hero section updated successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "An error occurred while updating the hero section.",
        color: "danger",
      });
    }
  };

  useEffect(() => {
    const desiredButtonCount =
      formData.buttonLayout === "oneButton"
        ? 1
        : formData.buttonLayout === "twoButtons"
          ? 2
          : 0;

    if (formData.buttons.length < desiredButtonCount) {
      const newButtons = [...formData.buttons];
      for (let i = formData.buttons.length; i < desiredButtonCount; i++) {
        newButtons.push({
          buttonText: "",
          buttonLink: "",
          isExternal: false,
          variant: "primary",
          heroId: formData.id || "", // Assign heroId if formData.id exists
        } as HeroButton);
      }
      setFormData((prev) => ({ ...prev, buttons: newButtons }));
    } else if (formData.buttons.length > desiredButtonCount) {
      const newButtons = formData.buttons.slice(0, desiredButtonCount);
      setFormData((prev) => ({ ...prev, buttons: newButtons }));
    }
  }, [formData.buttonLayout]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardBody>
        <h1 className="text-xl font-semibold mb-4">Manage Hero Section</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Title"
            value={formData.title}
            onValueChange={(value) => handleFormChange("title", value)}
          />
          <Textarea
            label="Paragraph"
            value={formData.paragraph}
            onValueChange={(value) => handleFormChange("paragraph", value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Image
            </label>
            <ImageUploader
              images={formData.heroImageUrl ? [formData.heroImageUrl] : []}
              onChange={(newImages) => {
                handleFormChange(
                  "heroImageUrl",
                  newImages.length > 0 ? newImages[newImages.length - 1] : ""
                );
              }}
            />
          </div>
          <Select
            label="Button Layout"
            selectedKeys={[formData.buttonLayout]}
            onSelectionChange={(keys) =>
              handleFormChange("buttonLayout", Array.from(keys)[0])
            }
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

          {formData.buttons.map((button, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <h3 className="font-semibold">Button {index + 1}</h3>
              <Input
                label="Button Text"
                value={button.buttonText}
                onValueChange={(value) =>
                  handleButtonChange(index, "buttonText", value)
                }
              />
              <Input
                label="Button Link"
                value={button.buttonLink}
                onValueChange={(value) =>
                  handleButtonChange(index, "buttonLink", value)
                }
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`button-isExternal-${index}`}
                  checked={button.isExternal}
                  onChange={(e) =>
                    handleButtonChange(index, "isExternal", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <label htmlFor={`button-isExternal-${index}`}>
                  External Link
                </label>
              </div>
              <Select
                label="Variant"
                selectedKeys={[button.variant]}
                onSelectionChange={(keys) =>
                  handleButtonChange(index, "variant", Array.from(keys)[0])
                }
              >
                <SelectItem key="primary" value="primary">
                  Primary
                </SelectItem>
                <SelectItem key="secondary" value="secondary">
                  Secondary
                </SelectItem>
              </Select>
            </div>
          ))}

          <Button type="submit">Save Changes</Button>
        </form>
      </CardBody>
    </Card>
  );
};
