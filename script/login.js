// Preloader
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.style.display = 'none', 400);
  }
}
window.addEventListener('load', hidePreloader);

// Usuários válidos
const users = [
  { username: 'luciano.dev', password: '171296', id: 1 },
  { username: 'producao', password: 'tub8', id: 0 }
];

const form = document.getElementById('loginForm');
const alertBox = document.getElementById('loginAlert');

function showAlert(msg) {
  if (!alertBox) return;
  alertBox.textContent = msg;
  alertBox.classList.remove('d-none');
  alertBox.classList.add('alert-danger');
}

function hideAlert() {
  if (!alertBox) return;
  alertBox.classList.add('d-none');
  alertBox.classList.remove('alert-danger');
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  hideAlert();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem('user_name', user.username);
    localStorage.setItem('user_id', user.id);
    hidePreloader();
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  } else {
    showAlert('Usuário ou senha incorretos!');
  }
});
