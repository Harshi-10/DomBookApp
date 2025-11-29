// app.js - DOM Book Management
const BOOK_IMAGE = 'https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg';


// Elements
const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const categoryInput = document.getElementById('category');
const booksGrid = document.getElementById('booksGrid');
const emptyMsg = document.getElementById('emptyMsg');
const sortAZBtn = document.getElementById('sortAZ');
const sortZABtn = document.getElementById('sortZA');
const filterSelect = document.getElementById('filter');

// State
let books = [];
let currentFilter = 'All';


// Initialize — try to load from localStorage so UI persists across reloads
function loadFromStorage(){
try{
const raw = localStorage.getItem('dombooks');
if(raw) books = JSON.parse(raw);
}catch(e){ books = []; }
}


function saveToStorage(){
localStorage.setItem('dombooks', JSON.stringify(books));
}


// Create book object from form
function createBookObject(title, author, category){
return { title: title.trim(), author: author.trim(), category, imageUrl: BOOK_IMAGE };
}

// Render functions
function renderBooks(){
// apply filter
const filtered = (currentFilter === 'All') ? books : books.filter(b => b.category === currentFilter);


booksGrid.innerHTML = '';
if(filtered.length === 0){
emptyMsg.style.display = 'block';
return;
}
emptyMsg.style.display = 'none';


filtered.forEach((book, idx) => {
const card = document.createElement('div');
card.className = 'book-card';


card.innerHTML = `
<img src="${book.imageUrl}" alt="book cover">
<div class="book-meta">
<h4>${escapeHtml(book.title)}</h4>
<p>Author: ${escapeHtml(book.author)}</p>
<p>Category: ${escapeHtml(book.category)}</p>
</div>
<div style="margin-top:auto;display:flex;gap:8px;justify-content:flex-end">
<button class="delete-btn" data-index="${idx}">Delete</button>
</div>
`;


// Delete handler: calculate actual index in `books` array
const delBtn = card.querySelector('.delete-btn');
delBtn.addEventListener('click', () => {
// Need to compute index of this book inside the *filtered* array
// We'll remove by unique combination of title+author+category+imageUrl at first match
removeBook(book);
});


booksGrid.appendChild(card);
});
}

function removeBook(bookToRemove){
const idx = books.findIndex(b => b.title === bookToRemove.title && b.author === bookToRemove.author && b.category === bookToRemove.category && b.imageUrl === bookToRemove.imageUrl);
if(idx === -1) return;
books.splice(idx,1);
saveToStorage();
renderBooks();
}


// Add book
bookForm.addEventListener('submit', (e) => {
e.preventDefault();
const title = titleInput.value;
const author = authorInput.value;
const category = categoryInput.value;


if(!title.trim() || !author.trim()) return;


const book = createBookObject(title, author, category);
books.push(book);
saveToStorage();
renderBooks();


bookForm.reset();
});


// Sort handlers
sortAZBtn.addEventListener('click', () => {
books.sort((a,b) => a.title.localeCompare(b.title, undefined, {sensitivity:'base'}));
saveToStorage();
renderBooks();
});


sortZABtn.addEventListener('click', () => {
books.sort((a,b) => b.title.localeCompare(a.title, undefined, {sensitivity:'base'}));
saveToStorage();
renderBooks();
});

// Filter handler
filterSelect.addEventListener('change', (e) => {
currentFilter = e.target.value;
renderBooks();
});


// helper: escape HTML to avoid injection in title/author
function escapeHtml(str){
return String(str).replace(/[&<>"']/g, function(m){
return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
});
}


// Initial boot
loadFromStorage();
renderBooks();