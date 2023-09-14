export function questionTable(element, game) {
    const categories = game.questionList.getCategories();
    const points = game.questionList.getPoints();

    const table = document.createElement('table');
    table.classList.add('question-table');
    element.appendChild(table);

    const thead = document.createElement('thead');
    table.appendChild(thead);

    const tr = document.createElement('tr');
    thead.appendChild(tr);

    for (let i = 0; i < categories.length; i++) {
        const th = document.createElement('th');
        th.textContent = categories[i];
        tr.appendChild(th);
    }

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);


    const categoryQuestions = categories.map(category => game.questionList.getQuestionsByCategory(category));
    const pointsQuestionsLength = points.length;

    for (let i = 0; i < pointsQuestionsLength; i++) {
        const tr = document.createElement('tr');
        tbody.appendChild(tr);

        for (let j = 0; j < categories.length; j++) {
            const td = document.createElement('td');
            tr.appendChild(td);

            const question = categoryQuestions[j][i];
            if (question) {
                td.textContent = question.points;
                td.classList.add('question-table__question');
                td.classList.add('question-table__question-id-' + question.id);
                td.addEventListener('click', () => {
                    game.trigger('questionClicked', question);
                });
            }
        }
    }

    document.addEventListener('questionAnswered', (e) => {
        const td = table.querySelector('.question-table__question-id-' + e.detail.id);
        console.log('table. event questionAnswered', e.detail);
        if (td) {
            td.classList.add('has-answered');
        }
    });

    document.addEventListener('questionSelected', (e) => {
        const td = table.querySelector('.question-table__question-id-' + e.detail.id);
        console.log('table. event questionSelected', e.detail);
        if (td) {
            td.classList.add('current-question');
        }
    });
}