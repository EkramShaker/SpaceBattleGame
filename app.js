class Spaceship {
  constructor(name, hull, firepower, accuracy) {
    this.name = name;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }

  attack(enemy) {
    if (Math.random() < this.accuracy) {
      enemy.hull -= this.firepower;
      logMessage(`${this.name} hit ${enemy.name} for ${this.firepower} damage.`);
      if (enemy.hull <= 0) {
        logMessage(`${enemy.name} has been destroyed!`);
      }
    } else {
      logMessage(`${this.name} missed!`);
    }
  }
}

const playerShip = new Spaceship('USS Assembly', 35, 6, 0.8);

const alienFleet = [
  new Spaceship('Alien Ship 1', 10, 3, 0.6),
  new Spaceship('Alien Ship 2', 12, 4, 0.6),
  new Spaceship('Alien Ship 3', 14, 3, 0.5),
  new Spaceship('Alien Ship 4', 16, 4, 0.6),
  new Spaceship('Alien Ship 5', 18, 4, 0.7),
  new Spaceship('Alien Ship 6', 20, 4, 0.7),
];

const playerStatus = document.getElementById('player-status');
const enemyStatus = document.getElementById('enemy-status');
const gameLog = document.getElementById('game-log');
const startGameButton = document.getElementById('start-game');
const fireButton = document.getElementById('fire-button');
const retreatButton = document.getElementById('retreat-button');
const playerShipElement = document.getElementById('player-ship');
const enemyShipElement = document.getElementById('enemy-ship');
const shootSound = document.getElementById('shoot-sound');

function updateStatus() {
  playerStatus.textContent = `Player Ship Status: ${playerShip.hull > 0 ? playerShip.hull : 'Destroyed'}`;
  enemyStatus.textContent = `Enemy Ships Remaining: ${alienFleet.length}`;
}

function logMessage(message) {
  const p = document.createElement('p');
  p.textContent = message;
  gameLog.appendChild(p);
  gameLog.scrollTop = gameLog.scrollHeight;
}

function animateShip(shipElement) {
  shipElement.querySelector('img').style.animation = 'moveAttack 0.5s ease-in-out';

  setTimeout(() => {
    shipElement.querySelector('img').style.animation = '';
  }, 500);
}

function removeLosingShip(loserElement) {
  loserElement.querySelector('img').style.opacity = '0'; 
}

function battleRound(player, enemy) {
  playShootSound(); 
  showLaserEffect(playerShipElement); 
  
  animateShip(playerShipElement); 
  player.attack(enemy);
  updateStatus();

  if (enemy.hull > 0) {
    setTimeout(() => {
      playShootSound(); 
      showLaserEffect(enemyShipElement); 
      animateShip(enemyShipElement); 
      enemy.attack(player);
      updateStatus();

      if (player.hull <= 0) {
        logMessage('Your ship has been destroyed. Game Over.');
        removeLosingShip(playerShipElement); 
        disableButtons(); 
      }
    }, 1000);
  }

  if (enemy.hull <= 0) {
    removeLosingShip(enemyShipElement); 
    alienFleet.shift(); 
    updateStatus();
    updateEnemyVisuals(); 
    if (alienFleet.length === 0) {
      logMessage('You have defeated all the alien ships! Victory!');
      disableButtons();
    }
  }
}

function playShootSound() {
  shootSound.play();
}

function showLaserEffect(shipElement) {
  const laser = document.createElement('div');
  laser.className = 'laser';
  document.body.appendChild(laser);
  
  const rect = shipElement.getBoundingClientRect();
  laser.style.left = `${rect.right}px`;
  laser.style.top = `${rect.top + rect.height / 2}px`;
  
  laser.style.display = 'block';

  setTimeout(() => {
    laser.style.display = 'none';
    laser.remove();
  }, 500); 
}

function updateEnemyVisuals() {
  if (alienFleet.length > 0) {
    enemyShipElement.querySelector('img').style.opacity = '1'; 
  } else {
    logMessage('All enemies have been defeated!');
    disableButtons();
  }
}

function disableButtons() {
  fireButton.disabled = true;
  retreatButton.disabled = true;
}

fireButton.addEventListener('click', () => {
  if (alienFleet.length > 0) {
    logMessage(`Enemy encountered: ${alienFleet[0].name}`);
    battleRound(playerShip, alienFleet[0]);
  } else {
    logMessage('No enemies left!');
  }
});

retreatButton.addEventListener('click', () => {
  logMessage('You retreated from the battle.');
  disableButtons();
});

startGameButton.addEventListener('click', () => {
  logMessage('Game Started! Battle begins...');
  fireButton.disabled = false;
  retreatButton.disabled = false;
  updateEnemyVisuals(); 
  updateStatus();
});
