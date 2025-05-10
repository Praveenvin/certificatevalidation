// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('certificateForm');
  const fileInput = document.getElementById('certificateFile');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      resultDiv.textContent = 'Please select a certificate file.';
      return;
    }

    const formData = new FormData();
    formData.append('certificateFile', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.valid) {
        resultDiv.textContent = 'Certificate is valid.';
      } else {
        resultDiv.textContent = 'Certificate is invalid.';
      }
    } catch (error) {
      console.error('Error:', error);
      resultDiv.textContent = 'An error occurred during validation.';
    }
  });
});
