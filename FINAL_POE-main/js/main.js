document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#search');
  const items = document.querySelectorAll('.searchable-item');

  if (searchInput && items.length > 0) {
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase().trim();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
      });
    });
  }
});
