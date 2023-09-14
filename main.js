import './style.css'
import { initGame } from './src/game';
import gameData from './data/test-game.json'
import { questionTable } from './src/components/question-table';
import { questionModal } from './src/components/question-modal';
import { userRating } from './src/components/user-rating';
import { addUser } from './src/components/add-user';

document.querySelector('#app').innerHTML = `
  <h1>Jeopardy New!</h1>
  
  <div class="main">
    <div id="userRating">
      <div id="userRatingTable"></div>
      <div id="newUser"></div>
    </div>

    <div id="gameBlock">
      <div id="questionTable"></div>
      <div class="overlay">
        <button id="startGame">Start game</button>
      </div>
    </div>
  </div>
  <div id="questionModal" data-ml-modal></div>
`;

const game = initGame(gameData.questions);
window.game = game;

document.querySelector('#startGame').addEventListener('click', (e) => {
  game.start();
  document.querySelector('#gameBlock .overlay').classList.add('hidden');
});

questionTable(document.querySelector('#questionTable'), game);
questionModal(document.querySelector('#questionModal'), game);

addUser(document.querySelector('#newUser'), game);
userRating(document.querySelector('#userRatingTable'), game);