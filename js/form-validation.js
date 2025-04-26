document.addEventListener("DOMContentLoaded", () => {
    // Registration form validation
    const registrationForm = document.getElementById("registration-form");
    
    if (registrationForm) {
      registrationForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Check if all steps are valid
        let isValid = true;
        const formSteps = document.querySelectorAll(".form-step");
        
        formSteps.forEach(step => {
          const stepNumber = parseInt(step.getAttribute("data-step"));
          if (!validateStep(stepNumber)) {
            isValid = false;
          }
        });
        
        if (isValid) {
          // Show loading state
          const registerButton = document.getElementById("register-btn");
          const originalText = registerButton.textContent;
          registerButton.textContent = "Creating Account...";
          registerButton.disabled = true;
          
          // Simulate API call
          setTimeout(() => {
            // Show success message
            showSuccessMessage();
            
            // Reset form
            registrationForm.reset();
            
            // Reset button
            registerButton.textContent = originalText;
            registerButton.disabled = false;
            
            // Reset to first step
            formSteps.forEach(step => step.classList.remove("active"));
            document.querySelector(`.form-step[data-step="1"]`).classList.add("active");
            
            // Reset progress bar
            const progressBar = document.querySelector(".progress");
            if (progressBar) {
              progressBar.style.width = "33.33%";
            }
            
            // Reset step indicators
            const steps = document.querySelectorAll(".step");
            steps.forEach(step => step.classList.remove("active"));
            document.querySelector(`.step[data-step="1"]`).classList.add("active");
          }, 1500);
        }
      });
      
      // Validate form step
      function validateStep(step) {
        let isValid = true;
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        
        // Get all required inputs in current step
        const requiredInputs = currentFormStep.querySelectorAll("input[required], select[required]");
        
        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "This field is required";
            }
          } else {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "";
            }
          }
        });
        
        // Specific validation for email
        const emailInput = currentFormStep.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim()) {
          if (!isValidEmail(emailInput.value.trim())) {
            isValid = false;
            const errorMessage = emailInput.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "Please enter a valid email address";
            }
          }
        }
        
        // Specific validation for mobile number
        const mobileInput = currentFormStep.querySelector('input[type="tel"]');
        if (mobileInput && mobileInput.value.trim()) {
          if (!isValidPhoneNumber(mobileInput.value.trim())) {
            isValid = false;
            const errorMessage = mobileInput.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "Please enter a valid mobile number";
            }
          }
        }
        
        // Specific validation for password
        if (step === 2) {
          const passwordInput = document.getElementById("password");
          const confirmPasswordInput = document.getElementById("confirmPassword");
          
          if (passwordInput.value.trim()) {
            if (passwordInput.value.length < 8) {
              isValid = false;
              const errorMessage = passwordInput.parentElement.querySelector(".error-message");
              if (errorMessage) {
                errorMessage.textContent = "Password must be at least 8 characters";
              }
            }
          }
          
          if (confirmPasswordInput.value.trim()) {
            if (passwordInput.value !== confirmPasswordInput.value) {
              isValid = false;
              const errorMessage = confirmPasswordInput.parentElement.querySelector(".error-message");
              if (errorMessage) {
                errorMessage.textContent = "Passwords do not match";
              }
            }
          }
        }
        
        // Specific validation for terms checkbox
        if (step === 3) {
          const termsCheckbox = document.getElementById("termsCheckbox");
          if (!termsCheckbox.checked) {
            isValid = false;
            const errorMessage = document.querySelector(".terms .error-message");
            if (errorMessage) {
              errorMessage.textContent = "You must accept the terms and conditions";
            }
          } else {
            const errorMessage = document.querySelector(".terms .error-message");
            if (errorMessage) {
              errorMessage.textContent = "";
            }
          }
        }
        
        return isValid;
      }
      
      // Input validation on blur
      const allInputs = registrationForm.querySelectorAll("input, select");
      allInputs.forEach(input => {
        input.addEventListener("blur", function() {
          validateInput(this);
        });
        
        input.addEventListener("input", function() {
          validateInput(this);
        });
      });
      
      function validateInput(input) {
        // Skip validation for non-required inputs that are empty
        if (!input.hasAttribute("required") && !input.value.trim()) {
          const errorMessage = input.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "";
          }
          return;
        }
        
        if (input.hasAttribute("required") && !input.value.trim()) {
          const errorMessage = input.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "This field is required";
          }
          return;
        }
        
        // Email validation
        if (input.type === "email" && input.value.trim()) {
          if (!isValidEmail(input.value.trim())) {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "Please enter a valid email address";
            }
          } else {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "";
            }
          }
        }
        
        // Phone validation
        if (input.type === "tel" && input.value.trim()) {
          if (!isValidPhoneNumber(input.value.trim())) {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "Please enter a valid mobile number";
            }
          } else {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "";
            }
          }
        }
        
        // Password validation
        if (input.id === "password" && input.value.trim()) {
          if (input.value.length < 8) {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "Password must be at least 8 characters";
            }
          } else {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "";
            }
          }
        }
        
        // Confirm password validation
        if (input.id === "confirmPassword" && input.value.trim()) {
          const passwordInput = document.getElementById("password");
          if (passwordInput.value !== input.value) {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "Passwords do not match";
            }
          } else {
            const errorMessage = input.parentElement.querySelector(".error-message");
            if (errorMessage) {
              errorMessage.textContent = "";
            }
          }
        }
      }
    }
    
    // Login form validation
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
      loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        let isValid = true;
        
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        
        // Validate email
        if (!emailInput.value.trim()) {
          isValid = false;
          const errorMessage = emailInput.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "Email is required";
          }
        } else if (!isValidEmail(emailInput.value.trim())) {
          isValid = false;
          const errorMessage = emailInput.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "Please enter a valid email address";
          }
        } else {
          const errorMessage = emailInput.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "";
          }
        }
        
        // Validate password
        if (!passwordInput.value.trim()) {
          isValid = false;
          const errorMessage = passwordInput.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "Password is required";
          }
        } else {
          const errorMessage = passwordInput.parentElement.querySelector(".error-message");
          if (errorMessage) {
            errorMessage.textContent = "";
          }
        }
        
        if (isValid) {
          // Show loading state
          const loginButton = document.querySelector(".login-button");
          const originalText = loginButton.textContent;
          loginButton.textContent = "Logging in...";
          loginButton.disabled = true;
          
          // Simulate API call
          setTimeout(() => {
            // Success - redirect to home page
            window.location.href = "home.html";
          }, 1500);
        }
      });
      
      // Remember me functionality
      const rememberMeCheckbox = document.getElementById("rememberMe");
      const emailInput = document.getElementById("email");
      
      if (rememberMeCheckbox && emailInput) {
        // Check if there's a saved email in localStorage
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
          emailInput.value = savedEmail;
          rememberMeCheckbox.checked = true;
        }
        
        rememberMeCheckbox.addEventListener("change", function() {
          if (this.checked) {
            localStorage.setItem("rememberedEmail", emailInput.value);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
        });
      }
      
      // Forgot password functionality
      const forgotPasswordLink = document.querySelector(".forgot-password");
      if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function(e) {
          e.preventDefault();
          
          // Create modal for password reset
          const modal = document.createElement("div");
          modal.className = "password-reset-modal";
          modal.innerHTML = `
            <div class="modal-content">
              <span class="close-modal">&times;</span>
              <h3>Reset Password</h3>
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              <form id="resetPasswordForm">
                <div class="input-container">
                  <i class="fas fa-envelope input-icon"></i>
                  <input type="email" id="resetEmail" placeholder="Enter your email" required>
                </div>
                <button type="submit" class="reset-button">Send Reset Link</button>
              </form>
            </div>
          `;
          
          document.body.appendChild(modal);
          
          // Add styles for the modal
          const style = document.createElement("style");
          style.textContent = `
            .password-reset-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.7);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1001;
              animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            .modal-content {
              background-color: #1a1a1a;
              padding: 30px;
              border-radius: 8px;
              width: 90%;
              max-width: 400px;
              position: relative;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            
            .close-modal {
              position: absolute;
              top: 15px;
              right: 15px;
              font-size: 24px;
              cursor: pointer;
              color: #a6a6a6;
            }
            
            .close-modal:hover {
              color: #e3d03a;
            }
            
            .modal-content h3 {
              margin-bottom: 15px;
              color: #fff;
            }
            
            .modal-content p {
              margin-bottom: 20px;
              color: #a6a6a6;
            }
            
            .reset-button {
              width: 100%;
              padding: 12px;
              background-color: #e3d03a;
              color: #1a1a1a;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              margin-top: 15px;
            }
            
            .reset-button:hover {
              background-color: #fff;
            }
          `;
          
          document.head.appendChild(style);
          
          // Close modal functionality
          const closeModalBtn = document.querySelector(".close-modal");
          closeModalBtn.addEventListener("click", function() {
            document.body.removeChild(modal);
            document.head.removeChild(style);
          });
          
          // Handle reset password form submission
          const resetForm = document.getElementById("resetPasswordForm");
          resetForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const resetEmail = document.getElementById("resetEmail").value;
            
            if (!resetEmail.trim() || !isValidEmail(resetEmail.trim())) {
              alert("Please enter a valid email address");
              return;
            }
            
            // Show loading state
            const resetButton = document.querySelector(".reset-button");
            resetButton.textContent = "Sending...";
            resetButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
              document.body.removeChild(modal);
              document.head.removeChild(style);
              
              // Show success message
              showResetSuccessMessage(resetEmail);
            }, 1500);
          });
        });
      }
    }
    
    // Helper functions
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    function isValidPhoneNumber(phone) {
      // Basic validation for phone numbers
      const phoneRegex = /^[0-9]{10,15}$/;
      return phoneRegex.test(phone.replace(/[^0-9]/g, ""));
    }
    
    function showSuccessMessage() {
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.innerHTML = `
        <div class="success-content">
          <i class="fas fa-check-circle"></i>
          <h3>Registration Successful!</h3>
          <p>Your account has been created successfully.</p>
          <button class="close-success">Continue to Login</button>
        </div>
      `;
      
      document.body.appendChild(successMessage);
      
      // Add styles for success message
      const successStyle = document.createElement("style");
      successStyle.textContent = `
        .success-message {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .success-content {
          background-color: #1a1a1a;
          padding: 40px;
          border-radius: 10px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        .success-content i {
          font-size: 60px;
          color: #4CAF50;
          margin-bottom: 20px;
        }
        
        .success-content h3 {
          margin-bottom: 15px;
          color: #fff;
          font-size: 24px;
        }
        
        .success-content p {
          margin-bottom: 25px;
          color: #a6a6a6;
        }
        
        .close-success {
          padding: 12px 24px;
          background-color: #e3d03a;
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-success:hover {
          background-color: #fff;
          transform: translateY(-2px);
        }
      `;
      
      document.head.appendChild(successStyle);
      
      // Close success message and redirect to login
      const closeSuccessBtn = document.querySelector(".close-success");
      closeSuccessBtn.addEventListener("click", () => {
        document.body.removeChild(successMessage);
        document.head.removeChild(successStyle);
        window.location.href = "login.html";
      });
    }
    
    function showResetSuccessMessage(email) {
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.innerHTML = `
        <div class="success-content">
          <i class="fas fa-check-circle"></i>
          <h3>Reset Link Sent</h3>
          <p>We've sent a password reset link to ${email}</p>
          <button class="close-success">OK</button>
        </div>
      `;
      
      document.body.appendChild(successMessage);
      
      // Add styles for success message
      const successStyle = document.createElement("style");
      successStyle.textContent = `
        .success-message {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .success-content {
          background-color: #1a1a1a;
          padding: 30px;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        
        .success-content i {
          font-size: 48px;
          color: #4CAF50;
          margin-bottom: 15px;
        }
        
        .success-content h3 {
          margin-bottom: 15px;
          color: #fff;
        }
        
        .success-content p {
          margin-bottom: 20px;
          color: #a6a6a6;
        }
        
        .close-success {
          padding: 10px 30px;
          background-color: #e3d03a;
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-success:hover {
          background-color: #fff;
        }
      `;
      
      document.head.appendChild(successStyle);
      
      // Close success message
      const closeSuccessBtn = document.querySelector(".close-success");
      closeSuccessBtn.addEventListener("click", () => {
        document.body.removeChild(successMessage);
        document.head.removeChild(successStyle);
      });
    }
  });