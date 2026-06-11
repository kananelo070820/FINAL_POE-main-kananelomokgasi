const contactForm = document.querySelector('#contactForm');
const contactResponse = document.querySelector('#contactResponse');

function showFieldError(field, message) {
  const group = field.closest('.form-group');
  const small = group.querySelector('.error-message');
  small.textContent = message;
}
function resetFieldError(field) {
  const group = field.closest('.form-group');
  const small = group.querySelector('.error-message');
  small.textContent = '';
}
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    let valid = true;
    [...contactForm.elements].forEach((field) => {
      if (field.tagName !== 'BUTTON' && field.willValidate && !field.checkValidity()) {
        valid = false;
        showFieldError(field, field.validationMessage);
      } else if (field.tagName !== 'BUTTON') {
        resetFieldError(field);
      }
    });
    if (!valid) {
      event.preventDefault();
      contactResponse.textContent = 'Please correct the highlighted fields before sending the message.';
      return;
    }
    contactResponse.textContent = 'Your email app should open now. If it does not, check your device email settings.';
  });
}
