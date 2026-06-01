import { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import TodoFilter from './components/TodoFilter';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      done: false,
      createdAt: new Date().toLocaleString()
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const updateTodoText = (id, newText) => {
    if (newText.trim() === '') return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.done).length;
  const completedCount = todos.filter(todo => todo.done).length;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Todo List</h1>

      <div style={styles.inputGroup}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập công việc..."
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addBtn}>Thêm</button>
      </div>

      <TodoFilter filter={filter} setFilter={setFilter} />

      {filteredTodos.length === 0 ? (
        <div style={styles.empty}>
          {todos.length === 0 ? '📝 Chưa có công việc nào' : 'Không có công việc phù hợp'}
        </div>
      ) : (
        filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodoText}
          />
        ))
      )}

      {todos.length > 0 && (
        <div style={styles.footer}>
          <span>⚡ {activeCount} việc chưa hoàn thành</span>
          <span>✅ {completedCount} việc đã xong</span>
          <span>📊 Tổng: {todos.length}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50'
  },
  inputGroup: {
    display: 'flex',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '4px 0 0 4px',
    outline: 'none'
  },
  addBtn: {
    padding: '10px 20px',
    fontSize: '16px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '10px',
    background: '#f9f9f9',
    borderRadius: '4px',
    fontSize: '14px'
  }
};

export default App;