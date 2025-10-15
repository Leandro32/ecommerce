
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FragranceNote } from '@/types/fragrance';
import { apiClient } from '@/lib/apiClient';
import { addToast } from '@heroui/react';

// Interface for query filters
interface FragranceNoteFilters {
  page?: number;
  limit?: number;
  query?: string;
}

// --- Query Hooks ---

// Fetch paginated fragrance notes
const fetchFragranceNotes = async (filters: FragranceNoteFilters): Promise<{ fragranceNotes: FragranceNote[], totalPages: number }> => {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.query) params.append('query', filters.query);
  return apiClient.get(`/api/v1/admin/fragrance-notes?${params.toString()}`);
};

export const useFragranceNotes = (filters: FragranceNoteFilters) => {
  return useQuery<{ fragranceNotes: FragranceNote[], totalPages: number }, Error>({
    queryKey: ['fragranceNotes', filters],
    queryFn: () => fetchFragranceNotes(filters),
    keepPreviousData: true,
  });
};

// Fetch a single fragrance note by ID
const fetchFragranceNoteById = async (id: string): Promise<FragranceNote> => {
  return apiClient.get(`/api/v1/admin/fragrance-notes/${id}`);
};

export const useFragranceNote = (id: string) => {
  return useQuery<FragranceNote, Error>({
    queryKey: ['fragranceNote', id],
    queryFn: () => fetchFragranceNoteById(id),
    enabled: !!id, // Only run query if id is available
  });
};

// --- Mutation Hooks ---

// Create a new fragrance note
export const useAddFragranceNote = () => {
  const queryClient = useQueryClient();
  return useMutation<FragranceNote, Error, Omit<FragranceNote, 'id' | 'slug' | 'createdAt' | 'updatedAt'>>({
    mutationFn: (newNote) => apiClient.post('/api/v1/admin/fragrance-notes', newNote),
    onSuccess: () => {
      addToast({ title: 'Success', description: 'Fragrance note created successfully.', color: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fragranceNotes'] });
    },
    onError: (error) => {
      addToast({ title: 'Error', description: error.message || 'Failed to create fragrance note.', color: 'danger' });
    }
  });
};

// Update an existing fragrance note
export const useUpdateFragranceNote = () => {
  const queryClient = useQueryClient();
  return useMutation<FragranceNote, Error, Partial<FragranceNote> & { id: string }>({
    mutationFn: (updatedNote) => apiClient.put(`/api/v1/admin/fragrance-notes/${updatedNote.id}`, updatedNote),
    onSuccess: (data) => {
      addToast({ title: 'Success', description: 'Fragrance note updated successfully.', color: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fragranceNotes'] });
      queryClient.invalidateQueries({ queryKey: ['fragranceNote', data.id] });
    },
    onError: (error) => {
      addToast({ title: 'Error', description: error.message || 'Failed to update fragrance note.', color: 'danger' });
    }
  });
};

// Delete a fragrance note
export const useDeleteFragranceNote = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: (id: string) => apiClient.delete(`/api/v1/admin/fragrance-notes/${id}`),
    onSuccess: () => {
      addToast({ title: 'Success', description: 'Fragrance note deleted successfully.', color: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fragranceNotes'] });
    },
    onError: (error) => {
      addToast({ title: 'Error', description: error.message || 'Failed to delete fragrance note.', color: 'danger' });
    }
  });
};
