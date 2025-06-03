const customMessageModal = document.getElementById('customMessageModal');
const closeMessageModalButton = document.getElementById('closeMessageModal');
const messageModalTitle = document.getElementById('messageModalTitle');
const messageModalBody = document.getElementById('messageModalBody');
const messageModalButtons = document.getElementById('messageModalButtons');
const messageModalContent = document.querySelector('#customMessageModal .modal-content');

let currentResolve = null; 

function showCustomAlert(title, message, type = 'info') {
    return new Promise(resolve => {
        messageModalTitle.textContent = title;
        messageModalBody.textContent = message;
        messageModalTitle.classList.remove('error', 'success', 'info', 'warning');
        messageModalBody.classList.remove('error', 'success', 'info', 'warning');
        messageModalTitle.classList.add(type);
        messageModalBody.classList.add(type);
        messageModalContent.classList.remove('error', 'success', 'info', 'warning');
        messageModalContent.classList.add(type);


        messageModalButtons.innerHTML = ''; 
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.className = 'btn-confirm-ok';
        okButton.addEventListener('click', () => {
            customMessageModal.style.display = 'none';
            resolve(true); 
        });
        messageModalButtons.appendChild(okButton);

        customMessageModal.style.display = 'flex'; 
        currentResolve = null; 
    });
}
function showCustomConfirm(title, message, type = 'warning') {
    return new Promise(resolve => {
        currentResolve = resolve; 
        messageModalTitle.textContent = title;
        messageModalBody.textContent = message;
        messageModalTitle.classList.remove('error', 'success', 'info', 'warning');
        messageModalBody.classList.remove('error', 'success', 'info', 'warning');
        messageModalTitle.classList.add(type);
        messageModalBody.classList.add(type);
        messageModalContent.classList.remove('error', 'success', 'info', 'warning');
        messageModalContent.classList.add(type);

        messageModalButtons.innerHTML = '';

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Sim';
        yesButton.className = 'btn-confirm-yes';
        yesButton.addEventListener('click', () => {
            customMessageModal.style.display = 'none';
            currentResolve(true);
        });
        messageModalButtons.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.textContent = 'Não';
        noButton.className = 'btn-confirm-no';
        noButton.addEventListener('click', () => {
            customMessageModal.style.display = 'none';
            currentResolve(false); 
        });
        messageModalButtons.appendChild(noButton);

        customMessageModal.style.display = 'flex';
    });
}
closeMessageModalButton.addEventListener('click', () => {
    customMessageModal.style.display = 'none';
    if (currentResolve) {
        currentResolve(false);
    }
});

window.addEventListener('click', (event) => {
    if (event.target === customMessageModal) {
        customMessageModal.style.display = 'none';
        if (currentResolve) {
            currentResolve(false); 
        }
    }
});