import { modalWindow } from "./modal";
import { timer, calculateDuration } from "./timer";

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

        const minPoints = game.questionList.getPoints().slice(0, 1)[0];
        const maxPoints = game.questionList.getPoints().slice(-1)[0];
        const duration = calculateDuration(20, 60, minPoints, maxPoints, question.points);
        const timerElement = timer(content.querySelector('#answerTimer'), { duration });
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
            if (!question.isAnswered) {
                button.classList.add('answerButton');
            } else {
                if (!user.isAnswered(question)) {
                    return;
                }
            }
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
            if (question.isAnswered) {
                modal.close();
            }
        });

        const modal = modalWindow(element, {
            title: `${question.category} - ${question.points}`,
            content
        });

        modal.open();

        if (!question.isAnswered) {
            timerElement.start();
        } else {
            answerButtonList.classList.remove('hidden');
            content.querySelector('.magic-hidden').classList.remove('magic-hidden');
            content.querySelector('#answerTimer').classList.add('hidden');
        }
    });
}