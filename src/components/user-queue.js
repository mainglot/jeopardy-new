export function userQueue(element, game) {
    const usersList = document.createElement('div');
    usersList.classList.add('user-queue');
    element.appendChild(usersList);

    document.addEventListener('userAdded', () => {
        const users = game.userQueue.getUsers();
        const usersLength = users.length;

        usersList.innerHTML = '';
        for (let i = 0; i < usersLength; i++) {
            const user = document.createElement('div');
            user.classList.add('user-queue__user');
            user.id = 'user-queue__user-id-' + users[i].id;
            user.textContent = users[i].name;
            usersList.appendChild(user);
        }
    });

    document.addEventListener('userTurnReset', () => {
        const users = game.userQueue.getUsers();
        const usersLength = users.length;

        for (let i = 0; i < usersLength; i++) {
            const user = document.querySelector('#user-queue__user-id-' + users[i].id);
            if (user) {
                user.classList.remove('current-user');
                user.classList.remove('has-answered');
            }
        }
    });

    document.addEventListener('userTurnChanged', (e) => {
        const users = game.userQueue.getUsers();
        const usersLength = users.length;

        for (let i = 0; i < usersLength; i++) {
            const user = document.querySelector('#user-queue__user-id-' + users[i].id);
            if (user) {
                user.classList.remove('current-user');
                if (users[i].isTurn) {
                    user.classList.add('has-answered');
                }
            }
        }

        const user = document.querySelector('#user-queue__user-id-' + e.detail.id);
        if (user) {
            user.classList.add('current-user');
        }
    });
};