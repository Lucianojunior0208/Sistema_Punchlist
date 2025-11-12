// ========== PRELOADER ==========
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.transition = "opacity 0.5s";
    preloader.style.opacity = "0";
    setTimeout(() => preloader.style.display = "none", 500);
  }
});

// ========== REDIRECIONAMENTO LOGIN ==========
window.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("user_id");
  if (!loggedIn) {
    window.location.href = "login.html";
  }
});

// ========== CAPTURA DE FOTOS ==========
const btnCadastrar = document.getElementById("btnCadastrar");
const inputCamera = document.getElementById("inputCamera");
const fotoBox = document.getElementById("fotoBox");

let fotos = [];

btnCadastrar.addEventListener("click", () => {
  if (fotos.length >= 5) {
    alert("Você pode adicionar até 5 fotos apenas!");
    return;
  }
  inputCamera.click();
});

inputCamera.addEventListener("change", (e) => {
  const arquivos = Array.from(e.target.files);
  arquivos.forEach((arquivo) => {
    if (fotos.length < 5) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fotos.push(event.target.result);
        const img = document.createElement("img");
        img.src = event.target.result;
        fotoBox.appendChild(img);
      };
      reader.readAsDataURL(arquivo);
    }
  });
});

// ========== GERAR PDF ==========
document.getElementById("btnEnviar").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;

  const matricula = document.getElementById("matricula").value.trim();
  const obra = document.getElementById("obra").value.trim();
  const projeto = document.getElementById("projeto").value.trim();
  const linha = document.getElementById("linha").value.trim();
  const junta = document.getElementById("junta").value.trim();
  const observacao = document.getElementById("observacao").value.trim();

  if (!matricula || !obra || !projeto || !linha || !junta) {
    alert("Preencha todos os campos obrigatórios antes de gerar o PDF.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Relatório de Flange", 20, 20);
  doc.setFontSize(12);
  doc.text(`Matrícula: ${matricula}`, 20, 40);
  doc.text(`Obra: ${obra}`, 20, 50);
  doc.text(`Projeto: ${projeto}`, 20, 60);
  doc.text(`Número da Linha: ${linha}`, 20, 70);
  doc.text(`Número da Junta: ${junta}`, 20, 80);
  if (observacao) doc.text(`Observação: ${observacao}`, 20, 90);

  if (fotos.length > 0) {
    doc.addPage();
    doc.text("Fotos do Registro", 20, 20);

    let x = 15, y = 30;
    const imgSize = 60;
    fotos.forEach((foto, index) => {
      doc.addImage(foto, "JPEG", x, y, imgSize, imgSize);
      x += imgSize + 10;
      if ((index + 1) % 3 === 0) {
        x = 15;
        y += imgSize + 10;
      }
    });
  }

  const fileName = `Relatorio_${linha}.pdf`;
  doc.save(fileName);
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    sessionStorage.removeItem('usuarioLogado');
    window.location.replace('login.html');
  });
}