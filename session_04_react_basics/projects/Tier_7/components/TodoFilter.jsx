function TodoFilter({ filter, setFilter }) {
  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'active', label: 'Chưa xong' },
    { key: 'completed', label: 'Hoàn thành' }
  ];

  return (
    <div style={styles.filterGroup}>
      {filters.map(f => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          style={{
            ...styles.filterBtn,
            background: filter === f.key ? '#3498db' : '#f0f0f0',
            color: filter === f.key ? 'white' : '#333'
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  filterGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  filterBtn: {
    flex: 1,
    padding: '8px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s'
  }
};

export default TodoFilter;