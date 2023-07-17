const Player = (name, mark) => {
  let playerName = name;

  const setName = (player) => {
    playerName = player;
  };

  const getName = () => playerName;

  return { mark, setName, getName };
};

const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const placeMark = (index, mark) => {
    board.splice(index, 1, mark);
  };

  const getBoard = () => board;

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  return { getBoard, placeMark, resetBoard };
})();

const gameConditions = (() => {
  let roundWon = false;

  const getRoundStatus = () => roundWon;

  const resetRoundStatus = () => {
    roundWon = false;
  };

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWin = () => {
    const activeBoard = gameBoard.getBoard();

    for (let i = 0; i < winConditions.length; i++) {
      let a = activeBoard[winConditions[i][0]];
      let b = activeBoard[winConditions[i][1]];
      let c = activeBoard[winConditions[i][2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }
  };

  return { getRoundStatus, checkWin, resetRoundStatus };
})();

const gameController = (() => {
  const player1 = Player('Player1', 'x');
  const player2 = Player('Player2', 'o');

  let currentPlayer = player1;

  const resetPlayers = () => {
    player1.setName('Player1');
    player2.setName('Player2');
  };

  const switchPlayerTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player1;
    gameConditions.resetRoundStatus();
  };

  const playGame = (selectedTile) => {
    gameBoard.placeMark(selectedTile, gameController.getCurrentPlayer().mark);
    gameConditions.checkWin();
    if (gameConditions.getRoundStatus()) {
      return;
    }
    switchPlayerTurn();
  };

  return {
    switchPlayerTurn,
    getCurrentPlayer,
    playGame,
    resetGame,
    resetPlayers,
    player1,
    player2,
  };
})();

const modalHandler = (() => {
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const next = document.querySelector('#next');

  const playerName = document.querySelector('#name1');
  const playerLabel = document.querySelector('#nameLabel');

  const toggleModal = () => {
    overlay.classList.toggle('hidden');
    modal.classList.toggle('hidden');
  };

  next.addEventListener('click', () => {
    if (next.textContent === 'Start') {
      toggleModal();
      if (playerName.value !== '') {
        gameController.player2.setName(playerName.value);
      }
      playerName.value = '';
      playerLabel.textContent = "Player 1's Name:";
      next.textContent = 'Next';
      displayController.renderGame();
      return;
    }
    if (next.textContent === 'Next') {
      if (playerName.value !== '') {
        gameController.player1.setName(playerName.value);
      }
      playerName.value = '';
      playerLabel.textContent = "Player 2's Name:";
      next.textContent = 'Start';
    }
  });

  return { toggleModal };
})();

const displayController = (() => {
  const gameContainer = document.querySelector('.gameBoard');
  const currentPlayerTurn = document.querySelector('.playerTurn');
  const resetButton = document.querySelector('#reset');

  const renderGame = () => {
    if (gameConditions.getRoundStatus()) {
      currentPlayerTurn.textContent = `The Winner Is: ${gameController
        .getCurrentPlayer()
        .getName()}!`;
    } else if (!gameBoard.getBoard().includes('')) {
      currentPlayerTurn.textContent = `It's a Tie!`;
    } else {
      currentPlayerTurn.textContent = `${gameController
        .getCurrentPlayer()
        .getName()}'s Turn`;
    }

    gameContainer.textContent = '';
    gameBoard.getBoard().forEach((item, index) => {
      const newBut = document.createElement('button');
      newBut.textContent = item;
      newBut.setAttribute('class', 'tile');
      newBut.setAttribute('data-index', index);
      gameContainer.appendChild(newBut);
    });
  };

  const clickHandler = (e) => {
    const selectedTile = e.target.dataset.index;
    if (!selectedTile) return;
    if (gameConditions.getRoundStatus() || !gameBoard.getBoard().includes('')) {
      gameController.resetGame();
      renderGame();
      return;
    }
    if (e.target.textContent !== '') return;
    gameController.playGame(selectedTile);
    renderGame();
  };

  gameContainer.addEventListener('click', clickHandler);

  const reset = () => {
    gameController.resetGame();
    gameController.resetPlayers();
    renderGame();
    modalHandler.toggleModal();
  };

  resetButton.addEventListener('click', reset);

  renderGame();
  modalHandler.toggleModal();

  return { renderGame };
})();
