import { listWithEaseInOutTimeoutValues, randomList } from "./random-utils";

export function questionTable(element, game) {
    const categories = game.questionList.getCategories();
    const points = game.questionList.getPoints();

    const table = document.createElement('table');
    table.classList.add('question-table');
    table.classList.add('table-bordered');
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
        const finish = () => {
            const td = table.querySelector('.question-table__question-id-' + e.detail.id);
            if (td) {
                td.classList.add('current-question');
            }
        };
        const questionIds = game.questionList.getQuestionByUnanswered().map(question => ({ id: question.id }));
        const animatedIds = listWithEaseInOutTimeoutValues(randomList(questionIds), 100, 400);
        const runAnimation = (index) => {
            if (index < animatedIds.length) {
                const td = table.querySelector('.question-table__question-id-' + animatedIds[index].id);
                if (td) {
                    td.classList.add('question-searching-animated');
                }
                setTimeout(() => {
                    td.classList.remove('question-searching-animated');
                    runAnimation(index + 1);
                }, animatedIds[index].timeout);
            } else {
                finish();
            }
        };
        runAnimation(0);
    });
}