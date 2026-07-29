// Le Manine — interações do site

document.addEventListener('DOMContentLoaded', () => {
  /* Menu mobile */
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.main-nav a').forEach((link) => {
      link.addEventListener('click', () => document.body.classList.remove('nav-open'));
    });
  }

  /* Máscara de CEP */
  document.querySelectorAll('[data-mask="cep"]').forEach((input) => {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 8);
      if (v.length > 5) v = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
      input.value = v;
    });
  });

  /* Máscara de telefone */
  document.querySelectorAll('[data-mask="phone"]').forEach((input) => {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0) v = v.replace(/(\d{0,2})/, '($1');
      input.value = v;
    });
  });

  /* Validação simples de formulário de contato/agendamento */
  const form = document.querySelector('#form-agendamento');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        const wrapper = field.closest('.field');
        const filled = field.value.trim().length > 0;
        wrapper.classList.toggle('invalid', !filled);
        if (!filled) valid = false;
      });

      const email = form.querySelector('[name="email"]');
      if (email && email.value.trim()) {
        const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        email.closest('.field').classList.toggle('invalid', !okEmail);
        if (!okEmail) valid = false;
      }

      if (!valid) return;

      form.reset();
      const success = document.querySelector('#form-sucesso');
      if (success) success.classList.add('show');
      form.style.display = 'none';
    });
  }

  /* Ano corrente no rodapé */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
