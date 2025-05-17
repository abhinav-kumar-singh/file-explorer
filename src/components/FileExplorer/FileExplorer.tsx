import React, { useState } from 'react';
import { useFileExplorer } from '../../hooks/useFileExplorer';
import { FileNode } from '../../types';
import Node from '../Node/Node';
import styles from './FileExplorer.module.css';
import { FolderPlus, FilePlus } from 'lucide-react';

const FileExplorer = ():JSX.Element => {
  const { files, toggleNodeOpen, addNode, deleteNode, renameNode } = useFileExplorer();
  const [showAddRoot, setShowAddRoot] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('folder');

  const handleAddRootItem = () => {
    if (!newItemName.trim()) {
      return;
    }
    
    addNode(null, newItemName, newItemType);
    setNewItemName('');
    setShowAddRoot(false);
  };

  const renderNodes = (nodes: FileNode[], level: number = 0) => {
    return nodes.map((node) => (
      <Node
        key={node.id}
        node={node}
        level={level}
        onToggle={toggleNodeOpen}
        onDelete={deleteNode}
        onRename={renameNode}
        onAddChild={addNode}
      >
        {node.children && node.isOpen ? 
          renderNodes(node.children, level + 1) : null
        }
      </Node>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>File Explorer</h1>
        <button 
          className={styles.addRootButton}
          onClick={() => setShowAddRoot(true)}
        >
          <FolderPlus size={16} />
          Add Item
        </button>
      </div>

      <div className={styles.fileExplorer}>
        {showAddRoot ? (
          <div className={styles.addRootContainer}>
            <input
              className={styles.addRootInput}
              type="text"
              placeholder="Enter name..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddRootItem();
                if (e.key === 'Escape') setShowAddRoot(false);
              }}
            />
            <div className={styles.addRootActions}>
              <button 
                className={styles.saveButton}
                onClick={() => setNewItemType('folder')}
                style={{ 
                  backgroundColor: newItemType === 'folder' ? '#4a7bff' : '#e0e4e8',
                  color: newItemType === 'folder' ? 'white' : '#4a5568'
                }}
              >
                <FolderPlus size={16} />
              </button>
              <button 
                onClick={() => setNewItemType('file')}
                style={{ 
                  backgroundColor: newItemType === 'file' ? '#4a7bff' : '#e0e4e8',
                  color: newItemType === 'file' ? 'white' : '#4a5568'
                }}
              >
                <FilePlus size={16} />
              </button>
              <button 
                className={styles.saveButton} 
                onClick={handleAddRootItem}
              >
                Save
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowAddRoot(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
        
        {files.length > 0 ? (
          renderNodes(files)
        ) : (
          <div className={styles.noFiles}>
            No files or folders. Click "Add Item" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;