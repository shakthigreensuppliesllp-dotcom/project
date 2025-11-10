// public/js/form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('vehicleForm');
  const statusMsg = document.getElementById('statusMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/save-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });

      if (response.ok) {
        statusMsg.textContent = '✅ Saved successfully!';
        form.reset();
      } else {
        statusMsg.textContent = '❌ Failed to save.';
      }
    } catch (err) {
      console.error(err);
      statusMsg.textContent = '❌ Server error.';
    }
  });
});
