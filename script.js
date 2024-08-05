const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const gridWidth = canvas.width / tileSize;
const gridHeight = canvas.height / tileSize;

let pacMan = { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) };
let pellets = [];
let ghosts = [
    { x: 1, y: 1, dx: 1, dy: 0 },
    { x: gridWidth - 2, y: gridHeight - 2, dx: -1, dy: 0 }
];
let score = 0;
let gameActive = true;

// Initialize pellets
const initializePellets = () => {
    pellets = [];
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            if ((x !== pacMan.x || y !== pacMan.y) && Math.random() < 0.2) {
                pellets.push({ x, y });
            }
        }
    }
};

const drawPacMan = () => {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacMan.x * tileSize + tileSize / 2, pacMan.y * tileSize + tileSize / 2, tileSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacMan.x * tileSize + tileSize / 2, pacMan.y * tileSize + tileSize / 2);
    ctx.fill();
};

const drawPellets = () => {
    ctx.fillStyle = 'white';
    pellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x * tileSize + tileSize / 2, pellet.y * tileSize + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
        ctx.fill();
    });
};

const drawGhosts = () => {
    ctx.fillStyle = 'red';
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    });
};

const drawScore = () => {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, canvas.height - 10);
};

const movePacMan = (dx, dy) => {
    pacMan.x = (pacMan.x + dx + gridWidth) % gridWidth;
    pacMan.y = (pacMan.y + dy + gridHeight) % gridHeight;

    // Check for pellet collection
    pellets = pellets.filter(pellet => {
        if (pellet.x === pacMan.x && pellet.y === pacMan.y) {
            score += 10;
            return false;
        }
        return true;
    });
};

const moveGhosts = () => {
    ghosts.forEach(ghost => {
        ghost.x = (ghost.x + ghost.dx + gridWidth) % gridWidth;
        ghost.y = (ghost.y + ghost.dy + gridHeight) % gridHeight;

        // Simple AI for ghost movement
        if (Math.random() < 0.1) {
            ghost.dx = Math.random() > 0.5 ? tileSize : -tileSize;
            ghost.dy = Math.random() > 0.5 ? tileSize : -tileSize;
        }
    });
};

const checkCollision = () => {
    ghosts.forEach(ghost => {
        if (ghost.x === pacMan.x && ghost.y === pacMan.y) {
            gameActive = false;
            document.getElementById('status').textContent = `Game Over! Pontuação final: ${score}`;
        }
    });
};

const updateGame = () => {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveGhosts();
    checkCollision();
    drawPacMan();
    drawPellets();
    drawGhosts();
    drawScore();
};

const changeDirection = (event) => {
    if (event.code === 'ArrowUp') movePacMan(0, -1);
    if (event.code === 'ArrowDown') movePacMan(0, 1);
    if (event.code === 'ArrowLeft') movePacMan(-1, 0);
    if (event.code === 'ArrowRight') movePacMan(1, 0);
};

const resetGame = () => {
    pacMan = { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) };
    score = 0;
    gameActive = true;
    document.getElementById('status').textContent = '';
    initializePellets();
};

document.addEventListener('keydown', changeDirection);
document.getElementById('reset').addEventListener('click', resetGame);

initializePellets();
setInterval(updateGame, 200);
