export const handleSearchChange = (e, setSearchTerm, setFilteredItems, items = [], itemKey) => {
  const searchValue = e.target.value.toLowerCase();
  setSearchTerm(searchValue);

  if (!itemKey || typeof itemKey !== 'string') {
    console.error('Invalid itemKey:', itemKey);
    return;
  }

  if (!items || !Array.isArray(items)) {
    console.error('Items is null or not an array:', items);
    return;
  }

  if (searchValue === '') {
    setFilteredItems(items);
  } else {
    const filtered = items.filter(item => {
      const itemValue = item[itemKey];
      return itemValue && typeof itemValue === 'string' && itemValue.toLowerCase().includes(searchValue);
    });
    setFilteredItems(filtered);
  }
};
