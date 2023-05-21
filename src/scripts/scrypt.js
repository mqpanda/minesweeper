// Импорты
import { createBoard } from "./minesweeper.js";

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

// Создание нового элемента 
var title = document.createElement('h1');
var subtitle = document.createElement('h3');
var board = document.createElement('div');

title.textContent = 'Minesweeper';
subtitle.textContent = 'Developed by Daniil Praktika';

// Присвоение класса элементу
title.className = 'title';
subtitle.className = 'subtitle';
board.className = 'board'

// Добавление элемента в <body>
document.body.appendChild(title);
document.body.appendChild(subtitle);
document.body.appendChild(board);

const gameBoard = createBoard(BOARD_SIZE, NUMBER_OF_MINES); 
const boardElement = document.querySelector(".board")
console.log(gameBoard)
gameBoard.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
  })
})
boardElement.style.setProperty("--size", BOARD_SIZE)