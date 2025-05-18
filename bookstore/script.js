// Admin credentials
const ADMIN_USERNAME = "admin"; // Hardcoded admin username
const ADMIN_PASSWORD = "password123"; // Hardcoded admin password

// State variables
let books = [
  // Initial list of books available in the store
  {
    id: 1,
    name: "Atomic Habits",
    price: 20,
    description: "A guide to building good habits.",
  },
  {
    id: 2,
    name: "The Alchemist",
    price: 15,
    description: "A novel about dreams and destiny.",
  },
  {
    id: 3,
    name: "Clean Code",
    price: 30,
    description: "A handbook of agile software craftsmanship.",
  },
];

let cart = {}; // Object to hold cart items keyed by book id
let isAdminLoggedIn = false; // Flag to track if admin is logged in

// Elements
const tabs = document.querySelectorAll(".tab"); // All tab buttons for switching views
const tabContents = document.querySelectorAll(".tab-content"); // All tab content containers
const bookListEl = document.getElementById("book-list"); // Container element to show book list
const searchInput = document.getElementById("search-input"); // Search input box element
const addBookForm = document.getElementById("add-book-form"); // Form element for adding books
const cartItemsEl = document.getElementById("cart-items"); // Container to show cart items
const totalPriceEl = document.getElementById("total-price"); // Element to display total cart price
const adminPanelEl = document.getElementById("admin-panel"); // Admin panel container element
const loginFormEl = document.getElementById("login-form"); // Admin login form element
const logoutBtn = document.getElementById("logout-btn"); // Logout button element
const cartCountBadge = document.getElementById("cart-count-badge"); // Badge showing total cart item count

// Switch tabs functionality
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // When any tab is clicked
    tabs.forEach((t) => t.classList.remove("active")); // Remove 'active' class from all tabs
    tab.classList.add("active"); // Add 'active' class to clicked tab

    const selected = tab.getAttribute("data-tab"); // Get data-tab attribute of clicked tab
    tabContents.forEach((content) => {
      // For each tab content section
      content.style.display = content.id === selected ? "block" : "none"; // Show matching content only
    });

    // If store tab selected, focus on search input box
    if (selected === "store") {
      searchInput.focus();
    }
  });
});

// Function to render book list with optional filter string
function renderBooks(filter = "") {
  bookListEl.innerHTML = ""; // Clear existing book list

  // Filter books by name or description matching the filter (case-insensitive)
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(filter.toLowerCase()) ||
      book.description.toLowerCase().includes(filter.toLowerCase())
  );

  // Show message if no books found after filtering
  if (filteredBooks.length === 0) {
    bookListEl.innerHTML = "<p>No books found.</p>";
    return;
  }

  // For each filtered book, create its HTML representation
  filteredBooks.forEach((book) => {
    const quantityInCart = cart[book.id]?.quantity || 0; // Get quantity in cart, 0 if none

    const bookEl = document.createElement("div"); // Create container div for the book
    bookEl.className = "book"; // Add class "book"

    // Set inner HTML including book info and either "Add to Cart" button or counter buttons
    bookEl.innerHTML = `
      <div class="book-info">
        <div class="book-name">${book.name}</div>
        <div class="book-desc">${book.description}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
      </div>
      <div class="counter-container">
        ${
          quantityInCart === 0
            ? `<button class="add-to-cart-btn" data-id="${book.id}">Add to Cart</button>` // Show Add button if quantity is 0
            : `<button class="btn-decrement" data-id="${book.id}">-</button>              
               <span class="quantity-value">${quantityInCart}</span>                    
               <button class="btn-increment" data-id="${book.id}">+</button>`
        }
      </div>
    `;

    bookListEl.appendChild(bookEl); // Append book element to the list container
  });

  // Add event listeners for newly created Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id")); // Get book id from button data attribute
      cart[id] = { ...books.find((b) => b.id === id), quantity: 1 }; // Add book to cart with quantity 1
      renderBooks(filter); // Re-render books to update UI
      renderCart(); // Update cart display
    });
  });

  // Add event listeners for increment buttons (+)
  document.querySelectorAll(".btn-increment").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id")); // Get book id
      if (cart[id]) {
        // If book is in cart
        cart[id].quantity += 1; // Increase quantity by 1
        renderBooks(filter); // Update book list UI
        renderCart(); // Update cart UI
      }
    });
  });

  // Add event listeners for decrement buttons (-)
  document.querySelectorAll(".btn-decrement").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id")); // Get book id
      if (cart[id]) {
        // If book in cart
        cart[id].quantity -= 1; // Decrease quantity by 1
        if (cart[id].quantity <= 0) {
          // If quantity is zero or less
          delete cart[id]; // Remove book from cart
        }
        renderBooks(filter); // Update UI for books
        renderCart(); // Update cart UI
      }
    });
  });
}

// Function to add a book to cart or increase quantity if already in cart
function addToCart(bookId) {
  if (cart[bookId]) {
    // If book already in cart
    cart[bookId].quantity += 1; // Increase quantity
  } else {
    const book = books.find((b) => b.id === bookId); // Find book by id
    if (book) {
      cart[bookId] = { ...book, quantity: 1 }; // Add new book with quantity 1
    }
  }
  renderCart(); // Update cart UI
}

// Function to render cart items and total price
function renderCart() {
  cartItemsEl.innerHTML = ""; // Clear current cart display
  const cartEntries = Object.values(cart); // Get array of cart item objects

  // If cart is empty, show empty message and hide badge
  if (cartEntries.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceEl.textContent = "0.00";
    cartCountBadge.style.display = "none"; // Hide badge when empty
    cartCountBadge.textContent = "0"; // Reset badge count
    return;
  }

  let total = 0; // Total price accumulator
  let totalItems = 0; // Total quantity accumulator

  // Loop through cart items to display and calculate totals
  cartEntries.forEach((item) => {
    total += item.price * item.quantity; // Add item total to price sum
    totalItems += item.quantity; // Add quantity to total items count

    const cartItemEl = document.createElement("div"); // Create element for cart item
    cartItemEl.className = "cart-item"; // Add class

    cartItemEl.innerHTML = `
      <span class="cart-item-name">${item.name} x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `; // Show name, qty, and total price

    cartItemsEl.appendChild(cartItemEl); // Add cart item element to container
  });

  totalPriceEl.textContent = total.toFixed(2); // Show total cart price
  cartCountBadge.textContent = totalItems; // Update badge with total items count
  cartCountBadge.style.display = "flex"; // Show badge
}

// Handle adding new book via admin form submission
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form default submit (page reload)
  if (!isAdminLoggedIn) {
    // Check if admin is logged in
    alert("You must be logged in as admin to add books."); // Show alert if not
    return; // Stop further execution
  }

  const name = document.getElementById("book-name").value.trim(); // Get trimmed book name
  const price = parseFloat(document.getElementById("book-price").value); // Parse book price as float
  const description = document.getElementById("book-desc").value.trim(); // Get trimmed description

  // Validate inputs: all must be non-empty and price a valid non-negative number
  if (!name || !description || isNaN(price) || price < 0) {
    alert("Please fill all fields correctly."); // Show error alert
    return;
  }

  // Create new book object with new id (incremented)
  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1, // New id
    name,
    price,
    description,
  };

  books.push(newBook); // Add new book to books array
  renderBooks(searchInput.value); // Re-render book list (with current search filter)
  addBookForm.reset(); // Reset the add book form inputs

  alert("Book added successfully!"); // Notify admin of success
});

// Search filter input event: re-render book list on input change
searchInput.addEventListener("input", () => {
  renderBooks(searchInput.value); // Render books filtered by current input value
});

// Admin login form submission
loginFormEl.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload

  const username = document.getElementById("username").value.trim(); // Get entered username
  const password = document.getElementById("password").value; // Get entered password

  // Check if entered credentials match admin credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    isAdminLoggedIn = true; // Set admin logged-in flag
    alert("Login successful!"); // Notify success
    loginFormEl.style.display = "none"; // Hide login form
    adminPanelEl.style.display = "block"; // Show admin panel
    loginFormEl.reset(); // Clear login form fields
  } else {
    alert("Invalid username or password."); // Notify failure
  }
});

// Logout button click event
logoutBtn.addEventListener("click", () => {
  isAdminLoggedIn = false; // Reset admin login flag
  adminPanelEl.style.display = "none"; // Hide admin panel
  loginFormEl.style.display = "block"; // Show login form again
});

// Initial rendering of UI on page load
renderBooks(); // Render all books initially (no filter)
renderCart(); // Render cart (initially empty)
