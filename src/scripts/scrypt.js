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
