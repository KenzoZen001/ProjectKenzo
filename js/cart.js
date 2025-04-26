// Cart functionality
class ShoppingCart {
    constructor() {
      this.items = JSON.parse(localStorage.getItem("cartItems")) || [];
      this.cartCount = document.querySelector(".cart-count");
      this.init();
    }
    
    init() {
      this.updateCartCount();
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      // Add to cart buttons
      const buyButtons = document.querySelectorAll(".buy-button, .add-to-cart");
      
      buyButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          
          // Get product info
          let productId, productName, productPrice, productImage;
          
          if (button.hasAttribute("onclick")) {
            // Handle onclick attribute format
            const onclickAttr = button.getAttribute("onclick");
            const match = onclickAttr.match(/cart\.addItem$$\{(.*?)\}$$/);
            
            if (match) {
              const itemProps = match[1].split(",").map(prop => prop.trim());
              const itemObj = {};
              
              itemProps.forEach(prop => {
                const [key, value] = prop.split(":");
                itemObj[key.trim()] = value.trim().replace(/['"]/g, "");
              });
              
              productId = itemObj.id;
              productName = itemObj.name;
              productPrice = parseFloat(itemObj.price);
              
              // Try to find image
              const productElement = button.closest(".product-item");
              if (productElement) {
                const imgElement = productElement.querySelector("img");
                if (imgElement) {
                  productImage = imgElement.src;
                }
              }
            }
          } else {
            // Handle standard format
            const productElement = button.closest(".product-card, .product-item");
            
            if (productElement) {
              productId = productElement.getAttribute("data-product-id");
              const nameElement = productElement.querySelector("h3");
              const priceElement = productElement.querySelector(".price");
              const imgElement = productElement.querySelector("img");
              
              if (nameElement) productName = nameElement.textContent;
              if (priceElement) productPrice = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ""));
              if (imgElement) productImage = imgElement.src;
            }
          }
          
          if (productId && productName && productPrice) {
            this.addItem({
              id: productId,
              name: productName,
              price: productPrice,
              image: productImage || "images/placeholder.png",
              quantity: 1
            });
            
            // Show add to cart animation
            this.showAddToCartAnimation(button);
          }
        });
      });
    }
    
    addItem(item) {
      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        this.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        this.items.push(item);
      }
      
      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(this.items));
      
      // Update cart count
      this.updateCartCount();
      
      // Show notification
      this.showNotification(`${item.name} added to cart`);
    }
    
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
      localStorage.setItem("cartItems", JSON.stringify(this.items));
      this.updateCartCount();
    }
    
    updateQuantity(itemId, quantity) {
      const itemIndex = this.items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        this.items[itemIndex].quantity = quantity;
        localStorage.setItem("cartItems", JSON.stringify(this.items));
      }
    }
    
    clearCart() {
      this.items = [];
      localStorage.removeItem("cartItems");
      this.updateCartCount();
    }
    
    getTotal() {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    updateCartCount() {
      if (this.cartCount) {
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        
        // Add animation class
        this.cartCount.classList.add("pulse");
        setTimeout(() => {
          this.cartCount.classList.remove("pulse");
        }, 300);
      }
    }
    
    showAddToCartAnimation(button) {
      // Create floating element
      const floater = document.createElement("div");
      floater.className = "cart-floater";
      floater.innerHTML = '<i class="fas fa-shopping-cart"></i>';
      floater.style.position = "fixed";
      floater.style.zIndex = "9999";
      floater.style.fontSize = "24px";
      floater.style.color = "#e3d03a";
      
      // Position at the button
      const rect = button.getBoundingClientRect();
      floater.style.left = `${rect.left + rect.width / 2}px`;
      floater.style.top = `${rect.top + rect.height / 2}px`;
      
      document.body.appendChild(floater);
      
      // Get cart icon position
      const cartIcon = document.querySelector(".cart-icon");
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        // Animate to cart
        floater.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        setTimeout(() => {
          floater.style.left = `${cartRect.left + cartRect.width / 2}px`;
          floater.style.top = `${cartRect.top + cartRect.height / 2}px`;
          floater.style.opacity = "0";
          floater.style.transform = "scale(0.5)";
          
          // Animate cart icon
          cartIcon.style.transform = "scale(1.5)";
          setTimeout(() => {
            cartIcon.style.transform = "scale(1)";
            document.body.removeChild(floater);
          }, 800);
        }, 10);
      } else {
        // If cart icon not found, just fade out
        setTimeout(() => {
          floater.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(floater);
          }, 800);
        }, 500);
      }
    }
    
    showNotification(message) {
      // Create notification element
      const notification = document.createElement("div");
      notification.className = "cart-notification";
      notification.textContent = message;
      
      // Style notification
      notification.style.position = "fixed";
      notification.style.bottom = "20px";
      notification.style.left = "50%";
      notification.style.transform = "translateX(-50%)";
      notification.style.backgroundColor = "#e3d03a";
      notification.style.color = "#1a1a1a";
      notification.style.padding = "10px 20px";
      notification.style.borderRadius = "5px";
      notification.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
      notification.style.zIndex = "1000";
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.3s ease";
      
      document.body.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.style.opacity = "1";
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }, 10);
    }
  }
  
  // Initialize cart
  const cart = new ShoppingCart();
  
  // Make cart available globally
  window.cart = cart;