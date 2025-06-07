// 模拟用户数据库
const users = [];
let currentUser = null;
let score = 0;
let timeLeft = 60;
let moleInterval;
let plantInterval;
let timerInterval;
let gameBoard;

// 注册功能
document.getElementById('register-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        const newUser = { username, password, score: 0 };
        users.push(newUser);
        alert('注册成功！');
    } else {
        alert('用户名和密码不能为空！');
    }
});

// 登录功能
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            alert('登录成功！');
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('difficulty-section').style.display = 'block';
        } else {
            alert('用户名或密码错误！');
        }
    } else {
        alert('用户名和密码不能为空！');
    }
});

// 排行榜功能（简单模拟）
document.getElementById('leaderboard-btn').addEventListener('click', () => {
    const sortedUsers = users.sort((a, b) => b.score - a.score);
    let leaderboard = '排行榜：\n';
    sortedUsers.forEach((user, index) => {
        leaderboard += `${index + 1}. ${user.username}: ${user.score}\n`;
    });
    alert(leaderboard);
});

// 选择简单难度
document.getElementById('easy-btn').addEventListener('click', () => {
    startGame(3, 1000, 1, 1);
    document.getElementById('difficulty-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
});

// 选择困难难度
document.getElementById('hard-btn').addEventListener('click', () => {
    startGame(9, 500, 5, 5);
    document.getElementById('difficulty-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
});

// 重置游戏
document.getElementById('reset-btn').addEventListener('click', () => {
    resetGame();
});

// 开始游戏
function startGame(gridSize, interval, moleCount, plantCount) {
    score = 0;
    timeLeft = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = timeLeft;

    gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement('div');
        tile.addEventListener('click', () => {
            if (tile.classList.contains('mole')) {
                score += 10;
                document.getElementById('score').textContent = score;
                tile.classList.remove('mole');
            } else if (tile.classList.contains('plant')) {
                endGame();
            }
        });
        gameBoard.appendChild(tile);
    }

    moleInterval = setInterval(() => {
        const tiles = document.querySelectorAll('#game-board div');
        tiles.forEach(tile => tile.classList.remove('mole'));
        for (let i = 0; i < moleCount; i++) {
            const randomIndex = Math.floor(Math.random() * tiles.length);
            tiles[randomIndex].classList.add('mole');
        }
    }, interval);

    plantInterval = setInterval(() => {
        const tiles = document.querySelectorAll('#game-board div');
        tiles.forEach(tile => tile.classList.remove('plant'));
        for (let i = 0; i < plantCount; i++) {
            const randomIndex = Math.floor(Math.random() * tiles.length);
            tiles[randomIndex].classList.add('plant');
        }
    }, interval);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 结束游戏
function endGame() {
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    clearInterval(timerInterval);
    const tiles = document.querySelectorAll('#game-board div');
    tiles.forEach(tile => tile.style.pointerEvents = 'none');
    if (currentUser) {
        currentUser.score = score;
    }
    alert(`游戏结束，你的分数是: ${score}`);
    const sortedUsers = users.sort((a, b) => b.score - a.score);
    let leaderboard = '排行榜：\n';
    sortedUsers.forEach((user, index) => {
        leaderboard += `${index + 1}. ${user.username}: ${user.score}\n`;
    });
    alert(leaderboard);
}

// 重置游戏
function resetGame() {
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    clearInterval(timerInterval);
    const tiles = document.querySelectorAll('#game-board div');
    tiles.forEach(tile => {
        tile.classList.remove('mole', 'plant');
        tile.style.pointerEvents = 'auto';
    });
    startGame(3, 1000, 1, 1); // 默认简单难度
}