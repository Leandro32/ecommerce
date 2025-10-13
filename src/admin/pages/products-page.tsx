import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useProducts } from "../../hooks/queries/useProducts";
import { useDeleteProduct } from "../../hooks/queries/useProductMutations";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
}

export const ProductListPage: React.FC = () => {
  const { data: products, isLoading } = useProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [filterValue, setFilterValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [products, filterValue]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  const handleDelete = () => {
    if (!selectedProduct) return;
    deleteProduct(selectedProduct.id);
    onClose();
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          as={Link}
          href="/admin/products/new"
        >
          New Product
        </Button>
      </div>

      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by name..."
              startContent={<Icon icon="lucide:search" />}
              value={filterValue}
              onClear={() => setFilterValue("")}
              onValueChange={setFilterValue}
            />
          </div>

          <Table aria-label="Products table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>STOCK</TableColumn>
              <TableColumn>CREATED AT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}
              emptyContent={!isLoading && "No products found."}
            >
              {items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Button
                        as={Link}
                        href={`/admin/products/${product.id}/edit`}
                        size="sm"
                        variant="flat"
                        color="primary"
                        isIconOnly
                      >
                        <Icon icon="lucide:edit" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => openDeleteModal(product)}
                      >
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="py-4 px-2 flex justify-between items-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirm Deletion
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete the product "
              {selectedProduct?.name}"?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" color="default" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
