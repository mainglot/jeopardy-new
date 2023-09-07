import './style.css'
import { initGame } from './src/game';
import gameData from './data/test-game.json'
import { questionTable } from './src/components/question-table';
import { questionModal } from './src/components/question-modal';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Jeopardy New!</h1>
    <div id="questionTable"></div>
    <div id="userRating">
      <div id="newUser"></div>
      <div id="userRatingTable"></div>
    </div>
    <div id="userQueue"></div>
    <div id="questionModal"></div>
  </div>
`;

const game = initGame(gameData.questions);
window.game = game;

questionTable(document.querySelector('#questionTable'), game);
questionModal(document.querySelector('#questionModal'), game);