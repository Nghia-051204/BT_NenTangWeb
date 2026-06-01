import { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim() !== '') {
      onUpdate(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <div style={styles.itemContainer}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        style={styles.checkbox}
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={styles.editInput}
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          style={{
            flex: 1,
            textDecoration: todo.done ? 'line-through' : 'none',
            color: todo.done ? '#999' : '#333',
            cursor: 'pointer'
          }}
        >
          {todo.text}
          <span style={styles.date}> ({todo.createdAt || 'vừa xong'})</span>
        </span>
      )}

      <button onClick={() => onDelete(todo.id)} style={styles.deleteBtn}>
        🗑
      </button>
    </div>
  );
}

const styles = {
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    margin: '5px 0',
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  checkbox: {
    marginRight: '12px',
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  editInput: {
    flex: 1,
    padding: '6px 8px',
    fontSize: '15px',
    border: '2px solid #3498db',
    borderRadius: '4px',
    outline: 'none',
    background: '#f0f8ff'
  },
  date: {
    fontSize: '11px',
    color: '#aaa',
    marginLeft: '8px'
  },
  deleteBtn: {
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px'
  }
};

export default TodoItem;