class BaseCustomEvent {
    trigger(event, data) {
        window.document.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
}

class Question extends BaseCustomEvent {
    constructor(data) {
        super();
        this.question = data.question;
        this.answer = data.answer;
        this.category = data.category;
        this.points = data.points;
        this.isAnswered = false;
        this.generateId();
    }

    generateId() {
        this.id = Math.floor(Math.random() * 1000);
    }

    setAnswered() {
        if (this.isAnswered) {
            return;
        }
        this.isAnswered = true;
        this.trigger('questionAnswered', this);
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
        while (this.getQuestionById(question.id)) {
            question.generateId();
        }
        this.list.push(question);
    }

    removeQuestion(question) {
        this.list.splice(this.list.indexOf(question), 1);
    }

    getQuestionById(id) {
        return this.list.find(question => question.id === id);
    }

    getQuestionsByCategory(category) {
        return this.list.filter(question => question.category === category).sort((a, b) => a.points - b.points);
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

    getCategories() {
        return this.list.map(question => question.category).filter((category, index, self) => self.indexOf(category) === index).sort();
    }

    getPoints() {
        return this.list.map(question => question.points).filter((points, index, self) => self.indexOf(points) === index).sort();
    }

    selectRandomQuestion(trigger = false) {
        const questions = this.getQuestionByUnanswered();
        const question = questions[Math.floor(Math.random() * questions.length)];
        if (trigger) {
            question.trigger('questionSelected', question);
        }
        return question;
    }
};

class User extends BaseCustomEvent {
    constructor(data) {
        super();
        this.name = data.name;
        this.score = 0;
        this.isTurn = false;
        this.historyQuestions = [];
        this.generateId();
    }

    generateId() {
        this.id = Math.floor(Math.random() * 1000).toString();
    }

    addQuestion(question, score) {
        this.historyQuestions.push({ question, score });
        this.score = this.getTotalScore();
        this.trigger('userAnswered', this);
    }

    getTotalScore() {
        return this.historyQuestions.reduce((total, question) => total + question.score, 0);
    }

    isAnswered(question) {
        return !!this.historyQuestions.find(item => item.question.id === question.id && item.score > 0);
    }
};

class QuestionConditions {
    constructor(conditions) {
        this.wrongAnswer = conditions.wrongAnswer || false;
        this.wrongAnswerCondition = conditions.wrongAnswerCondition || null;
    }

    calculateWrongAnswer(score) {
        const defaultScore = 0;
        if (!this.wrongAnswer) {
            return defaultScore;
        }
        if (this.wrongAnswerCondition) {
            if (this.wrongAnswerCondition.pointsMin && score < this.wrongAnswerCondition.pointsMin) {
                return defaultScore;
            }
            if (this.wrongAnswerCondition.pointsMax && score > this.wrongAnswerCondition.pointsMax) {
                return defaultScore;
            }
        }
        if (this.wrongAnswer === 'half') {
            return parseInt(score / 2);
        }
        if (this.wrongAnswer === 'zero') {
            return 0;
        }
        return score;
    }
}

class UserQueue extends BaseCustomEvent {
    constructor() {
        super();
        this.queue = [];
    }

    addUser(userData) {
        const user = new User(userData);
        while (this.getUserById(user.id)) {
            this.user.generateId();
        }
        this.queue.push(user);
        this.trigger('userAdded', user);
    }

    getUsers() {
        return this.queue;
    }

    removeUser(user) {
        this.queue.splice(this.queue.indexOf(user), 1);
        this.trigger('userRemoved');
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
        this.trigger('userTurnReset');
    }

    getUsersByScore() {
        return this.queue.sort((a, b) => a.getTotalScore() - b.getTotalScore());
    }
};

class Answering {
    constructor(user, question, userQueue, questionConditions) {
        this.user = user;
        this.question = question;
        this.userQueue = userQueue;
        this.questionConditions = questionConditions;
        this.question.setAnswered();
    }

    userAnswered() {
        this.user.addQuestion(this.question, this.question.points);
    }

    anotherUserAnswered(userId) {
        const user = this.userQueue.getUserById(userId);
        user.addQuestion(this.question, this.question.getHalfScore());
        this.user.addQuestion(this.question, this.getWrongAnswerScores());
    }

    noAnswered() {
        this.user.addQuestion(this.question, this.getWrongAnswerScores());
    }

    getWrongAnswerScores() {
        return this.questionConditions.calculateWrongAnswer(this.question.points) * -1;
    }
}

class NextTurn extends BaseCustomEvent {
    constructor(userQueue) {
        super();
        this.userQueue = userQueue;
        this.currentUser = null;
    }

    nextTurnUser() {
        const notTurnedUsers = this.userQueue.getUsersByNotTurn();
        if (notTurnedUsers.length === 0) {
            this.userQueue.resetTurn();
        }
        const user = notTurnedUsers !== 1 ? this.getRandomUser() : notTurnedUsers[0];
        user.isTurn = true;
        this.currentUser = user;
        this.trigger('userTurnChanged', user);
        return user;
    }

    getRandomUser() {
        const users = this.userQueue.getUsersByNotTurn();
        const user = users[Math.floor(Math.random() * users.length)];
        this.currentUser = user;
        return user;
    }
}

class Game extends BaseCustomEvent {
    constructor(questionList, userQueue, conditions) {
        super();
        this.questionList = questionList;
        this.userQueue = userQueue;
        this.turn = new NextTurn(this.userQueue);
        this.isStarted = false;
        this.questionConditions = new QuestionConditions(conditions);
    }

    start() {
        this.isStarted = true;
        this.userQueue.resetTurn();
        const user = this.turn.nextTurnUser();
        this.selectedQuestion = this.questionList.selectRandomQuestion(true);
        this.trigger('gameStarted', this);
        return user;
    }

    isGameOver() {
        return this.questionList.getQuestionByUnanswered().length === 0;
    }

    answer(userId, question, success) {
        const user = this.turn.currentUser;
        const answering = new Answering(user, question, this.userQueue, this.questionConditions);
        this.selectedQuestion = null;

        if (!success) {
            answering.noAnswered();
        } else {
            if (user.id === userId) {
                answering.userAnswered();
            } else {
                answering.anotherUserAnswered(userId);
            }
        }

        this.trigger('usersAnswered');

        if (this.isGameOver()) {
            this.trigger('gameOver', this);
            return;
        }
    }

    next() {
        this.turn.nextTurnUser();
        if (this.userQueue.getUsersByNotTurn().length === 0) {
            this.selectedQuestion = this.questionList.selectRandomQuestion(true);
        }
    }
}

export function initGame(gameData) {
    const questionList = new QuestionList();
    const userQueue = new UserQueue();

    questionList.addQuestions(gameData.questions);

    const game = new Game(questionList, userQueue, gameData.conditions);

    return game;
}