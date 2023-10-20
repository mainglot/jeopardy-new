export function questionHistory(element, game) {
    let counter = 0;
    document.addEventListener('userAnswered', (e) => {
        counter++;
        const user = e.detail.user;
        const question = e.detail.question;
        const score = e.detail.score;
        const scoreClass = e.detail.score > 0 ? 'correct' : 'wrong';

        const itemHistory = document.createElement('div');
        itemHistory.classList.add('itemHistory');
        itemHistory.classList.add(scoreClass);
        itemHistory.innerHTML = `
            <div class="counter">${counter}</div>
            <div class="user">${user.name}</div>
            <div class="score">${score}</div>
            <div class="question">${question.question}</div>
            <div class="answer">${question.answer}</div>            
        `;

        element.appendChild(itemHistory);
    });
}