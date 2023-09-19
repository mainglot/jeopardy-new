import './style.css'
import { initGame } from './src/game';
import gameData from './data/test-game.json'
import { questionTable } from './src/components/question-table';
import { questionModal } from './src/components/question-modal';
import { userRating } from './src/components/user-rating';
import { addUser } from './src/components/add-user';
import { nextUserButton } from './src/components/next-user-button';
import { questionHistory } from './src/components/question-history';

document.querySelector('#app').innerHTML = `
  <h1 id="game-title">Jeopardy New!</h1>
  
  <div class="main">
    <div id="userRating">
      <div id="userRatingTable"></div>
      <div id="newUser"></div>
      <div id="nextUser"></div>
    </div>

    <div id="gameBlock">
      <div id="questionTable"></div>
      <div class="overlay">
        <button id="startGame">Start game</button>
      </div>
    </div>
  </div>
  <div id="gameHistory"></div>
  <div id="questionModal" data-ml-modal></div>
`;

const game = initGame(gameData);
window.game = game;
document.querySelector('#game-title').innerHTML = gameData.gameName;

document.querySelector('#startGame').addEventListener('click', (e) => {
  game.start();
  document.querySelector('#gameBlock .overlay').classList.add('hidden');
});

questionTable(document.querySelector('#questionTable'), game);
questionModal(document.querySelector('#questionModal'), game);
questionHistory(document.querySelector('#gameHistory'), game);

addUser(document.querySelector('#newUser'), game);
userRating(document.querySelector('#userRatingTable'), game);
nextUserButton(document.querySelector('#nextUser'), game);