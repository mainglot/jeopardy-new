import { modalWindow } from "./modal";
import { timer } from "./timer";

export function questionModal(element, game) {
    window.document.addEventListener('questionClicked', (e) => {
        console.log(e.detail);
        const question = e.detail;

        const content = document.createElement('div');

        content.innerHTML = `
            <div class="question">
                <p>${question.question}</p>
                <p class="magic-hidden">${question.answer}</p>
            </div>
            <div id="answerTimer"></div>
            <div id="answerButtonList" class="hidden">
                <button class="answerButton" data-success="false">Wrong</button>
            </div>
        `;

        const timerElement = timer(content.querySelector('#answerTimer'), { duration: 60 });
        timerElement.element.addEventListener('timerEnd', () => {
            timerElement.hide();
            const answerButtonList = content.querySelector('#answerButtonList');
            answerButtonList.classList.remove('hidden');
        });

        timerElement.element.addEventListener('click', () => {
            timerElement.stop();
        });

        content.querySelector('.magic-hidden').addEventListener('click', (e) => {
            e.target.classList.toggle('show');
        });

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
        timerElement.start();
    });
}