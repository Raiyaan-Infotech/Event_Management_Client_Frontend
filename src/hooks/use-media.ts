import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface UploadResult {
  url: string;
  filename: string;
}

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ file, folder = 'vendors' }: { file: File; folder?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await apiClient.post('/vendors/auth/upload', formData);

      return res.data.data.file as UploadResult;
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to upload image');
    },
  });
};
