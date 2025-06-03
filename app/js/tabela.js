let jogadores = [];
let numRodadas = 10;
let rodadaAtual = 1;
let indiceJogador = 0;
let jogadas = [];

const btnJogada1 = document.createElement('button');
const btnJogada2 = document.createElement('button');
const inputJogada1 = document.createElement('input');
const inputJogada2 = document.createElement('input');

function inicializarInterfaceJogadas() {
    const divJogada = document.getElementById('jogada');
    divJogada.innerHTML = '';

    const divInputs = document.createElement('div');
    divInputs.className = 'jogada-inputs';

    inputJogada1.type = 'number';
    inputJogada1.min = '0';
    inputJogada1.max = '10';
    inputJogada1.placeholder = 'Jogada 1';
    inputJogada1.className = 'jogada-input';

    inputJogada2.type = 'number';
    inputJogada2.min = '0';
    inputJogada2.max = '10';
    inputJogada2.placeholder = 'Jogada 2';
    inputJogada2.className = 'jogada-input';
    inputJogada2.disabled = true;

    btnJogada1.textContent = 'Registrar Jogada 1';
    btnJogada1.className = 'btn-jogada';
    btnJogada2.textContent = 'Registrar Jogada 2';
    btnJogada2.className = 'btn-jogada';
    btnJogada2.disabled = true;

    divInputs.appendChild(inputJogada1);
    divInputs.appendChild(inputJogada2);
    divJogada.appendChild(divInputs);
    divJogada.appendChild(btnJogada1);
    divJogada.appendChild(btnJogada2);

    inputJogada1.addEventListener('input', validarJogada1);
    btnJogada1.addEventListener('click', registrarJogada1);
    btnJogada2.addEventListener('click', registrarJogada2);

    const btnJogadaAuto = document.createElement('button');
    btnJogadaAuto.textContent = 'Simular Jogada Aleatória';
    btnJogadaAuto.className = 'btn-jogada';
    btnJogadaAuto.addEventListener('click', registrarJogadaAleatoria);
    divJogada.appendChild(btnJogadaAuto);
}

function validarJogada1() {
    const valor = parseInt(inputJogada1.value);
    if (isNaN(valor)) return;

    if (valor >= 0 && valor <= 10) {
        if (valor === 10) {
            inputJogada2.value = '0';
            inputJogada2.disabled = true;
            btnJogada1.disabled = false;
            btnJogada2.disabled = true;
        } else {
            inputJogada2.disabled = false;
            btnJogada1.disabled = true;
        }
    } else {
        inputJogada1.value = '';
    }
}

function registrarJogada1() {
    const valor = parseInt(inputJogada1.value);
    if (isNaN(valor)) return;

    if (valor === 10) {
        registrarJogada(valor, 0);
    } else {
        btnJogada1.disabled = true;
        inputJogada2.focus();
    }
}

async function registrarJogada2() { 
    const j1 = parseInt(inputJogada1.value);
    const j2 = parseInt(inputJogada2.value);
    if (isNaN(j1) || isNaN(j2)) return;

    if (j1 + j2 > 10) {

        await showCustomAlert('Atenção!', 'A soma das jogadas não pode ser maior que 10!', 'warning');
        inputJogada2.value = '';
        return;
    }

    registrarJogada(j1, j2);
}

function resetarInputsJogada() {
    inputJogada1.value = '';
    inputJogada2.value = '';
    inputJogada1.disabled = false;
    inputJogada2.disabled = true;
    btnJogada1.disabled = false;
    btnJogada2.disabled = true;
    inputJogada1.focus();
}

async function registrarJogada(j1, j2) {
    jogadas[indiceJogador][rodadaAtual - 1] = {
        pontos: j1 === 10 ? [10] : [j1, j2],
        total: j1 + j2
    };

    try {
        const response = await fetch('php/update_pontuacao.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jogador: jogadores[indiceJogador],
                pontos: j1 + j2
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === 'success') {
            showCustomAlert('Jogada Registrada!', `Jogadas para ${jogadores[indiceJogador]} (Rodada ${rodadaAtual}):\n${j1} + ${j2} = ${j1 + j2} pontos.`, 'info');
        } else {
            throw new Error(result.message || 'Erro desconhecido ao atualizar pontuação.');
        }

    } catch (err) {
        console.error('Erro ao salvar pontuação:', err);
        showCustomAlert('Erro!', 'Erro ao salvar pontuação: ' + err.message, 'error');
    }

    indiceJogador++;
    if (indiceJogador >= jogadores.length) {
        indiceJogador = 0;
        rodadaAtual++;
    }

    if (rodadaAtual > numRodadas) {
        document.getElementById('vezJogador').textContent = 'Partida encerrada 🎉';
        await showCustomAlert('Fim de Jogo!', 'A partida chegou ao fim! Verifique o ranking final.', 'success');
        setTimeout(() => window.location.href = 'ranking.html', 500);
        return;
    }

    resetarInputsJogada();
    atualizarInterface();
}

function registrarJogadaAleatoria() {
    const j1 = Math.floor(Math.random() * 11);
    const j2 = j1 === 10 ? 0 : Math.floor(Math.random() * (11 - j1));
    registrarJogada(j1, j2);
}

async function carregarPartida() {
    try {
        const response = await fetch('php/get_partida.php');
        const rawData = await response.text();

        let data;
        try {
            data = JSON.parse(rawData);
        } catch {
            throw new Error(`O servidor retornou dados inválidos: ${rawData}`);
        }

        if (data.status === 'error') throw new Error(data.message || 'Erro no servidor');

        jogadores = Array.isArray(data.jogadores) && data.jogadores.length > 0
            ? data.jogadores
            : ['Jogador 1', 'Jogador 2']; 

        numRodadas = Number.isInteger(data.rodadas) ? data.rodadas : 10; 
        jogadas = jogadores.map(() =>
            Array(numRodadas).fill().map(() => ({ pontos: [], total: 0 }))
        );

        inicializarInterfaceJogadas();
        atualizarInterface();
    } catch (error) {
        console.error('Erro ao carregar partida:', error);
        jogadores = ['Jogador 1', 'Jogador 2'];
        numRodadas = 10;
        jogadas = jogadores.map(() =>
            Array(numRodadas).fill().map(() => ({ pontos: [], total: 0 }))
        );
        inicializarInterfaceJogadas();
        atualizarInterface();
        showCustomAlert('Erro ao Carregar!', `Erro ao carregar partida: ${error.message}. Usando dados de exemplo.`, 'error');
    }
}

async function atualizarInterface() {
    const vezJogadorElement = document.getElementById('vezJogador');
    if (vezJogadorElement) {
        vezJogadorElement.textContent = `${jogadores[indiceJogador]} - Rodada ${rodadaAtual}`;
    } else {
        console.warn("Elemento 'vezJogador' não encontrado em tabela.html. Certifique-se de que ele existe.");
    }
    
    await atualizarTabela();
}

async function atualizarTabela() {
    const tabela = document.getElementById('tabelaPontuacao');
    if (!tabela) {
        console.error("Elemento 'tabelaPontuacao' não encontrado em tabela.html.");
        return;
    }
    let html = '<table><thead><tr><th>Jogador</th>';

    for (let r = 1; r <= numRodadas; r++) {
        const classe = r > rodadaAtual ? 'class="oculto"' : '';
        html += `<th ${classe}>R${r}</th>`;
    }
    html += '<th>Total</th></tr></thead><tbody>';

    for (let i = 0; i < jogadores.length; i++) {
        html += `<tr><td>${jogadores[i]}</td>`;
        let totalJogador = 0;

        for (let r = 0; r < numRodadas; r++) {
            const jogada = jogadas[i][r];
            const pontos = jogada.pontos.join('| ');
            totalJogador += jogada.total || 0;
            const classe = r + 1 > rodadaAtual ? 'class="oculto"' : '';
            html += `<td ${classe}>${pontos || '-'}</td>`;
        }

        html += `<td>${totalJogador}</td></tr>`;
    }

    html += '</tbody></table>';
    tabela.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', carregarPartida);