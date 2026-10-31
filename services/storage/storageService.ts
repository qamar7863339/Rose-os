import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export interface UploadResult {
  storagePath: string;
  downloadUrl: string;
  sizeBytes: number;
}

export const StorageService = {
  /**
   * Uploads a document to Firebase Storage within the workspace boundary
   */
  async uploadDocumentFile(
    workspaceId: string,
    documentId: string,
    file: File | Blob,
    filename: string
  ): Promise<UploadResult> {
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `workspaces/${workspaceId}/documents/${documentId}/${sanitizedFilename}`;
    const fileRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(fileRef, file, {
      customMetadata: {
        workspaceId,
        documentId,
        uploadedAt: new Date().toISOString(),
      },
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      storagePath,
      downloadUrl,
      sizeBytes: snapshot.metadata.size,
    };
  },

  /**
   * Deletes a document from Firebase Storage
   */
  async deleteDocumentFile(storagePath: string): Promise<void> {
    if (!storagePath) return;
    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    } catch (err) {
      console.warn('Storage deletion notice:', err);
    }
  },
};
