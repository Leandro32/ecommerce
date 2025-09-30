import React from "react";
import { Textarea, Button, Divider } from "@heroui/react";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Note {
  id: string | number;
  text: string;
  author: string;
  date: string;
}

interface InternalNotesProps {
  initialNotes: Note[];
}

export const InternalNotes: React.FC<InternalNotesProps> = ({ initialNotes }) => {
  const [notes, setNotes] = React.useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const note: Note = {
        id: Date.now(),
        text: newNote.trim(),
        author: "Admin User",
        date: new Date().toLocaleDateString()
      };
      
      setNotes([note, ...notes]);
      setNewNote("");
      
      addToast({
        title: "Note Added",
        description: "Your note has been added to the order",
        severity: "success"
      });
    } catch (error) {
      console.error("Error adding note:", error);
      addToast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        severity: "danger"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note about this order..."
          value={newNote}
          onValueChange={setNewNote}
          minRows={3}
        />
        <Button
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!newNote.trim() || isSubmitting}
          onPress={handleAddNote}
          startContent={<Icon icon="lucide:plus" />}
          className="w-full"
        >
          Add Note
        </Button>
      </div>
      
      <Divider />
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm mb-2">{note.text}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{note.author}</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};