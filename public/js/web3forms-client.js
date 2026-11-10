// Contact & Start-Your-Project form handler with Web3Forms integration
(function initContactWeb3Forms() {
  const ACCESS_KEY = 'd223bfe0-784d-49ba-b0c8-67da38c9996a';
  const NOTIFICATION_EMAIL = 'adhiraj@kyotocreative.com';

  const interestMap = {
    '1.1': 'A new website',
    '1.2': 'Branding',
    '1.3': 'Motion graphics',
    '1.4': 'E-Commerce',
    '1.5': 'App Development',
    '1.6': 'AI Automations'
  };

  function setupForm() {
    const form = document.querySelector('form.Form_form___noC4, form[action*="ed9936b7"], .Form_contactForm__X6bdS form');
    if (!form || form.dataset.web3formsInit) return;
    form.dataset.web3formsInit = 'true';

    // Create hidden iframe target for Web3Forms POST
    let iframe = document.getElementById('web3forms_hidden_iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = 'web3forms_hidden_iframe';
      iframe.id = 'web3forms_hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnTextSpan = submitBtn ? submitBtn.querySelector('span') : null;
    let originalButtonText = submitBtnTextSpan ? submitBtnTextSpan.textContent : (submitBtn ? submitBtn.textContent : 'Submit');

    // Remove React action attributes from form tag so standard submit behavior doesn't trigger Next server action error
    form.removeAttribute('action');

    // Create error message element if not present
    let errorBanner = form.querySelector('.kyoto-form-error');
    if (!errorBanner) {
      errorBanner = document.createElement('div');
      errorBanner.className = 'kyoto-form-error';
      errorBanner.style.cssText = 'display:none;color:#ff4d4f;font-size:0.95rem;margin-top:1rem;padding:0.75rem 1rem;border:1px solid #ff4d4f;border-radius:4px;background:rgba(255,77,79,0.08);width:100%;';
      form.appendChild(errorBanner);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Clear previous error
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';

      // Validate required fields
      const firstNameInput = form.querySelector('input[name="firstName"]');
      const lastNameInput = form.querySelector('input[name="lastName"]');
      const emailInput = form.querySelector('input[name="email"]');
      const privacyCheck = form.querySelector('input[name="privacy"]');
      const honeypot = form.querySelector('input[name="phone"]');

      // Honeypot anti-spam check
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam submission detected by honeypot.');
        return false;
      }

      if (!firstNameInput || !firstNameInput.value.trim()) {
        showError('Please enter your first name.');
        firstNameInput && firstNameInput.focus();
        return false;
      }
      if (!lastNameInput || !lastNameInput.value.trim()) {
        showError('Please enter your last name.');
        lastNameInput && lastNameInput.focus();
        return false;
      }
      if (!emailInput || !emailInput.value.trim()) {
        showError('Please enter your email address.');
        emailInput && emailInput.focus();
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError('Please enter a valid email address.');
        emailInput.focus();
        return false;
      }

      if (privacyCheck && !privacyCheck.checked) {
        showError('Please accept the privacy policy to continue.');
        privacyCheck.focus();
        return false;
      }

      // Collect readable interests
      const checkedInterests = Array.from(form.querySelectorAll('input[name="interestedIn"]:checked'))
        .map(cb => interestMap[cb.value] || cb.value)
        .filter(val => val !== '1.8' && val !== 'Lorem Ipsum');

      // If bot checked lorem ipsum honeypot
      const botChecked = Array.from(form.querySelectorAll('input[name="interestedIn"]:checked')).some(cb => cb.value === '1.8');
      if (botChecked) {
        console.warn('Spam submission detected.');
        return false;
      }

      // Construct payload form for Web3Forms
      const w3Form = document.createElement('form');
      w3Form.style.display = 'none';
      w3Form.method = 'POST';
      w3Form.action = 'https://api.web3forms.com/submit';
      w3Form.target = 'web3forms_hidden_iframe';
      w3Form.enctype = 'multipart/form-data';

      function addField(name, val) {
        if (val === undefined || val === null || val === '') return;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = val;
        w3Form.appendChild(input);
      }

      addField('access_key', ACCESS_KEY);
      addField('subject', 'New Client Enquiry from Kyoto Creative Website');
      addField('from_name', 'Kyoto Creative Contact Form');
      addField('replyto', emailInput.value.trim());

      const fullName = (firstNameInput.value.trim() + ' ' + lastNameInput.value.trim()).trim();
      addField('name', fullName);
      addField('first_name', firstNameInput.value.trim());
      addField('last_name', lastNameInput.value.trim());
      addField('email', emailInput.value.trim());

      const budgetInput = form.querySelector('input[name="budget"]');
      if (budgetInput && budgetInput.value.trim()) addField('budget', budgetInput.value.trim());

      const messageInput = form.querySelector('input[name="message"]');
      if (messageInput && messageInput.value.trim()) addField('message', messageInput.value.trim());

      if (checkedInterests.length > 0) {
        addField('services_interested_in', checkedInterests.join(', '));
      }

      const newsletterCheck = form.querySelector('input[name="newsletter"]');
      if (newsletterCheck && newsletterCheck.checked) addField('newsletter_opt_in', 'Yes');

      addField('page_title', document.title);
      addField('page_url', window.location.href);

      // Forward file attachments if selected
      const fileInput = form.querySelector('input[name="attachments"]');
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const clonedFile = fileInput.cloneNode(true);
        clonedFile.name = 'attachment';
        // Note: cloned file input in browser may not retain FileList in some engines; append directly if possible
        try {
          const dt = new DataTransfer();
          for (let i = 0; i < fileInput.files.length; i++) dt.items.add(fileInput.files[i]);
          clonedFile.files = dt.files;
          w3Form.appendChild(clonedFile);
        } catch (e) {
          console.warn('Attachment cloning:', e);
        }
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-disabled', 'true');
        if (submitBtnTextSpan) submitBtnTextSpan.textContent = 'Sending...';
        else submitBtn.textContent = 'Sending...';
      }

      let completed = false;
      const timeoutId = setTimeout(function () {
        if (!completed) {
          completed = true;
          onSuccess();
        }
      }, 3500);

      iframe.onload = function () {
        if (!completed) {
          completed = true;
          clearTimeout(timeoutId);
          onSuccess();
        }
      };

      document.body.appendChild(w3Form);
      w3Form.submit();
      setTimeout(function () {
        if (w3Form.parentNode) w3Form.parentNode.removeChild(w3Form);
      }, 500);

      function onSuccess() {
        // Reset form
        form.reset();

        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.setAttribute('aria-disabled', 'false');
          if (submitBtnTextSpan) submitBtnTextSpan.textContent = originalButtonText;
          else submitBtn.textContent = originalButtonText;
        }

        // Show theme's authentic animated success view or fallback
        const contactSection = form.closest('section');
        const formOuter = form.closest('.Form_formOuter__Ua1_E, [class*="formOuter"]') || form.parentElement;
        
        let successView = contactSection ? contactSection.querySelector('.Form_successMessage__s5YQz, [class*="successMessage"]') : null;
        if (!successView && formOuter) {
          successView = document.createElement('div');
          successView.className = 'Form_successMessage__s5YQz kyoto-success-wrapper';
          successView.innerHTML = `
          <div class="kyoto-success-card" style="
            position: relative;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 252, 0.9) 100%);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 28px;
            padding: clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 4vw, 4rem);
            box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) inset;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            width: 100%; max-width: 1100px;
            margin: 0 auto;
            text-align: left;
            overflow: hidden;
            animation: kyotoFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          ">
            <!-- Subtle accent top pill -->
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 6px 14px;
              border-radius: 9999px;
              background: rgba(0, 0, 0, 0.04);
              border: 1px solid rgba(0, 0, 0, 0.06);
              margin-bottom: 1.75rem;
            ">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);"></span>
              <span style="font-size: 0.8rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: #111;">Message Sent</span>
            </div>

            <!-- Main Heading with clean premium typography -->
            <h2 style="
              font-size: clamp(2.25rem, 4.8vw, 3.75rem);
              font-weight: 400;
              line-height: 1.08;
              letter-spacing: -0.03em;
              color: #050505;
              margin: 0 0 1.25rem 0;
            ">
              Thanks for getting in touch!
            </h2>

            <!-- Supporting subtext -->
            <p style="
              font-size: clamp(1.05rem, 1.4vw, 1.25rem);
              line-height: 1.55;
              color: #555;
              max-width: 75ch;
              margin: 0 0 2.5rem 0;
            ">
              Someone from the <strong style="color: #000; font-weight: 500;">Kyoto Creative</strong> team will review your project details and get back to you shortly. In the meantime, explore our latest work.
            </p>

            <!-- Action buttons row -->
            <div style="
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 1rem;
            ">
              <a href="/work" style="
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 0.95rem 2rem;
                border-radius: 9999px;
                background: #000;
                color: #fff;
                text-decoration: none;
                font-weight: 500;
                font-size: 0.95rem;
                letter-spacing: -0.01em;
                transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
              " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 14px 30px -5px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 10px 25px -5px rgba(0,0,0,0.3)'">
                <span>View all our projects</span>
                <span style="display:inline-block;transition:transform 0.2s ease;">&rarr;</span>
              </a>

              <a href="/" style="
                display: inline-flex;
                align-items: center;
                padding: 0.95rem 1.75rem;
                border-radius: 9999px;
                background: transparent;
                color: #111;
                border: 1px solid rgba(0, 0, 0, 0.15);
                text-decoration: none;
                font-weight: 500;
                font-size: 0.95rem;
                transition: all 0.2s ease;
              " onmouseover="this.style.borderColor='#000';this.style.background='rgba(0,0,0,0.03)'" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';this.style.background='transparent'">
                Back to Home
              </a>
            </div>
          </div>
          <style>
            @keyframes kyotoFadeUp {
              0% { opacity: 0; transform: translateY(24px) scale(0.98); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          </style>
          `;
          formOuter.parentElement.appendChild(successView);
        }

        if (formOuter) formOuter.style.display = 'none';
        if (successView) {
          successView.style.display = 'block';
          successView.scrollIntoView({ behavior: 'smooth' });
        }
      }

      function showError(msg) {
        errorBanner.textContent = msg;
        errorBanner.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.setAttribute('aria-disabled', 'false');
          if (submitBtnTextSpan) submitBtnTextSpan.textContent = originalButtonText;
          else submitBtn.textContent = originalButtonText;
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupForm);
  } else {
    setupForm();
  }

  // Ensure dynamic client-side route transitions also re-bind
  setInterval(setupForm, 1000);
})();
