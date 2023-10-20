import gameData from './data/september-game.json';

const listCategoryPointsAnswers = gameData.questions.map(question => {
    return {
        category: question.category,
        points: question.points,
        answer: question.answer
    };
});

const listText = listCategoryPointsAnswers.map(question => {
    return `${question.category} - ${question.points} - ${question.answer}`;
});

const element = document.querySelector('#app');
listText.forEach(text => {
    const p = document.createElement('div');
    p.textContent = text;
    element.appendChild(p);
});