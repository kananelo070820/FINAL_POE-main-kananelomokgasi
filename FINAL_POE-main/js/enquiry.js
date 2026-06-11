const enquiryForm = document.querySelector('#enquiryForm');
const enquiryResponse = document.querySelector('#enquiryResponse');

function setError(field, message) {
  const group = field.closest('.form-group');
  const small = group.querySelector('.error-message');
  small.textContent = message;
}
function clearError(field) {
  const group = field.closest('.form-group');
  const small = group.querySelector('.error-message');
  small.textContent = '';
}
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    [...enquiryForm.elements].forEach((field) => {
      if (field.tagName !== 'BUTTON' && field.willValidate && !field.checkValidity()) {
        valid = false;
        setError(field, field.validationMessage);
      } else if (field.tagName !== 'BUTTON') {
        clearError(field);
      }
    });
    if (valid) {
      const type = document.querySelector('#enquiryType').value || 'general';
      enquiryResponse.textContent = `Thank you for your ${type} enquiry. We will contact you soon.`;
      enquiryForm.reset();
    } else {
      enquiryResponse.textContent = 'Please correct the highlighted fields before submitting.';
    }
  });
}
