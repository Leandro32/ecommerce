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
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useFragranceNotes, useDeleteFragranceNote } from "@/hooks/queries/useFragranceNoteHooks";
import { FragranceNote } from "@/types/fragrance";

export const FragranceNotesListPage: React.FC = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFragranceNote, setSelectedFragranceNote] = React.useState<FragranceNote | null>(null);
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const debouncedFilterValue = useDebounce(filterValue, 300);

  const rowsPerPage = 10;

  const { data, isLoading } = useFragranceNotes({
    page,
    limit: rowsPerPage,
    query: debouncedFilterValue,
  });
  const { mutate: deleteFragranceNote } = useDeleteFragranceNote();

  const fragranceNotes = data?.fragranceNotes || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = () => {
    if (!selectedFragranceNote) return;
    deleteFragranceNote(selectedFragranceNote.id);
    onClose();
  };

  const openDeleteModal = (note: FragranceNote) => {
    setSelectedFragranceNote(note);
    onOpen();
  };

  const handleRowClick = (noteId: string) => {
    router.push(`/admin/fragrance-notes/${noteId}/edit`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fragrance Notes</h1>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          as={Link}
          href="/admin/fragrance-notes/new"
        >
          New Fragrance Note
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

          <Table aria-label="Fragrance Notes table">
            <TableHeader>
              <TableColumn>IMAGE</TableColumn>
              <TableColumn>NAME</TableColumn>
              <TableColumn>COLOR</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}
              emptyContent={!isLoading && "No fragrance notes found."}
            >
              {fragranceNotes.map((note: FragranceNote) => (
                <TableRow
                  key={note.id}
                  className="cursor-pointer hover:bg-default-100"
                  onClick={() => handleRowClick(note.id)}
                >
                  <TableCell>
                    {note.imageUrl ? (
                      <img src={note.imageUrl} alt={note.name} className="w-10 h-10 object-cover rounded-md" />
                    ) : (
                      <div className="w-10 h-10 bg-default-200 rounded-md flex items-center justify-center">
                        <Icon icon="lucide:image-off" className="text-default-500" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{note.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: note.color }}
                      ></div>
                      {note.color}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Button
                        as={Link}
                        href={`/admin/fragrance-notes/${note.id}/edit`}
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
                        onPress={(e) => { e.stopPropagation(); openDeleteModal(note); }}
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
              total={totalPages}
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
              Are you sure you want to delete the fragrance note "{selectedFragranceNote?.name}"?
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