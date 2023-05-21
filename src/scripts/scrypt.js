// Импорты
import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose} from "./minesweeper.js";

// Создание нового элемента 
var title = document.createElement('h1');
var subtitle = document.createElement('h3');
var board = document.createElement('div');
var counter = document.createElement('div');
var span = document.createElement('span');
var minesText = document.createElement('span');

// Добавляем текст внутрь span-элемента
var text = document.createTextNode('10');
span.appendChild(text);

// Добавляем span-элемент внутрь div-элемента
counter.appendChild(span);

span.setAttribute('data-mine-count', '10');

title.textContent = 'Minesweeper';
subtitle.textContent = 'Developed by Daniil Praktika';
minesText.textContent = 'Mines left:';


// Присвоение класса элементу
title.className = 'title';
subtitle.className = 'subtitle';
board.className = 'board'
minesText.className = 'mines-text';
counter.className = 'subtext';

// Добавление элемента в <body>
document.body.appendChild(title);
document.body.appendChild(subtitle);
document.body.appendChild(minesText);
document.body.appendChild(counter);
document.body.appendChild(board);


const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

let longPressTimeout;

const gameBoard = createBoard(BOARD_SIZE, NUMBER_OF_MINES); 
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

console.log(gameBoard)

gameBoard.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener('click', () => {
      revealTile(gameBoard, tile)
      checkGameEnd()
    })
    tile.element.addEventListener('contextmenu', e => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
    
  })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const markedTilesCount = gameBoard.reduce((count, row) => {
    return (
      count +
      row.filter(
        tile =>
          tile.status === TILE_STATUSES.MARKED || tile.status === TILE_STATUSES.FLAGGED
      ).length
    );
  }, 0);

  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

tile.element.addEventListener('click', () => {
  clearTimeout(longPressTimeout); // Clear the long-press timeout
  revealTile(gameBoard, tile);
  checkGameEnd();
});

tile.element.addEventListener('mousedown', () => {
  longPressTimeout = setTimeout(() => {
    markTile(tile);
    listMinesLeft();
  }, 500); // Set the long-press timeout to 500ms (adjust as needed)
});

tile.element.addEventListener('mouseup', () => {
  clearTimeout(longPressTimeout); // Clear the long-press timeout
});


function checkGameEnd()
{
  const win = checkWin(gameBoard)
  const lose = checkLose(gameBoard)

  if(win || lose)
  {
    boardElement.addEventListener('click', stopProp, {capture: true})
    boardElement.addEventListener('contextmenu', stopProp, {capture: true})
  }

  if(win)
  {
    messageText.textContent = 'Ура! Вы нашли все мины за ## секунд и N ходов!'
  }
  if(lose) {
    messageText.textContent = 'Игра окончена. Попробуйте еще раз'
    gameBoard.forEach(row =>{
      row.forEach(tile => {
        if(tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile(tile)
        if(tile.mine) revealTile(gameBoard, tile)
      })
    })
  }
}

function stopProp(e)
{
  e.stopImmediatePropagation()
}