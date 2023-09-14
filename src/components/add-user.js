export function addUser(element, game) {
    const form = document.createElement('form');
    form.classList.add('add-user');
    element.appendChild(form);

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter user name');
    form.appendChild(input);

    const button = document.createElement('button');
    button.textContent = 'Add user';
    form.appendChild(button);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = input.value;
        game.userQueue.addUser({ name });
        input.value = '';
    });
};