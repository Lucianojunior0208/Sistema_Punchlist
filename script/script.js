// script.js - controla foto, validação, geração PDF e logout

// Elementos
const btnCadastrar = document.getElementById('btnCadastrar');
const inputCamera = document.getElementById('inputCamera');
const fotoPreview = document.getElementById('fotoPreview');

const matricula = document.getElementById('matricula');
const obra = document.getElementById('obra');
const projeto = document.getElementById('projeto');
const linha = document.getElementById('linha');
const junta = document.getElementById('junta');
const observacao = document.getElementById('observacao');
const nomeArquivo = document.getElementById('nomeArquivo');

const form = document.getElementById('formCadastro');
const btnGerar = document.getElementById('btnGerar');

const alertMsg = document.getElementById('alertMsg');
const successMsg = document.getElementById('successMsg');
const pdfPreviewContainer = document.getElementById('pdfPreviewContainer');
const pdfPreview = document.getElementById('pdfPreview');

const logoutBtn = document.getElementById('logoutBtn');

let fotoBase64 = null;

// Preenche matrícula com user_id salvo (se existir)
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    if (userId && matricula) {
        matricula.value = userId;
    }
    // Atualiza estado do botão gerar (caso já haja valores)
    checkRequiredFields();
});

// ----- Foto: abrir input e mostrar miniatura -----
btnCadastrar.addEventListener('click', () => inputCamera.click());

inputCamera.addEventListener('change', (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        fotoBase64 = e.target.result;
        fotoPreview.src = fotoBase64;
        fotoPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

// Atualiza nomeArquivo automaticamente baseado em "linha"
linha.addEventListener('input', () => {
    nomeArquivo.value = linha.value.trim() ? `${linha.value.trim()}.pdf` : '';
    checkRequiredFields();
});

// Verifica obrigatórios e habilita/desabilita botão Gerar
function checkRequiredFields() {
    const ok = matricula.value.trim() &&
        obra.value.trim() &&
        projeto.value.trim() &&
        linha.value.trim() &&
        junta.value.trim();
    btnGerar.disabled = !ok;
}

// ligar inputs para checar dinamicamente
[matricula, obra, projeto, linha, junta].forEach(el => {
    if (el) el.addEventListener('input', checkRequiredFields);
});

// Logout: limpa localStorage e redireciona para login
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        sessionStorage.removeItem('usuarioLogado');
        window.location.replace('login.html');
    });
}

// ----- Validação e geração do PDF (A4, consistente) -----
form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // valida obrigatórios (observação é opcional)
    if (!matricula.value.trim() || !obra.value.trim() || !projeto.value.trim() || !linha.value.trim() || !junta.value.trim()) {
        alertMsg.textContent = '⚠️ Preencha todos os campos obrigatórios (Matrícula, Obra, Projeto, Linha, Junta).';
        alertMsg.style.display = 'block';
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });

        const margin = 20;
        let y = margin;

        doc.setFontSize(16);
        doc.text('Relatório - Punchlist', margin, y);
        y += 12;

        doc.setFontSize(12);
        doc.text(`Matrícula: ${matricula.value}`, margin, y); y += 8;
        doc.text(`Obra: ${obra.value}`, margin, y); y += 8;
        doc.text(`Projeto: ${projeto.value}`, margin, y); y += 8;
        doc.text(`Nome da pasta: ${linha.value}`, margin, y); y += 8;
        doc.text(`Data da Verificação: ${junta.value}`, margin, y); y += 8;
        if (observacao.value.trim()) {
            // quebra simples em múltiplas linhas se necessário
            const obsLines = doc.splitTextToSize(`Observação: ${observacao.value.trim()}`, doc.internal.pageSize.getWidth() - 2 * margin);
            doc.text(obsLines, margin, y);
            y += obsLines.length * 6;
        } else {
            doc.text('Observação: (Nenhuma)', margin, y); y += 8;
        }

        // Se houver foto, adiciona proporcionalmente
        if (fotoBase64) {
            const imgProps = doc.getImageProperties(fotoBase64);
            const pdfW = doc.internal.pageSize.getWidth() - 2 * margin;
            const imgH = (imgProps.height * pdfW) / imgProps.width;
            doc.addImage(fotoBase64, 'PNG', margin, y, pdfW, imgH);
            y += imgH + 8;
        }

        // Nome do arquivo baseado na linha
        const arquivoNome = nomeArquivo.value.trim() || `${linha.value.trim() || 'relatorio'}.pdf`;

        // Salva PDF (download automático)
        doc.save(arquivoNome);

        // Cria blob para preview no iframe
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        pdfPreview.src = url;
        pdfPreviewContainer.style.display = 'block';

        successMsg.textContent = '✅ PDF gerado e exibido corretamente!';
        successMsg.style.display = 'block';

        // limpa campos (mantém user_id no localStorage)
        form.reset();
        fotoBase64 = null;
        fotoPreview.style.display = 'none';
        nomeArquivo.value = '';
        btnGerar.disabled = true;
    } catch (err) {
        console.error(err);
        alertMsg.textContent = 'Erro ao gerar PDF. Veja console para mais detalhes.';
        alertMsg.style.display = 'block';
    }
});
