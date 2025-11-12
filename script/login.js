// ======== PRELOADER ========
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => (preloader.style.display = 'none'), 400);
  }
}

window.addEventListener('load', () => {
  hidePreloader();
  const card = document.querySelector('.card');
  if (card) setTimeout(() => card.classList.add('fade-in'), 100);
});

// ======== USUÁRIOS ========
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
  alertBox.classList.add('alert', 'alert-danger');
}

function hideAlert() {
  if (!alertBox) return;
  alertBox.classList.add('d-none');
  alertBox.classList.remove('alert', 'alert-danger');
}

// ======== LOGIN ========
form.addEventListener('submit', function (e) {
  e.preventDefault();
  hideAlert();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Salva dados no localStorage
    localStorage.setItem('user_name', user.username);
    localStorage.setItem('user_id', user.id);

    // Redireciona imediatamente para index.html
    window.location.assign('index.html'); // 🔹 Ajuste se index.html estiver em outra pasta
  } else {
    showAlert('Usuário ou senha incorretos!');
  }
});
