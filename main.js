import './style.css'
import { initGame } from './src/game';
import gameData from './data/test-game.json'
import { questionTable } from './src/components/question-table';
import { questionModal } from './src/components/question-modal';
import { userRating } from './src/components/user-rating';
import { addUser } from './src/components/add-user';
import { userQueue } from './src/components/user-queue';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Jeopardy New!</h1>
    <button id="startGame">Start game</button>
    <div id="questionTable"></div>
    <div id="userRating">
      <div id="newUser"></div>
      <div id="userRatingTable"></div>
    </div>
    <div id="userQueue"></div>
    <div id="questionModal" data-ml-modal></div>
  </div>
`;

const game = initGame(gameData.questions);
window.game = game;

document.querySelector('#startGame').addEventListener('click', (e) => {
  game.start();
  e.target.disabled = true;
});

questionTable(document.querySelector('#questionTable'), game);
questionModal(document.querySelector('#questionModal'), game);

addUser(document.querySelector('#newUser'), game);
userRating(document.querySelector('#userRatingTable'), game);
userQueue(document.querySelector('#userQueue'), game);