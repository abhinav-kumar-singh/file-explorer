import React, { useState, useRef, useEffect } from 'react';
import { FileNode } from '../../types';
import styles from './Node.module.css';
import { 
  File, 
  Folder, 
  FolderOpen, 
  Trash2, 
  Edit2, 
  Plus, 
  FolderPlus, 
  FilePlus, 
  Check, 
  X 
} from 'lucide-react';

interface NodeProps {
  node: FileNode;
  level: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onAddChild: (parentId: string | null, name: string, type: 'file' | 'folder') => void;
  children?: React.ReactNode;
}

const Node: React.FC<NodeProps> = ({
  node,
  level,
  onToggle,
  onDelete,
  onRename,
  onAddChild,
  children
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('folder');
  
  const renameInputRef = useRef<HTMLInputElement>(null);
  const addItemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (isAddingItem && addItemInputRef.current) {
      addItemInputRef.current.focus();
    }
  }, [isAddingItem]);

  const handleRenameSubmit = () => {
    if (!newName.trim()) {
      setNameError('Name cannot be empty');
      return;
    }
    
    setNameError(null);
    onRename(node.id, newName);
    setIsRenaming(false);
  };

  const handleCancelRename = () => {
    setNewName(node.name);
    setNameError(null);
    setIsRenaming(false);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      return;
    }
    
    onAddChild(node.id, newItemName, newItemType);
    setNewItemName('');
    setIsAddingItem(false);
    
    // If adding to a folder, make sure it's open
    if (node.type === 'folder' && !node.isOpen) {
      onToggle(node.id);
    }
  };

  const renderIcon = () => {
    if (node.type === 'folder') {
      return node.isOpen ? (
        <FolderOpen className={`${styles.icon} ${styles.folderIcon}`} size={18} />
      ) : (
        <Folder className={`${styles.icon} ${styles.folderIcon}`} size={18} />
      );
    } else {
      return <File className={`${styles.icon} ${styles.fileIcon}`} size={18} />;
    }
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      onToggle(node.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isRenaming) {
      if (e.key === 'Enter') {
        handleRenameSubmit();
      } else if (e.key === 'Escape') {
        handleCancelRename();
      }
    } else if (isAddingItem) {
      if (e.key === 'Enter') {
        handleAddItem();
      } else if (e.key === 'Escape') {
        setIsAddingItem(false);
      }
    }
  };

  return (
    <>
      <div 
        className={styles.node}
        style={{ marginLeft: `${level * 16}px` }}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.nodeContent} onClick={handleNodeClick}>
          {renderIcon()}
          
          <div className={styles.nameContainer}>
            {isRenaming ? (
              <>
                <input
                  ref={renameInputRef}
                  type="text"
                  className={styles.nameInput}
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (e.target.value.trim()) {
                      setNameError(null);
                    }
                  }}
                  onBlur={handleRenameSubmit}
                  onKeyDown={handleKeyDown}
                />
                {nameError && <span className={styles.errorMsg}>{nameError}</span>}
              </>
            ) : (
              <span className={styles.name}>{node.name}</span>
            )}
          </div>
        </div>
        
        {!isRenaming && (
          <div className={styles.actions}>
            <button 
              className={`${styles.actionButton} ${styles.rename}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              aria-label="Rename"
            >
              <Edit2 size={16} />
            </button>
            
            {node.type === 'folder' && (
              <button 
                className={`${styles.actionButton} ${styles.add}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingItem(true);
                }}
                aria-label="Add item"
              >
                <Plus size={16} />
              </button>
            )}
            
            <button 
              className={`${styles.actionButton} ${styles.delete}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      {isAddingItem && node.type === 'folder' && (
        <div 
          className={styles.addItemContainer} 
          style={{ marginLeft: `${(level + 1) * 16}px` }}
        >
          <input
            ref={addItemInputRef}
            className={styles.addItemInput}
            type="text"
            placeholder="Enter name..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className={styles.addItemActions}>
            <button 
              className={`${styles.addItemTypeButton} ${newItemType === 'folder' ? styles.active : ''}`}
              onClick={() => setNewItemType('folder')}
              title="Folder"
            >
              <FolderPlus size={16} />
            </button>
            <button 
              className={`${styles.addItemTypeButton} ${newItemType === 'file' ? styles.active : ''}`}
              onClick={() => setNewItemType('file')}
              title="File"
            >
              <FilePlus size={16} />
            </button>
            <button 
              className={styles.addItemSaveButton}
              onClick={handleAddItem}
            >
              <Check size={16} />
            </button>
            <button 
              className={styles.addItemCancelButton}
              onClick={() => setIsAddingItem(false)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {children && (
        <div className={styles.childrenContainer}>
          {children}
        </div>
      )}
    </>
  );
};

export default Node;