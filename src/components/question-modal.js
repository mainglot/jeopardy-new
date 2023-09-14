import { modalWindow } from "./modal";

export function questionModal(element, game) {
    window.document.addEventListener('questionClicked', (e) => {
        console.log(e.detail);
        const question = e.detail;

        const content = document.createElement('div');

        content.innerHTML = `
            <div>
                <p>${question.question}</p>
            </div>
            <div id="answerButtonList">
                <button class="answerButton" data-success="false">Wrong</button>
            </div>
        `;

        const answerButtonList = content.querySelector('#answerButtonList');
        game.userQueue.getUsers().forEach(user => {
            const button = document.createElement('button');
            button.classList.add('answerButton');
            button.textContent = `${user.name}`;
            button.dataset.userId = user.id;
            button.dataset.success = true;
            if (user.id === game.turn.currentUser.id) {
                button.classList.add('current-user');
            }
            answerButtonList.appendChild(button);
        });

        answerButtonList.addEventListener('click', (e) => {
            if (e.target.classList.contains('answerButton')) {
                const userId = e.target.dataset.userId;
                const success = e.target.dataset.success === 'true';
                game.answer(userId, question, success);
                modal.close();
            }
        });

        const modal = modalWindow(element, {
            title: `${question.category} - ${question.points}`,
            content
        });

        modal.open();

    });
}