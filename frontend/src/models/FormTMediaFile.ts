import { TMediaFile } from "./TMediaFile";

// Form-specific types
export interface FormTMediaFile extends Omit<TMediaFile, 'id' | 'fileUrl'> {
  id?: number;
  file?: File | Blob; // New file to upload
  fileUrl?: string; // Existing file URL
  preview?: string; // Preview URL for display
  isExisting?: boolean; // Flag to identify existing files
}
