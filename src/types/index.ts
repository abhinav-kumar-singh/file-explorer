export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  isOpen?: boolean;
  children?: FileNode[];
  parentId: string | null;
}

export type FileAction = 
  | { type: 'TOGGLE_FOLDER'; id: string }
  | { type: 'ADD_ITEM'; parentId: string | null; item: FileNode }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'RENAME_ITEM'; id: string; name: string };