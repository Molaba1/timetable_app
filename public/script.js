document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('close-modal');
  const classListDiv = document.getElementById('class-list');

  // Add click event listeners to empty slots
  document.querySelectorAll('.no-class.clickable').forEach(cell => {
    cell.addEventListener('click', () => {
      const day = cell.getAttribute('data-day');
      const time = cell.getAttribute('data-time');

      fetch(`/api/available?day=${encodeURIComponent(day)}&time=${encodeURIComponent(time)}`)
        .then(response => response.json())
        .then(data => {
          classListDiv.innerHTML = '';
          if (data.length === 0) {
            classListDiv.innerHTML = '<p>No available classes found.</p>';
          } else {
            data.forEach(cls => {
              const div = document.createElement('div');
              div.innerHTML = `
                <strong>${cls.course_code}</strong> ${cls.session_type}<br>
                Group: ${cls.group_name}<br>
                Venue: ${cls.venue}<br>
                Time: ${cls.start_time}–${cls.end_time}
              `;
              classListDiv.appendChild(div);
            });
          }
          modal.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    });
  });

  // Close modal when close button is clicked
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', event => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});