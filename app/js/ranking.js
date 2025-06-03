document.addEventListener('DOMContentLoaded', async () => {
    const tabelaRanking = document.getElementById('tabelaRanking');
    const editPlayerModal = document.getElementById('editPlayerModal');
    const closeButton = document.querySelector('#editPlayerModal .close-button');
    const editPlayerIdInput = document.getElementById('editPlayerId');
    const editPlayerNameInput = document.getElementById('editPlayerName');
    const savePlayerEditButton = document.getElementById('savePlayerEdit');

    const btnGerenciarJogadores = document.getElementById('btnGerenciarJogadores');
    const btnExcluirTabela = document.getElementById('btnExcluirTabela');

    let actionsColumnVisible = false; 

    async function loadRanking() {
        try {
            const response = await fetch('php/get_ranking.php');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            let html = '<table border="1" id="rankingTable">'; 
            html += '<tr><th>Posição</th><th>Jogador</th><th>Pontuação Total</th><th class="actions-header">Ações</th></tr>';
            
            data.forEach((jogador, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${jogador.nome}</td>
                        <td>${jogador.pontuacao_total}</td>
                        <td class="actions-cell">
                            <i class="fa-solid fa-edit action-icons edit-icon" data-id="${jogador.id}" data-nome="${jogador.nome}"></i>
                            <i class="fa-solid fa-trash-alt action-icons delete-icon" data-id="${jogador.id}"></i>
                        </td>
                    </tr>
                `;
            });
            html += '</table>';
            tabelaRanking.innerHTML = html;

            const rankingTable = document.getElementById('rankingTable');
            if (!actionsColumnVisible) {
                rankingTable.classList.add('hide-actions');
            } else {
                rankingTable.classList.remove('hide-actions');
            }

            attachEventListeners(); 
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
            showCustomAlert('Erro!', 'Erro ao carregar ranking. Verifique o console para mais detalhes: ' + error.message, 'error');
        }
    }

    function attachEventListeners() {
        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                const nome = event.target.dataset.nome;
                editPlayerIdInput.value = id;
                editPlayerNameInput.value = nome;
                editPlayerModal.style.display = 'flex';
            });
        });

        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                const playerName = event.target.closest('tr').children[1].textContent;
                const confirmed = await showCustomConfirm('Confirmação', `Tem certeza que deseja remover o jogador "${playerName}"?`, 'warning');
                if (confirmed) {
                    await deletePlayer(id);
                }
            });
        });
    }

    async function deletePlayer(id) {
        try {
            const response = await fetch('php/delete_jogador.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                showCustomAlert('Sucesso!', result.message || 'Jogador removido com sucesso!', 'success');
                loadRanking(); 
            } else {
                showCustomAlert('Erro!', result.message || 'Erro ao remover jogador: Erro desconhecido', 'error');
            }
        } catch (error) {
            console.error('Erro ao deletar jogador:', error);
            showCustomAlert('Erro!', 'Erro ao deletar jogador. Verifique o console para mais detalhes: ' + error.message, 'error');
        }
    }

    async function updatePlayer(id, nome) {
        try {
            const response = await fetch('php/update_jogador.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id, nome: nome })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                showCustomAlert('Sucesso!', result.message || 'Nome do jogador atualizado com sucesso!', 'success');
                editPlayerModal.style.display = 'none'; 
                loadRanking(); 
            } else {
                showCustomAlert('Erro!', result.message || 'Erro ao atualizar jogador: Erro desconhecido', 'error');
            }
        } catch (error) {
            console.error('Erro ao atualizar jogador:', error);
            showCustomAlert('Erro!', 'Erro ao atualizar jogador. Verifique o console para mais detalhes: ' + error.message, 'error');
        }
    }

    async function deleteAllPlayers() {
        const confirmed = await showCustomConfirm('Confirmação', 'ATENÇÃO! Esta ação irá APAGAR TODOS os jogadores e suas pontuações. Tem certeza que deseja resetar o ranking?', 'warning');
        
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch('php/delete_all_jogadores.php', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({}) 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                showCustomAlert('Sucesso!', result.message || 'Ranking resetado com sucesso! Todos os jogadores foram removidos.', 'success');
                loadRanking(); 
            } else {
                showCustomAlert('Erro!', result.message || 'Erro ao resetar ranking: Erro desconhecido', 'error');
            }
        } catch (error) {
            console.error('Erro ao resetar ranking:', error);
            showCustomAlert('Erro!', 'Erro ao resetar ranking. Verifique o console para mais detalhes: ' + error.message, 'error');
        }
    }

    closeButton.addEventListener('click', () => {
        editPlayerModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == editPlayerModal) {
            editPlayerModal.style.display = 'none';
        }
    });

    savePlayerEditButton.addEventListener('click', () => {
        const id = editPlayerIdInput.value;
        const novoNome = editPlayerNameInput.value.trim();
        if (novoNome) {
            updatePlayer(id, novoNome);
        } else {

            showCustomAlert('Aviso!', 'O nome do jogador não pode ser vazio.', 'warning');
        }
    });

    btnGerenciarJogadores.addEventListener('click', () => {
        actionsColumnVisible = !actionsColumnVisible; 
        const rankingTable = document.getElementById('rankingTable');
        if (rankingTable) { 
            if (actionsColumnVisible) {
                rankingTable.classList.remove('hide-actions');
            } else {
                rankingTable.classList.add('hide-actions');
            }
        }
    });
    btnExcluirTabela.addEventListener('click', deleteAllPlayers);
    loadRanking();
});