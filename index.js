
document.addEventListener("DOMContentLoaded", initialise);
let allProducts = [];
let originalProducts = []; // Store original all products
let cart = [];
let previousListContent = ""; // Variable to store previous list content
let currentCategory = 'all'; // Variable to keep the current category
let favorites = [];

let previousListState = {
  content: '',
  categoryTitleDisplay: '',
  currentCategory: ''
};

function initialise() {
    // Show loading overlay
    document.getElementById('loading-overlay').style.display = 'flex';

    // Hide loading overlay after 3 seconds (adjust time as needed)
    setTimeout(() => {
      document.getElementById('loading-overlay').style.display = 'none';
    }, 3000);

  fetchCategories();
  fetchProducts();
  filterCategories();
  searchProduct();
  openCart();
  openFavorites(); // Initialize favorites functionality
  document.querySelector("#category-title-container").style.display = 'block';
  // Check ad visibility on page load
  updateAdContainerVisibility();
  // Add event listener for window resize
  window.addEventListener('resize', updateAdContainerVisibility);
}

async function fetchCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/category-list");
    const categories = await response.json();
    populateCategorySelect(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
async function populateCategorySelect(categories) {
  const categoriesContainer = document.createElement('div');
  categoriesContainer.className = 'categories-container';
  categoriesContainer.style.display = 'none'; // Initially hide the categories
  
  const categoriesCarousel = document.createElement('div');
  categoriesCarousel.className = 'categories-carousel';
  
  categories.unshift('all');

  for (const category of categories) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.onclick = () => filterProducts(category);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'category-image';
    
    const image = document.createElement('img');
    image.src = await getCategoryImage(category);
    image.alt = category;

    const name = document.createElement('p');
    name.textContent = category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

    imageContainer.appendChild(image);
    categoryElement.appendChild(imageContainer);
    categoryElement.appendChild(name);
    categoriesCarousel.appendChild(categoryElement);
  }
  

  const leftArrow = document.createElement('button');
  leftArrow.className = 'carousel-arrow left';
  leftArrow.innerHTML = '&#10094;';
  leftArrow.onclick = () => scrollCarousel(-1);

  const rightArrow = document.createElement('button');
  rightArrow.className = 'carousel-arrow right';
  rightArrow.innerHTML = '&#10095;';
  rightArrow.onclick = () => scrollCarousel(1);

  categoriesContainer.appendChild(leftArrow);
  categoriesContainer.appendChild(categoriesCarousel);
  categoriesContainer.appendChild(rightArrow);

  // Insert the categories container after the header
  const header = document.querySelector('header');
  header.parentNode.insertBefore(categoriesContainer, header.nextSibling);;

  // Add event listener to the toggle button
  const toggleBtn = document.getElementById('categories-toggle-btn');
  const hamburger = document.querySelector('.hamburger-menu');
  
  
  toggleBtn.addEventListener('click', function() {
    
      if (categoriesContainer.style.display === 'none' || categoriesContainer.style.display === '') {
          categoriesContainer.style.display = 'block';
          toggleBtn.innerHTML = 'Categories &#9660;';
      } else {
          categoriesContainer.style.display = 'none';
          toggleBtn.innerHTML = 'Categories &#9650;';
      }
  });
  hamburger.addEventListener('click', function() {
    
    if (categoriesContainer.style.display === 'none' || categoriesContainer.style.display === '') {
        categoriesContainer.style.display = 'block';
    } else {
        categoriesContainer.style.display = 'none';
    }
});
}

let autoScrollInterval;

function scrollCarousel(direction) {
  const carousel = document.querySelector('.categories-carousel');
  const scrollAmount = carousel.offsetWidth / 2 * direction;
  carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
async function getCategoryImage(category) {
  if (category === 'all') {
    return 'temulogo-jpg-removebg-preview.png'; 
  }
  
  try {
    const response = await fetch(`https://dummyjson.com/products/category/${category}?limit=1`);
    const data = await response.json();
    if (data.products && data.products.length > 0) {
      return data.products[0].thumbnail;
    }
  } catch (error) {
    console.error(`Error fetching image for category ${category}:`, error);
  }
  
  return 'path/to/default-image.jpg';
}

function filterProducts(category) {
  currentCategory = category;
  
  if (category === 'all') {
    allProducts = [...originalProducts];
    displayProducts(allProducts);
  } else {
    fetchCategoryProducts(category);
  }

  // Show the category title container
  const categoryTitleContainer = document.querySelector("#category-title-container");
  categoryTitleContainer.style.display = 'block';

  // Update the category title
  const categoryTitle = document.getElementById('category-title');
  if (categoryTitle) {
    if (category === 'all') {
      categoryTitle.textContent = 'All Products';
    } else {
      categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
  }

  // Hide list2 and show list
  const list = document.querySelector("#list");
  const list2 = document.querySelector("#list2");
  list.classList.remove("hide");
  list2.classList.add("hide");

  // Scroll to the category title
  setTimeout(() => {
    if (categoryTitle) {
      categoryTitle.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100); // Small delay to ensure the title is rendered
}
document.addEventListener("DOMContentLoaded", function() {
  const cartModal = document.querySelector(".cart-modal");

  // Get the elements that open the modals
  const productElements = document.querySelectorAll(".card");
  const cartIcon = document.querySelector(".fa-cart-shopping");

  const cartClose = cartModal.querySelector("span");

  // Function to open the product modal
  productElements.forEach(product => {
      product.addEventListener("click", function() {
          productModal.style.display = "flex";
      });
  });

  // Function to open the cart modal
  cartIcon.addEventListener("click", function() {
      cartModal.style.display = "flex";
  });
  // Function to close the cart modal
  cartClose.addEventListener("click", function() {
      cartModal.style.display = "none";
  });

  const favoritesModal = document.querySelector(".favorites-modal");
  const favoritesIcon = document.querySelector(".fa-heart");
  const favoritesClose = favoritesModal.querySelector("span");
  
  // Function to open the cart modal
  favoritesIcon.addEventListener("click", function() {
    favoritesModal.style.display = "flex";
});

// Function to close the cart modal
favoritesClose.addEventListener("click", function() {
  favoritesModal.style.display = "none";
});

 // Close the modals when the user clicks anywhere outside of the modal
window.addEventListener("click", function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
}
  else if (event.target === favoritesModal) {
        favoritesModal.style.display = "none";
    }
});
});

document.addEventListener('click', function(e) {
  if(e.target && e.target.classList.contains('thumbnail')) {
    const mainImage = e.target.closest('.product-images').querySelector('.main-image img');
    mainImage.src = e.target.src;
  }
});

async function fetchProducts() {
  try {
    const resp = await fetch("https://dummyjson.com/products");
    const data = await resp.json();
    allProducts = data.products;
    originalProducts = [...allProducts]; 
    displayProducts(allProducts);

    const list2 = document.querySelector("#list2");
    list2.classList.add("hide");

  } catch (error) {
    console.error(error);
  }
}

async function fetchCategoryProducts(category) {
  try {
    const resp = await fetch(`https://dummyjson.com/products/category/${category}`);
    const data = await resp.json();
    allProducts = data.products;
    displayProducts(data.products);

    // Update category title
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
      categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
    }

    const list2 = document.querySelector("#list2");
    list2.classList.add("hide");
  } catch (error) {
    console.error(error);
  }
}

function toggleLists() {
  const list = document.getElementById('list');
  const list2 = document.getElementById('list2');
  
  if (list.style.display !== 'none') {
    list2.classList.add('hide');
    list.classList.remove('hide');
  } else {
    list.classList.add('hide');
    list2.classList.remove('hide');
  }
}
// On page load
window.addEventListener('load', function() {
  toggleLists();
});

function showProductDetails(productId) {
  
  const product = allProducts.find((p) => p.id === productId);
  const isFavorite = favorites.some(fav => fav.id === productId);
  const favoriteClass = isFavorite ? 'added' : '';
  if (product) {
    const list = document.querySelector("#list");
    const list2 = document.querySelector("#list2");
    const categoryTitleContainer = document.querySelector("#category-title-container");
      // Save the current state before showing product details
    previousListState = {
    content: list.innerHTML,
    categoryTitleDisplay: categoryTitleContainer.style.display,
    currentCategory: currentCategory
  };
    previousListContent = list.innerHTML;
    list.innerHTML = '';
    list2.classList.remove("hide");

    // Hide the category title container
    categoryTitleContainer.style.display = 'none';
    list2.innerHTML = `
      <button class="back-btn" onclick="goBack()">❮</button>
      <div class="product-details-container">
        <div class="product-info-column">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p>Brand: ${product.brand}</p>
          <p>Price: $${product.price.toFixed(2)}</p>
          <p>Discount: ${product.discountPercentage}%</p>
          <p>Rating: ${getStarRating(product.rating)}</p>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})"><i class="fa-solid fa-cart-shopping"></i>Add to Cart</button>
          <button id="detail-favorite-btn-${product.id}" class="add-to-favorites-btn favorite ${favoriteClass}" onclick="toggleFavorite(${product.id}); event.stopPropagation();">
          <i class="fa fa-heart"></i> Add to Favorites</button>
          <br>
          <p>paying easily on site</p>
          <img src="pay.jpg" alt="Payment Image" class="payment-image2">
          <p>Availability: ${product.availabilityStatus}</p>
          <p>Stock: ${product.stock}</p>
          <p>Minimum Order Quantity: ${product.minimumOrderQuantity}</p>
          <p>Return Policy: ${product.returnPolicy}</p>
          <p>Warranty Information: ${product.warrantyInformation}</p>
          <p>Shipping Information: ${product.shippingInformation}</p>
          <p>Dimensions: Width ${product.dimensions.width}, Height ${product.dimensions.height}, Depth ${product.dimensions.depth}</p>
          <div class="product-meta">
            <p>SKU: ${product.sku}</p>
            <p>Barcode: ${product.meta.barcode}</p>
            <p><a href="${product.meta.qrCode}" target="_blank">QR Code</a></p>
          </div>
        </div>
        <div class="product-images-reviews-column">
          <div class="product-images">
            <div class="main-image">
              <img src="${product.images[0]}" alt="${product.title}" />
            </div>
            <div class="thumbnail-container">
              ${product.images.slice(0).map((image, index) => `
                <img src="${image}" alt="${product.title} thumbnail ${index + 1}" class="thumbnail" />
              `).join('')}
            </div>
          </div>
          <div class="product-reviews">
          <h3>Reviews</h3>
          ${product.reviews ? product.reviews.map((review) => `
            <div class="review">
              <div class="review-header">
           <div class="review-icon ${getRandomColorClass()}">
           ${review.reviewerName ? review.reviewerName[0] : 'A'}
           </div>
                <p><strong>${review.reviewerName || 'Anonymous'}</strong> (${review.reviewerEmail || 'No email'})</p>
              </div>
              <p>${review.comment}</p>
              <p>Rating: ${getStarRating(review.rating)}</p>
              <p>Date: ${new Date(review.date).toLocaleDateString()}</p>
            </div>
          `).join('') : '<p>No reviews available.</p>'}
        </div>
      </div>
      <div class="product-reviews2">
          <h3>Reviews</h3>
          ${product.reviews ? product.reviews.map((review) => `
            <div class="review">
              <div class="review-header">
        <div class="review-icon ${getRandomColorClass()}">
        ${review.reviewerName ? review.reviewerName[0] : 'A'}
        </div>
                <p><strong>${review.reviewerName || 'Anonymous'}</strong> (${review.reviewerEmail || 'No email'})</p>
              </div>
              <p>${review.comment}</p>
              <p>Rating: ${getStarRating(review.rating)}</p>
              <p>Date: ${new Date(review.date).toLocaleDateString()}</p>
            </div>
          `).join('') : '<p>No reviews available.</p>'}
        </div>
    `;

   // Scroll to the top of the product details container
   setTimeout(() => {
    const productDetailsContainer = document.querySelector('#list2');
    if (productDetailsContainer) {
      productDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}
}


function getStarRating(rating) {
  const roundedRating = Math.round(rating);
  const stars = '&#9733;'.repeat(roundedRating);
  return stars;
}

function getRandomColorClass() {
  const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4'];
  const randomIndex = Math.floor(Math.random() * colorClasses.length);
  return colorClasses[randomIndex];
}

// function getRandomColor() {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }
function goBack() {
  const list = document.querySelector("#list");
  const list2 = document.querySelector("#list2");
  const categoryTitleContainer = document.querySelector("#category-title-container");

  // Hide product details
  list2.classList.add("hide");
  list2.innerHTML = '';

  // Display all products or products of the previous category
  // displayProducts(currentCategory === 'all' ? allProducts : allProducts.filter(product => product.category === currentCategory));
  displayProducts(allProducts);

  // Restore only the category title display
  categoryTitleContainer.style.display = previousListState.categoryTitleDisplay;

  // Update category title
  const categoryTitle = document.getElementById('category-title');
  if (categoryTitle) {
    categoryTitle.textContent = currentCategory === 'all' 
      ? 'All Products' 
      : currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace('-', ' ');
  }
}

  window.onclick = function(event) {
    const productModal = document.querySelector("#product-modal");
    const cartModal = document.querySelector("#cart-modal");
    if (event.target == productModal) {
      closeModal();
    } else if (event.target == cartModal) {
      closeCart();
    }
  }


  function displayProducts(products) {
  const list = document.querySelector("#list");
  const categoryTitleContainer = document.querySelector("#category-title-container");
  
  // Update category title
  categoryTitleContainer.innerHTML = `
    <h2 id="category-title">
      ${currentCategory === 'all' 
        ? 'All Products' 
        : currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace('-', ' ')}
    </h2>
  `;

  list.innerHTML = '';
  products.forEach((product) => {
    const { thumbnail, category, price, title, id } = product;
    const isFavorite = favorites.some(fav => fav.id === id);
    const favoriteClass = isFavorite ? 'added' : '';

    const randomRating = Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;
    const formattedRating = randomRating.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  
      list.innerHTML += `
        <li class="card" onclick="showProductDetails(${id})">
          <div class="img-content">
            <img src="${thumbnail}" alt="${category}" />
          </div>
          <div class="card-content">
            <h4 class="card-title">${title.substring(0, 45)}...</h4>
            <div class="card-price-container">
              <p class="card-price">$${price.toFixed(2)}</p>
            </div>
            <div class="card-rating">
              <span>★ ★ ★ ★ ★</span> (${formattedRating})
            </div>
            <div class="btn-container">
              <button class="card-btn" onclick="addToCart(${id}); event.stopPropagation();">
                <i class="fa fa-shopping-cart"></i>
              </button>
              <button id="favorite-btn-${id}" class="card-btn favorite ${favoriteClass}" onclick="toggleFavorite(${id}); event.stopPropagation();">
                <i class="fa fa-heart"></i>
              </button>
            </div>
          </div>
        </li>
      `;
    });
  }
  function filterCategories() {
    const select = document.querySelector("#categories-toggle-btn");
  
    select.addEventListener("change", async (e) => {
      const category = e.target.value;
      if (category === "all") {
        allProducts = [...originalProducts]; // Reset to original products
        displayProducts(allProducts);
      } else {
        await fetchCategoryProducts(category);
      }
      currentCategory = category;
    });
  
    // Add mousedown event listener to preserve current category before clearing
    select.addEventListener("mousedown", (e) => {
      const category = e.target.value;
      if (category === currentCategory) {
        e.target.value = ''; // Temporarily clear the selection value
      }
    });
  
    // Ensure the selected category remains displayed after blur
    select.addEventListener("blur", (e) => {
      if (e.target.value === '') {
        e.target.value = currentCategory; // Restore the selected category
      }
    });
  }

  async function searchProduct() {
    const searchInput = document.querySelector("#search-input");
    const list = document.querySelector("#list");
    const adContainer = document.querySelector(".ad-container");
    const categoryTitleContainer = document.querySelector("#category-title-container");
  
    searchInput.addEventListener("keyup", handleSearch);
    searchInput.addEventListener("search", handleSearch);
  
    function updateAdContainerVisibility() {
      const isSmallScreen = window.innerWidth <= 1340; // Adjust this value based on your small screen breakpoint
      const isSearchEmpty = searchInput.value === '';
      
      if (isSmallScreen) {
        adContainer.style.display = 'none';
      } else {
        adContainer.style.display = isSearchEmpty ? 'block' : 'none';
      }
    }
  
    async function handleSearch() {
      let searchTerm = searchInput.value.toLowerCase();
  
      // Update ad container and category title visibility
      updateAdContainerVisibility();
      categoryTitleContainer.style.display = searchTerm ? 'none' : 'block';
  
      list.classList.add("list-container");
      list.innerHTML = `<div class="loading-spinner"></div>`;
  
      try {
        if (searchTerm === '') {
          // If search is cleared, show all products
          allProducts = [...originalProducts];
          displayProducts(allProducts);
            // Update category title
        const categoryTitle = document.getElementById('category-title');
        categoryTitle.textContent = 'All Products' 
        } else {
          const resp = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}`);
          const data = await resp.json();
  
          if (data.products.length === 0) {
            list.innerHTML = '<p>No products found.</p>';
            return;
          }
  
          allProducts = data.products;
          displayProducts(data.products);
        }
  
        const list2 = document.querySelector("#list2");
        list2.classList.add("hide");
      } catch (error) {
        console.error(error);
        list.innerHTML = '<p>Error occurred while fetching products.</p>';
      } finally {
        list.classList.remove("list-container");
      }
    }
  
    // Initial check for ad container visibility
    updateAdContainerVisibility();
  
    // Add event listener for window resize
    window.addEventListener('resize', updateAdContainerVisibility);
  }
  
  function openCart() {
    const cartBtn = document.querySelector(".cart-container");
    cartBtn.addEventListener("click", () => {
      const body = document.body;
      const cartModal = document.querySelector("#cart-modal");
  
      // לוודא שהתצוגה בעגלה מעודכנת כראוי
      shoppingCart();
  
      cartModal.classList.remove("hide");
      body.classList.add("modal-open");
    });
  }

  function closeCart() {
    const body = document.body;
    const cartModal = document.querySelector("#cart-modal");
    cartModal.classList.add("hide");
    body.classList.remove("modal-open");
  }
  
  function addToCart(id) {
    const searchCart = cart.find((product) => product.id === id);
    if (searchCart) {
      alert("Product already added to the cart");
    } else {
      const oldProduct = allProducts.find((product) => product.id === id);
      cart.push({ ...oldProduct, quantity: 1 });
    }
    console.log(cart);
    shoppingCart();
  }
  
  document.addEventListener('DOMContentLoaded', (event) => {
    shoppingCart();
  });
  
  function shoppingCart() {
    const cartList = document.querySelector("#cart-list");
    const cartTotal = document.querySelector("#cart-total");
    const cartNumber = document.querySelector(".cart-number-container");
    let cartHTML = "";
  
    if (cart.length === 0) {
      cartHTML = `<img src="revamp-empty-cart_1666.svg" alt="Empty Cart" class="empty-cart-image">`;
      cartTotal.innerHTML = ``;
      cartNumber.classList.add("hide");
      cartNumber.innerHTML = ""; // איפוס הכמות בעגלת הקניות
    } else {
      cart.forEach((product) => {
        const { title, price, quantity, id, thumbnail } = product;
        cartHTML += `
          <li id="item-container" class="item-container">
            <img src="${thumbnail}" alt="${title}">
            <div class="cart-title">
              <h3>${title.substring(0, 30)}...</h3>
            </div>
            <div class="cart-quantity-container">
              <p class="cart-price">$${price.toFixed(2)}</p>
              <div class="button-quantity-container">
                <button class="plus" onclick="increment(${id})">+</button>
                <p>${quantity}</p>
                <button class="minus" onclick="decrement(${id})">-</button>
              </div>
              <p id="item-total">$${(price * quantity).toFixed(2)}</p>
              <div class="remove-cart-item">
                <button onclick="deleteCartItem(${id})">
    <i class="fas fa-trash-alt"></i>
</button>
              </div>
            </div>
          </li>
        `;
      });
  
      let sum = cart.reduce((total, product) => total + product.price * product.quantity, 0);
      cartTotal.innerHTML =
        sum > 0
          ? `<button id="checkout" onclick="showCheckoutForm()">Pay Now: $${sum.toFixed(2)}</button>`
          : `No items in the cart`;
  
      let newSum = cart.reduce((total, product) => total + product.quantity, 0);
      if (newSum < 1) {
        cartNumber.classList.add("hide");
        cartNumber.innerHTML = ""; // איפוס הכמות בעגלת הקניות
      } else {
        cartNumber.classList.remove("hide");
        cartNumber.innerHTML = newSum;
      }
    }
  
    cartList.innerHTML = cartHTML;
  }
  
  
  function increment(id) {
    const cartProduct = cart.find((product) => product.id === id);
    if (cartProduct) {
      cartProduct.quantity++;
    }
    shoppingCart();
  }
  
  function decrement(id) {
    const cartProduct = cart.find((product) => product.id === id);
    if (cartProduct && cartProduct.quantity > 1) {
      cartProduct.quantity--;
    }
    shoppingCart();
  }
  
  function deleteCartItem(id) {
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    if (isConfirmed) {
    cart = cart.filter((product) => product.id !== id);
    shoppingCart();
    }
  }
  

  function showCheckoutForm() {
    const checkoutModal = document.querySelector("#checkout-modal");
    const checkoutCartList = document.querySelector("#checkout-cart-list");
    const checkoutTotal = document.querySelector("#checkout-total");
    let checkoutHTML = "";
  
    cart.forEach((product) => {
      const { title, price, quantity, thumbnail } = product;
      checkoutHTML += `
        <li class="checkout-item-container">
          <img src="${thumbnail}" alt="${title}">
          <div class="checkout-item-details">
            <h3>${title.substring(0, 30)}...</h3>
            <p>Quantity: ${quantity}</p>
            <p>Total: $${(price * quantity).toFixed(2)}</p>
          </div>
        </li>
      `;
    });
  
    checkoutCartList.innerHTML = checkoutHTML;
  
    let sum = cart.reduce((total, product) => total + product.price * product.quantity, 0);

  //   checkoutTotal.innerHTML = `<span style="
  // color: var(--primary-color);
  // font-style: italic;
  // font-weight: bolder;
  // font-size: 20px;">Total Amount to Pay:</span> 
  // <span style="
  // color: var(--primary-color);
  // font-style: italic;
  // font-weight: bolder;
  // font-size: 20px;">$${sum.toFixed(2)}</span>`;
  checkoutTotal.innerHTML = `
  <span class="total-amount-label">Total Amount to Pay:</span> 
  <span class="total-amount-value">$${sum.toFixed(2)}</span>`;


    document.querySelector("#address").value = "";
    document.querySelector("#credit-card").value = "";
  
    const cartModal = document.querySelector("#cart-modal");
    cartModal.classList.add("hide");
    checkoutModal.classList.remove("hide");
    document.body.classList.add("modal-open");
  }
  
  
  function checkout() {
    const cartList = document.querySelector("#cart-list");
    const checkoutModal = document.querySelector("#checkout-modal");
    const checkoutCartList = document.querySelector("#checkout-cart-list");
    const checkoutTotal = document.querySelector("#checkout-total");
    const cartNumber = document.querySelector(".cart-number-container");
  
    cart = [];
    shoppingCart();
  
    cartList.innerHTML = `<p class="empty-cart-message">No items in the cart</p>`;
    checkoutCartList.innerHTML = `<p class="empty-cart-message">No items in the cart</p>`;
    checkoutTotal.innerHTML = "";
  
    cartNumber.classList.add("hide");
    cartNumber.innerHTML = "";
  
    document.querySelector("#address").value = "";
    document.querySelector("#credit-card").value = "";
  
    setTimeout(() => {
      checkoutModal.classList.add("hide");
      document.body.classList.remove("modal-open");
    }, 2000); 
  }
  
  function closeCheckoutModal() {
    const checkoutModal = document.querySelector("#checkout-modal");
    checkoutModal.classList.add("hide");
    document.body.classList.remove("modal-open");
  }
  
  function completeCheckout(event) {
    event.preventDefault();

    const address = document.querySelector("#address").value;
    const creditCard = document.querySelector("#credit-card").value;
    const maskedCreditCard = creditCard.replace(/.(?=.{4})/g, '*');
    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const email = document.querySelector("#email").value;
    const phone = document.querySelector("#phone").value;
    const city = document.querySelector("#city").value;
    const notes = document.querySelector("#notes").value;
    const house = document.querySelector("#house").value;
    const apartment = document.querySelector("#apartment").value;
    const floor = document.querySelector("#floor").value;

    // let invoiceHTML = `
    // <div class="invoice">
    //     <h2 style="
    //         color: var(--primary-color);
    //         font-style: italic;
    //         font-weight: bolder;
    //         font-size: 24px;
    //         text-align: center;
    //         margin-bottom: 20px;
    //     ">Invoice</h2>
    //     <h3 style="
    //         color: var(--primary-color);
    //         font-style: italic;
    //         font-weight: bold;
    //         font-size: 20px;
    //         margin-bottom: 10px;
    //     ">Buyer Details:</h3>`;
    let invoiceHTML = `
    <div class="invoice">
    <h2 class="invoice-title">Invoice</h2>
    <h3 class="buyer-details-title">Buyer Details:</h3>`;


    if (firstName) invoiceHTML += `<p>First Name: ${firstName}</p>`;
    if (lastName) invoiceHTML += `<p>Last Name: ${lastName}</p>`;
    if (email) invoiceHTML += `<p>Email: ${email}</p>`;
    if (phone) invoiceHTML += `<p>Phone: ${phone}</p>`;
    if (city) invoiceHTML += `<p>City: ${city}</p>`;
    if (address) invoiceHTML += `<p>Address: ${address}</p>`;
    if (house) invoiceHTML += `<p>House: ${house}</p>`;
    if (apartment) invoiceHTML += `<p>Apartment: ${apartment}</p>`;
    if (floor) invoiceHTML += `<p>Floor: ${floor}</p>`;

    invoiceHTML += `<h3>Payment Details:</h3>
            <p>Credit Card: ${maskedCreditCard}</p>
            <h3>Order Details:</h3>
            <ul>`;

    cart.forEach((product) => {
        const { title, price, quantity } = product;
        invoiceHTML += `
            <li>
                <p>${title} - Quantity: ${quantity} - Total: $${(price * quantity).toFixed(2)}</p>
            </li>`;
    });

    let totalAmount = cart.reduce((total, product) => total + product.price * product.quantity, 0);
    invoiceHTML += `
            </ul>
            <h3>Total Amount: $${totalAmount.toFixed(2)}</h3>`;

    if (notes) invoiceHTML += `<p>Notes: ${notes}</p>`;

    invoiceHTML += `
            <div class="invoice-actions">
                <button onclick="sendInvoiceToEmail('${email}')">
                    <i class="fa-solid fa-envelope"></i> Send to Email
                </button>
                <button onclick="downloadInvoice()">
                    <i class="fa-solid fa-download"></i> Save as File
                </button>
            </div>
        </div>`;

    const cartList = document.querySelector("#cart-list");
    cart = [];
    shoppingCart();
    cartList.innerHTML = `
    <p class="checkout-message">
    Thank you for your purchase! Your items are on the way.
    <img src="fast_cart.jpg" alt="Fast Cart" class="fast-cart-image" />
    </p>${invoiceHTML}
`;

    closeCheckoutModal();
}

function sendInvoiceToEmail(email) {
    alert(`Invoice sent to ${email}`);
}

function downloadInvoice() {
  // Clone the invoice element to manipulate its content
  const invoiceElement = document.querySelector(".invoice").cloneNode(true);
  
  // Remove invoice actions from the cloned invoice HTML
  const invoiceActions = invoiceElement.querySelector(".invoice-actions");
  if (invoiceActions) {
      invoiceActions.remove();
  }

  // Create a Blob from the modified invoice content
  const blob = new Blob([invoiceElement.outerHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

    
function openFavorites() {
  const favoritesBtn = document.querySelector(".favorites-container");
  favoritesBtn.addEventListener("click", () => {
    const body = document.body;
    const favoritesModal = document.querySelector("#favorites-modal");

    ShowingFavorites();

    favoritesModal.classList.remove("hide");
    body.classList.add("modal-open");
  });
}

function closeFavorites() {
  const body = document.body;
  const favoritesModal = document.querySelector("#favorites-modal");
  favoritesModal.classList.add("hide");
  body.classList.remove("modal-open");
}

function toggleFavorite(id) {
const searchFavorites = favorites.find((product) => product.id === id);
const favoriteBtn = document.querySelector(`#favorite-btn-${id}`);
const detailFavoriteBtn = document.querySelector(`#detail-favorite-btn-${id}`);

if (searchFavorites) {
  favorites = favorites.filter((product) => product.id !== id);
  if (favoriteBtn) favoriteBtn.classList.remove('added');
  if (detailFavoriteBtn) detailFavoriteBtn.classList.remove('added');
} else {
  const oldProduct = allProducts.find((product) => product.id === id);
  favorites.push({ ...oldProduct, quantity: 1 });
  if (favoriteBtn) favoriteBtn.classList.add('added');
  if (detailFavoriteBtn) detailFavoriteBtn.classList.add('added');
}

ShowingFavorites();
}

document.addEventListener('DOMContentLoaded', (event) => {
  ShowingFavorites();
});

function ShowingFavorites() {
  const favoritesList = document.querySelector("#favorites-list");
  const favoritesTotal = document.querySelector("#favorites-total");
  const favoritesNumber = document.querySelector(".favorites-number-container");
  let favoritesHTML = "";

  if (favorites.length === 0) {
    favoritesHTML = `<img src="empty_heart.png" alt="Empty Favorites" class="empty-favorites-image"><p class="empty-favorites-message">No items in favorites</p>`;
    favoritesNumber.classList.add("hide");
    favoritesNumber.innerHTML = ""; 
  } else {
    favorites.forEach((product) => {
      const { title, price, quantity, id, thumbnail } = product;
      favoritesHTML += `
        <li id="item-favorites-container" class="item-favorites-container">
          <img src="${thumbnail}" alt="${title}">
          <div class="favorites-title">
            <h3>${title.substring(0, 30)}...</h3>
          </div>
            <p class="favorites-price">$${price.toFixed(2)}</p>
            <div class="remove-favorites-item">
              <button onclick="deleteFavoritesItem(${id})">
          <i class="fas fa-trash-alt"></i>
              </button>
            </div>
        </li>
      `;
    });

    let newSum = favorites.reduce((total, product) => total + product.quantity, 0);
    if (newSum < 1) {
      favoritesNumber.classList.add("hide");
      favoritesNumber.innerHTML = "";
    } else {
      favoritesNumber.classList.remove("hide");
      favoritesNumber.innerHTML = newSum;
    }
  }

  favoritesList.innerHTML = favoritesHTML;

  // Update favorite buttons color based on favorites list
  favorites.forEach((product) => {
    const favoriteBtn = document.querySelector(`#favorite-btn-${product.id}`);
    if (favoriteBtn) {
      favoriteBtn.classList.add('added');
    }
  });
}

function deleteFavoritesItem(id) {
  const isConfirmed = confirm("Are you sure you want to delete this item?");
  if (isConfirmed) {
    favorites = favorites.filter((product) => product.id !== id);
    ShowingFavorites();
  }

  // Update the favorite button in the main product list
  const favoriteBtn = document.querySelector(`#favorite-btn-${id}`);
  const detailFavoriteBtn = document.querySelector(`#detail-favorite-btn-${id}`);

  if (favoriteBtn) {
    favoriteBtn.classList.remove('added');
  }
  if(detailFavoriteBtn){
    detailFavoriteBtn.classList.remove('added');
  }
}

//add container
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.ad-slider');
  const slides = document.querySelectorAll('.ad-slide');
  const prevBtn = document.querySelector('.ad-prev');
  const nextBtn = document.querySelector('.ad-next');
  let currentSlide = 0;

  function showSlide(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Auto-rotate every 5 seconds
  setInterval(nextSlide, 5000);

  // Initial slide display
  showSlide(currentSlide);
});


function isSmallScreen() {
  return window.innerWidth <= 1340; // Adjust this value based on your small screen breakpoint
}
document.querySelector('.logo').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent the default link behavior
  handleLogoClick();
});
function handleLogoClick() {
  const searchInput = document.querySelector("#search-input");
  const adContainer = document.querySelector(".ad-container");
  const categoryTitleContainer = document.querySelector("#category-title-container");
  const list = document.querySelector("#list");

  // Clear the search input
  searchInput.value = '';

  // Show the ad container only if not on a small screen
  if (!isSmallScreen()) {
    adContainer.style.display = 'block';
  } else {
    adContainer.style.display = 'none';
  }

  // Show the category title
  categoryTitleContainer.style.display = 'block';

  // Reset to all products
  allProducts = [...originalProducts];
  displayProducts(allProducts);

  // Update category title
  const categoryTitle = document.getElementById('category-title');
  if (categoryTitle) {
    categoryTitle.textContent = 'All Products';
  }

  // Reset current category
  currentCategory = 'all';

  // Hide product details if they're shown
  const list2 = document.querySelector("#list2");
  list2.classList.add("hide");

  // Scroll to the top of the page
  window.scrollTo(0, 0);
}
function updateAdContainerVisibility() {
  const searchInput = document.querySelector("#search-input");
  const adContainer = document.querySelector(".ad-container");
  const isSearchEmpty = searchInput.value === '';
  
  if (isSmallScreen()) {
    adContainer.style.display = 'none';
  } else {
    adContainer.style.display = isSearchEmpty ? 'block' : 'none';
  }
}