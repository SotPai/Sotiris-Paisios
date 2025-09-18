// DOM Elements
const itemInput = document.getElementById('itemInput');
const insertBtn = document.getElementById('insertBtn');
const deleteBtn = document.getElementById('deleteBtn');
const todoListContainer = document.getElementById('todoListContainer');

// Load items from localStorage
let items = JSON.parse(localStorage.getItem('groceryList')) || [];

// Render all items
function renderList() {
  todoListContainer.innerHTML = '';

  items.forEach((text, index) => {
    const row = document.createElement('div');
    row.className = 'item-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'item-checkbox';
    checkbox.dataset.index = index;

    const label = document.createElement('div');
    label.className = 'item-text';
    label.textContent = text;

    // Restore completed state
    if (checkbox.checked) {
      label.classList.add('completed');
    }

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.classList.add('completed');
      } else {
        label.classList.remove('completed');
      }
    });

    // Double-tap to edit (move to input and remove from list)
    let tapTimer = null;
    label.addEventListener('click', () => {
      if (!tapTimer) {
        // First tap
        tapTimer = setTimeout(() => {
          tapTimer = null;
        }, 300);
      } else {
        // Double tap detected
        clearTimeout(tapTimer);
        tapTimer = null;

        // Move item to input field
        itemInput.value = text;
        itemInput.focus();

        // Remove from list
        items.splice(index, 1);
        renderList();
      }
    });

    row.appendChild(checkbox);
    row.appendChild(label);
    todoListContainer.appendChild(row);
  });

  // Save to localStorage
  localStorage.setItem('groceryList', JSON.stringify(items));
}

// Initial render
renderList();

// Insert: Add new item
insertBtn.addEventListener('click', () => {
  const value = itemInput.value.trim();
  if (value) {
    items.push(value);
    itemInput.value = '';
    renderList();
  }
});

// Press Enter to insert
itemInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    insertBtn.click();
  }
});

// Delete: Remove all checked items
deleteBtn.addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('.item-checkbox');
  const indicesToRemove = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      indicesToRemove.push(parseInt(cb.dataset.index));
    }
  });

  // Remove from last to first to avoid index shift
  indicesToRemove.sort((a, b) => b - a).forEach(index => {
    items.splice(index, 1);
  });

  renderList();
});