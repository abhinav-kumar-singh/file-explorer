import { useReducer } from 'react';
import { FileNode, FileAction } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateId = () => uuidv4();

const initialFiles: FileNode[] = [
  {
    id: generateId(),
    name: 'Documents',
    type: 'folder',
    isOpen: false,
    parentId: null,
    children: [
      {
        id: generateId(),
        name: 'Work',
        type: 'folder',
        isOpen: false,
        parentId: null,
        children: [
          {
            id: generateId(),
            name: 'Project Proposal.txt',
            type: 'file',
            parentId: null,
          },
          {
            id: generateId(),
            name: 'Meeting Notes.txt',
            type: 'file',
            parentId: null,
          }
        ]
      },
      {
        id: generateId(),
        name: 'Resume.pdf',
        type: 'file',
        parentId: null,
      }
    ]
  },
  {
    id: generateId(),
    name: 'Pictures',
    type: 'folder',
    isOpen: false,
    parentId: null,
    children: [
      {
        id: generateId(),
        name: 'Vacation.jpg',
        type: 'file',
        parentId: null,
      },
      {
        id: generateId(),
        name: 'Family',
        type: 'folder',
        isOpen: false,
        parentId: null,
        children: []
      }
    ]
  },
  {
    id: generateId(),
    name: 'config.json',
    type: 'file',
    parentId: null,
  }
];

const toggleFolder = (files: FileNode[], id: string): FileNode[] => {
  return files.map(file => {
    if (file.id === id && file.type === 'folder') {
      return { ...file, isOpen: !file.isOpen };
    } else if (file.children) {
      return { ...file, children: toggleFolder(file.children, id) };
    }
    return file;
  });
};

const addItem = (files: FileNode[], parentId: string | null, newItem: FileNode): FileNode[] => {
  if (parentId === null) {
    return [...files, newItem];
  }

  return files.map(file => {
    if (file.id === parentId && file.type === 'folder') {
      return {
        ...file,
        children: [...(file.children || []), { ...newItem, parentId }]
      };
    } else if (file.children) {
      return {
        ...file,
        children: addItem(file.children, parentId, newItem)
      };
    }
    return file;
  });
};

const deleteItem = (files: FileNode[], id: string): FileNode[] => {
  return files.filter(file => file.id !== id)
    .map(file => {
      if (file.children) {
        return {
          ...file,
          children: deleteItem(file.children, id)
        };
      }
      return file;
    });
};

const renameItem = (files: FileNode[], id: string, newName: string): FileNode[] => {
  return files.map(file => {
    if (file.id === id) {
      return { ...file, name: newName };
    } else if (file.children) {
      return {
        ...file,
        children: renameItem(file.children, id, newName)
      };
    }
    return file;
  });
};

const filesReducer = (state: FileNode[], action: FileAction): FileNode[] => {
  switch (action.type) {
    case 'TOGGLE_FOLDER':
      return toggleFolder(state, action.id);
    case 'ADD_ITEM': {
      const newItem = {
        ...action.item,
        id: generateId(),
        parentId: action.parentId
      };
      return addItem(state, action.parentId, newItem);
    }
    case 'DELETE_ITEM':
      return deleteItem(state, action.id);
    case 'RENAME_ITEM':
      return renameItem(state, action.id, action.name);
    default:
      return state;
  }
};

export const useFileExplorer = () => {
  const [files, dispatch] = useReducer(filesReducer, initialFiles);

  // Helper functions that dispatch actions
  const toggleNodeOpen = (id: string) => {
    dispatch({ type: 'TOGGLE_FOLDER', id });
  };

  const addNode = (parentId: string | null, name: string, type: 'file' | 'folder') => {
    const newItem: FileNode = {
      id: '', // Will be generated in reducer
      name,
      type,
      parentId,
      ...(type === 'folder' ? { isOpen: false, children: [] } : {})
    };
    dispatch({ type: 'ADD_ITEM', parentId, item: newItem });
  };

  const deleteNode = (id: string) => {
    dispatch({ type: 'DELETE_ITEM', id });
  };

  const renameNode = (id: string, name: string) => {
    dispatch({ type: 'RENAME_ITEM', id, name });
  };

  return {
    files,
    toggleNodeOpen,
    addNode,
    deleteNode,
    renameNode
  };
};