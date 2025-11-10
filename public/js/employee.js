document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('employeeForm');
  const statusMsg = document.getElementById('statusMsg');
  const roleSelect = document.getElementById('roleSelect');
  const customRole = document.getElementById('customRole');

  roleSelect.addEventListener('change', () => {
    customRole.style.display = roleSelect.value === 'Other' ? 'block' : 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    let role = formData.get('role');
    if (role === 'Other') {
      role = formData.get('customRole');
    }

    const jsonData = {
      name: formData.get('name'),
      role,
      mobile: formData.get('mobile'),
      joiningDate: formData.get('joiningDate'),
      salary: formData.get('salary'),
      remarks: formData.get('remarks')
    };

    try {
      const response = await fetch('/save-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData)
      });

      if (response.ok) {
        statusMsg.textContent = '✅ Employee saved successfully!';
        form.reset();
        customRole.style.display = 'none';
      } else {
        statusMsg.textContent = '❌ Failed to save employee.';
      }
    } catch (err) {
      console.error(err);
      statusMsg.textContent = '❌ Server error.';
    }
  });
});
