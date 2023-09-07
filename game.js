class Question {
    constructor(data) {
        this.question = data.question;
        this.answer = data.answer;
        this.category = data.category;
        this.points = data.points;
        this.id = data.id;
        this.isAnswered = false;
    }

    setAnswered() {
        this.isAnswered = true;
    }

    getHalfScore() {
        return parseInt(this.points / 2);
    }
};

class QuestionList {
    constructor() {
        this.list = [];
    }

    addQuestions(questions) {
        this.list = questions.map(question => new Question(question));
    }

    addQuestion(question) {
        this.list.push(question);
    }

    removeQuestion(question) {
        this.list.splice(this.list.indexOf(question), 1);
    }

    getQuestionById(id) {
        return this.list.find(question => question.id === id);
    }

    getQuestionByCategory(category) {
        return this.list.filter(question => question.category === category);
    }

    getQuestionByPoints(points) {
        return this.list.filter(question => question.points === points);
    }

    getQuestionByAnswered() {
        return this.list.filter(question => question.isAnswered === true);
    }

    getQuestionByUnanswered() {
        return this.list.filter(question => question.isAnswered === false);
    }
};

class User {
    constructor(data) {
        this.name = data.name;
        this.score = data.score;
        this.id = data.id;
        this.isTurn = data.isTurn;
        this.historyQuestions = [];
    }

    addQuestion(question, score) {
        this.historyQuestions.push({ question, score });
    }

    getTotalScore() {
        return this.historyQuestions.reduce((total, question) => total + question.score, 0);
    }
};

class UserQueue {
    constructor() {
        this.queue = [];
    }

    addUser(user) {
        this.queue.push(user);
    }

    removeUser(user) {
        this.queue.splice(this.queue.indexOf(user), 1);
    }

    getUserById(id) {
        return this.queue.find(user => user.id === id);
    }

    getUsersByNotTurn() {
        return this.queue.filter(user => user.isTurn === false);
    }

    resetTurn() {
        if (this.getUsersByNotTurn().length === 0) {
            this.queue.forEach(user => user.isTurn = false);
        }
    }

    getUsersByScore() {
        return this.queue.sort((a, b) => a.getTotalScore() - b.getTotalScore());
    }
};

class Answering {
    constructor(user, question, userQueue) {
        this.user = user;
        this.question = question;
        this.userQueue = userQueue;
        this.question.setAnswered();
    }

    userAnswered() {
        this.user.addQuestion(this.question, this.question.points);
    }

    anotherUserAnswered(userId) {
        const user = this.userQueue.getUserById(userId);
        user.addQuestion(this.question, this.question.getHalfScore());
        this.user.addQuestion(this.question, 0);
    }

    noAnswered() {
        this.user.addQuestion(this.question, 0);
    }
}

class NextTurn {
    constructor(userQueue) {
        this.userQueue = userQueue;
    }

    nextTurnUser() {
        const user = this.getRandomUser();
        user.isTurn = true;
        return user;
    }

    getRandomUser() {
        const users = this.userQueue.getUsersByNotTurn();
        const user = users[Math.floor(Math.random() * users.length)];
        return user;
    }
}

class Game {
    constructor(questionList, userQueue) {
        this.questionList = questionList;
        this.userQueue = userQueue;
        this.turn = new NextTurn(this.userQueue);
    }

    start() {
        this.userQueue.resetTurn();
        const user = this.turn.nextTurnUser();
        return user;
    }

    answer(user, userId, question, success) {
        const answering = new Answering(user, question, this.userQueue);
        if (!success) {
            answering.noAnswered();
        } else {
            if (user.id === userId) {
                answering.userAnswered();
            } else {
                answering.anotherUserAnswered(userId);
            }
        }
        const nextUser = this.turn.nextTurnUser();
        return nextUser;
    }
}

// working section to run it

const questionList = new QuestionList();
const userQueue = new UserQueue();

const game = new Game(questionList, userQueue);