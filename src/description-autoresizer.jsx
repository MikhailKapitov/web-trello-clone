export const autosizeDescriptions = () => {
  const textareas = document.querySelectorAll('.autosized-description');

  textareas.forEach(textarea => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  });
};
