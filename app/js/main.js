function iniciarCadastro() {
    window.location.href = 'cadastro.html';
}

let jogadores = [];

async function adicionarJogador() {
    const nome = document.getElementById('nomeJogador').value.trim();
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = '';

    try {
        if (!nome) throw new Error('Por favor, digite um nome para o jogador.');
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) throw new Error('Digite um nome válido (apenas letras e espaços).');
        if (jogadores.length >= 6) throw new Error('Máximo de 6 jogadores por pista.');
        if (jogadores.some(j => j.toLowerCase() === nome.toLowerCase())) {
            throw new Error(`O jogador "${nome}" já foi adicionado.`);
        }

        const response = await fetch('php/create_jogador.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao adicionar jogador');
        }

        const result = await response.json();
        if (result.status === 'success') {
            jogadores.push(nome);
            document.getElementById('nomeJogador').value = '';
            atualizarLista();
            showCustomAlert('Sucesso!', `${nome} adicionado com sucesso!`, 'success');
        } else {
            throw new Error(result.message || 'Erro ao adicionar jogador');
        }
    } catch (error) {
        console.error('Erro ao adicionar jogador:', error);
        mensagemErro.textContent = error.message;
    }
}

function atualizarLista() {
    const ul = document.getElementById('listaJogadores');
    ul.innerHTML = '';
    jogadores.forEach((jogador, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${index + 1}. <span>${jogador}</span>
            <button class="edit-btn" onclick="editarJogador(${index})">✏️</button>
            <button class="delete-btn" onclick="removerJogador(${index})">❌</button>
        `;
        ul.appendChild(li);
    });
}

async function editarJogador(index) {
    const jogadorAtual = jogadores[index];
    const novoNome = await showCustomPrompt('Editar Jogador', `Novo nome para ${jogadorAtual}:`, jogadorAtual);
    
    if (novoNome && novoNome.trim() !== "" && novoNome.trim() !== jogadorAtual) {
        try {
            if (!/^[A-Za-zÀ-ÿ\s]+$/.test(novoNome.trim())) {
                throw new Error('Digite um nome válido (apenas letras e espaços).');
            }
            if (jogadores.some(j => j.toLowerCase() === novoNome.toLowerCase())) {
                throw new Error(`O jogador "${novoNome}" já existe na lista.`);
            }
            
            jogadores[index] = novoNome.trim();
            atualizarLista();
            showCustomAlert('Sucesso!', `Nome alterado para "${novoNome.trim()}".`, 'success');
        } catch (error) {
            showCustomAlert('Erro!', error.message, 'error');
        }
    }
}
function showCustomPrompt(title, message, defaultValue = '') {
    return new Promise(resolve => {
        messageModalTitle.textContent = title;
        messageModalBody.textContent = message;
        messageModalButtons.innerHTML = '';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = defaultValue;
        inputField.classList.add('modal-prompt-input'); // Adicione estilo para isso no CSS
        messageModalBody.appendChild(inputField); // Adiciona o input ao corpo do modal

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.className = 'btn-confirm-ok';
        okButton.addEventListener('click', () => {
            customMessageModal.style.display = 'none';
            resolve(inputField.value);
        });
        messageModalButtons.appendChild(okButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.className = 'btn-confirm-no';
        cancelButton.addEventListener('click', () => {
            customMessageModal.style.display = 'none';
            resolve(null); // Retorna null se cancelar
        });
        messageModalButtons.appendChild(cancelButton);

        customMessageModal.style.display = 'flex';
        inputField.focus();
    });
}

async function removerJogador(index) {
    const confirmed = await showCustomConfirm('Confirmação', `Deseja remover o jogador ${jogadores[index]}?`, 'warning');
    if (confirmed) {
        jogadores.splice(index, 1);
        atualizarLista();
        showCustomAlert('Sucesso!', 'Jogador removido com sucesso.', 'success');
    }
}

async function concluirCadastro() {
    const rodadas = parseInt(document.getElementById('numRodadas').value);
    
    try {
        if (isNaN(rodadas) || rodadas <= 0) {
            throw new Error('Informe um número válido de rodadas (maior que 0).');
        }
        if (jogadores.length < 1) {
            throw new Error('Adicione pelo menos um jogador para iniciar a partida.');
        }

        const response = await fetch('php/salvar_partida.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jogadores,
                rodadas
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao salvar partida');
        }

        const result = await response.json();
        if (result.status === 'success') {
            showCustomAlert('Sucesso!', 'Partida criada com sucesso!', 'success')
                .then(() => {
                    window.location.href = 'tabela.html';
                });
        } else {
            throw new Error(result.message || 'Erro ao salvar partida');
        }
    } catch (error) {
        console.error('Erro ao salvar partida:', error);
        showCustomAlert('Erro!', error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarLista();
});