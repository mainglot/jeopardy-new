export function questionModal(element, game) {
    const hideModal = () => {
        element.style.display = 'none';
    };
    const showModal = () => {
        element.style.display = 'block';
    }

    hideModal();
    window.document.addEventListener('questionClicked', (e) => {
        console.log(e.detail);
        const question = e.detail;

        element.innerHTML = `
            <p>${question.question}</p>
            <p>
                <button id="questionModal__answerButton">Correct!</button>
            </p>
        `;

        element.querySelector('#questionModal__answerButton').addEventListener('click', () => {
            question.setAnswered();
            hideModal();
        });
        showModal();
    });
}