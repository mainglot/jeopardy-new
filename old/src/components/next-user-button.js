export function nextUserButton(element, game) {
    element.classList.add('hidden');

    const button = document.createElement('button');
    button.textContent = 'Next user';
    element.appendChild(button);

    button.addEventListener('click', (e) => {
        game.next();
    });

    document.addEventListener('userTurnChanged', (e) => {
        button.disabled = true;
        game.setNewQuestionIsClickable(true);
    });
    document.addEventListener('usersAnswered', (e) => {
        button.disabled = false;
        game.setNewQuestionIsClickable(false);
    });

    document.addEventListener('gameStarted', (e) => {
        element.classList.remove('hidden');
    });
    document.addEventListener('gameOver', (e) => {
        element.classList.add('hidden');
    });
}