export interface BufferedFile {
  fieldName: string;
  originalName: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer;
}

export interface StoredFile extends HasFile, StoredFileMetadate {}

export interface HasFile {
  file: Buffer | string;
}

export interface StoredFileMetadate {
  id: string;
  name: string;
  encoding: string;
  mimeType: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export type AppMimeType = 'image/png' | 'image/jpeg';
