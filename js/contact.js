document.addEventListener("DOMContentLoaded", () => {
    // Contact form validation and submission
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.querySelector('.close-modal');
    const okButton = document.querySelector('.ok-btn');
    
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle active class on clicked item
        item.classList.toggle('active');
      });
    });
    
    // Form validation
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        // Simulate form submission
        setTimeout(() => {
          // Show success modal
          successModal.style.display = 'block';
          
          // Reset form
          contactForm.reset();
        }, 1000);
      }
    });
    
    // Close modal events
    closeModal.addEventListener('click', () => {
      successModal.style.display = 'none';
    });
    
    okButton.addEventListener('click', () => {
      successModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.style.display = 'none';
      }
    });
    
    // Form validation function
    function validateForm() {
      let isValid = true;
      
      // Validate name
      const name = document.getElementById('name');
      if (name.value.trim() === '') {
        showError(name, 'Please enter your name');
        isValid = false;
      } else {
        clearError(name);
      }
      
      // Validate email
      const email = document.getElementById('email');
      if (email.value.trim() === '') {
        showError(email, 'Please enter your email address');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(email);
      }
      
      // Validate phone (optional)
      const phone = document.getElementById('phone');
      if (phone.value.trim() !== '' && !isValidPhone(phone.value.trim())) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearError(phone);
      }
      
      // Validate subject
      const subject = document.getElementById('subject');
      if (subject.value === '') {
        showError(subject, 'Please select a subject');
        isValid = false;
      } else {
        clearError(subject);
      }
      
      // Validate message
      const message = document.getElementById('message');
      if (message.value.trim() === '') {
        showError(message, 'Please enter your message');
        isValid = false;
      } else if (message.value.trim().length < 10) {
        showError(message, 'Your message is too short');
        isValid = false;
      } else {
        clearError(message);
      }
      
      return isValid;
    }
    
    // Helper functions
    function showError(input, message) {
      const errorElement = input.nextElementSibling;
      errorElement.textContent = message;
      input.classList.add('error');
    }
    
    function clearError(input) {
      const errorElement = input.nextElementSibling;
      errorElement.textContent = '';
      input.classList.remove('error');
    }
    
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
      const phoneRegex = /^\d{10,11}$/;
      return phoneRegex.test(phone.replace(/\D/g, ''));
    }
    
    // Show notification
    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
        
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 3000);
      }, 10);
    }
  });