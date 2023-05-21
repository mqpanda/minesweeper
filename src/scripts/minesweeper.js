//Логика

export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

export function createBoard(boardSize, numberOfMines) {
  const board = [];

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement('div');
      element.dataset.status = TILE_STATUSES.HIDDEN;

      const tile = {
        element,
        x,
        y,
        mine: false, // Initialize all tiles as non-mine
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        }
      }

      tile.element.addEventListener('click', () => {
        // Generate mine positions if it's the first move
        if (board.every(row => row.every(tile => tile.status !== TILE_STATUSES.NUMBER))) {
          const minePositions = getMinePositions(boardSize, numberOfMines, tile);
          minePositions.forEach(({ x, y }) => {
            board[x][y].mine = true;
          });
        }
        
        revealTile(board, tile);
        checkGameEnd();
      });

      tile.element.addEventListener('contextmenu', e => {
        e.preventDefault();
        markTile(tile);
        listMinesLeft();
      });

      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
  ) {
    return
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

export function revealTile(gameBoard, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  // Первый ход пользователя
  if (gameBoard.every(row => row.every(tile => tile.status === TILE_STATUSES.HIDDEN))) {
    const boardSize = gameBoard.length;
    const numberOfMines = 10; // Количество мин, которое вы хотите разместить
    const minePositions = getMinePositions(boardSize, numberOfMines, tile); // Генерация позиций мин
    console.log(minePositions);

    // Обновление свойства mine для соответствующих тайлов на доске
    minePositions.forEach(position => {
      const { x, y } = position;
      gameBoard[x][y].mine = true;
    });
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(gameBoard, tile);
  const mines = adjacentTiles.filter(t => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, gameBoard));
  } else {
    tile.element.textContent = mines.length;
  }
}


export function checkWin(gameBoard)
{
  return gameBoard.every(row => {
    return row.every(tile => {
      return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN 
      || tile.status === TILE_STATUSES.MARKED))
    })
  })
}

export function checkLose(gameBoard)
{
return gameBoard.some(row => {
  return row.some(tile => {
    return tile.status === TILE_STATUSES.MINE
  })
})
}

function getMinePositions(boardSize, numberOfMines, firstTile) {
  const positions = [];
  const excludedPositions = new Set();

  // Exclude the first tile position
  excludedPositions.add(`${firstTile.x},${firstTile.y}`);

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    const positionString = `${position.x},${position.y}`;
    if (!excludedPositions.has(positionString)) {
      positions.push(position);
      excludedPositions.add(positionString);
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
  return Math.floor(Math.random() * size)
}

function nearbyTiles(gameBoard, {x, y})
{
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = gameBoard[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }

  return tiles

}