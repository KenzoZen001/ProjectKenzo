document.addEventListener("DOMContentLoaded", () => {
    // Assuming cart is managed elsewhere, e.g., in localStorage or a global scope
    // For demonstration, let's initialize it here.  In a real application,
    // you'd likely retrieve it from storage or have it passed in.
    const cart = {
      items: [],
      getTotal: function () {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      updateQuantity: function (id, quantity) {
        const item = this.items.find((item) => item.id === id)
        if (item) {
          item.quantity = quantity
        }
      },
      removeItem: function (id) {
        this.items = this.items.filter((item) => item.id !== id)
      },
      clearCart: function () {
        this.items = []
      },
    }
  
    const cartItemsContainer = document.getElementById("cart-items-container")
    const emptyCartMessage = document.getElementById("empty-cart-message")
    const subtotalElement = document.getElementById("subtotal")
    const discountRowElement = document.getElementById("discount-row")
    const discountAmountElement = document.getElementById("discount-amount")
    const totalElement = document.getElementById("total")
    const cartCountDisplay = document.getElementById("cart-count-display")
    const checkoutBtn = document.getElementById("checkout-btn")
    const clearCartBtn = document.getElementById("clear-cart")
    const couponCodeInput = document.getElementById("coupon-code")
    const applyCouponBtn = document.getElementById("apply-coupon")
    const couponMessage = document.getElementById("coupon-message")
  
    let discount = 0
  
    // Render cart items
    function renderCart() {
      if (cart.items.length === 0) {
        emptyCartMessage.style.display = "block"
        cartCountDisplay.textContent = "0"
        checkoutBtn.disabled = true
        clearCartBtn.style.display = "none"
      } else {
        emptyCartMessage.style.display = "none"
        cartCountDisplay.textContent = cart.items.reduce((total, item) => total + item.quantity, 0)
        checkoutBtn.disabled = false
        clearCartBtn.style.display = "block"
  
        // Clear previous items
        while (cartItemsContainer.firstChild && cartItemsContainer.firstChild !== emptyCartMessage) {
          cartItemsContainer.removeChild(cartItemsContainer.firstChild)
        }
  
        // Add cart items
        cart.items.forEach((item) => {
          const cartItem = document.createElement("div")
          cartItem.className = "cart-item"
          cartItem.innerHTML = `
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">₱${item.price.toFixed(2)} each</div>
              <div class="cart-item-actions">
                <div class="quantity-controls">
                  <button class="quantity-btn decrease" data-id="${item.id}" ${item.quantity <= 1 ? "disabled" : ""}>-</button>
                  <span class="quantity-value">${item.quantity}</span>
                  <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="cart-item-total">₱${(item.price * item.quantity).toFixed(2)}</div>
          `
  
          cartItemsContainer.appendChild(cartItem)
        })
  
        // Add event listeners to quantity buttons
        const decreaseButtons = document.querySelectorAll(".quantity-btn.decrease")
        const increaseButtons = document.querySelectorAll(".quantity-btn.increase")
        const removeButtons = document.querySelectorAll(".remove-item-btn")
  
        decreaseButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const id = button.dataset.id
            const item = cart.items.find((item) => item.id === id)
            if (item && item.quantity > 1) {
              cart.updateQuantity(id, item.quantity - 1)
              renderCart()
              updateSummary()
            }
          })
        })
  
        increaseButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const id = button.dataset.id
            const item = cart.items.find((item) => item.id === id)
            if (item) {
              cart.updateQuantity(id, item.quantity + 1)
              renderCart()
              updateSummary()
            }
          })
        })
  
        removeButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const id = button.dataset.id
            cart.removeItem(id)
            renderCart()
            updateSummary()
          })
        })
      }
  
      updateSummary()
    }
  
    // Update order summary
    function updateSummary() {
      const subtotal = cart.getTotal()
      subtotalElement.textContent = `₱${subtotal.toFixed(2)}`
  
      if (discount > 0) {
        discountRowElement.style.display = "flex"
        discountAmountElement.textContent = `-₱${discount.toFixed(2)}`
        totalElement.textContent = `₱${(subtotal - discount).toFixed(2)}`
      } else {
        discountRowElement.style.display = "none"
        totalElement.textContent = `₱${subtotal.toFixed(2)}`
      }
    }
  
    // Apply coupon
    applyCouponBtn.addEventListener("click", () => {
      const couponCode = couponCodeInput.value.trim()
  
      if (!couponCode) {
        couponMessage.textContent = "Please enter a coupon code"
        couponMessage.className = "coupon-message error"
        return
      }
  
      // Check if coupon is valid (for demo, we'll accept "DISCOUNT10")
      if (couponCode.toUpperCase() === "DISCOUNT10") {
        discount = cart.getTotal() * 0.1 // 10% discount
        couponMessage.textContent = "10% discount applied!"
        couponMessage.className = "coupon-message success"
        updateSummary()
      } else {
        couponMessage.textContent = "Invalid coupon code"
        couponMessage.className = "coupon-message error"
        discount = 0
        updateSummary()
      }
    })
  
    // Clear cart
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart.clearCart()
        discount = 0
        couponCodeInput.value = ""
        couponMessage.textContent = ""
        renderCart()
      }
    })
  
    // Checkout button
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout functionality will be implemented here")
    })
  
    // Initial render
    renderCart()
  })
  