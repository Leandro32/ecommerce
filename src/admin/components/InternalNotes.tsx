'use client';

import React, { useState } from 'react';
import { Button, Textarea } from '@heroui/react';

interface InternalNotesProps {
  orderId: string;
}

const InternalNotes: React.FC<InternalNotesProps> = ({ orderId }) => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>([]); // Placeholder for notes

  const handleAddNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote('');
      // In a real application, you would send this note to a backend API
      console.log(`Adding note for order ${orderId}: ${note}`);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Internal Notes</h3>
      <div className="space-y-3 mb-4">
        {notes.length === 0 ? (
          <p className="text-default-500">No internal notes yet.</p>
        ) : (
          notes.map((n, index) => (
            <div key={index} className="bg-default-100 p-3 rounded-lg text-sm">
              {n}
            </div>
          ))
        )}
      </div>
      <Textarea
        label="Add a new note"
        placeholder="Type your note here..."
        value={note}
        onValueChange={setNote}
        className="mb-3"
      />
      <Button color="primary" onPress={handleAddNote} isDisabled={!note.trim()}>
        Add Note
      </Button>
    </div>
  );
};

export default InternalNotes;
