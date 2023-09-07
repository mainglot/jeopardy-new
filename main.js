import './style.css'
import { initGame } from './src/game';
import gameData from './data/test-game.json'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Jeopardy New!</h1>
    <div id="questionTable"></div>
    <div id="userRating"></div>
    <div id="userQueue"></div>
    <div id="questionModal"></div>
  </div>
`;

const game = initGame(gameData.questions);
window.game = game;