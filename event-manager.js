/////////////////////////////////////////////////
///////////EVENT MANAGER/////////////////////////
////////////////////////////////////////////////

var eventsManager = {
    bind: [], // сопоставление клавиш действиям
    action: [], // действия
    setup: function () { // настройка сопоставления
        this.bind[87] = 'up'; // w - двигаться вверх
        this.bind[65] = 'left'; // a - двигаться влево
        this.bind[83] = 'down'; // s - двигаться вниз
        this.bind[68] = 'right'; // d - двигаться вправо
        this.bind[32] = 'fire'; // пробел - выстрелить
        this.bind[49] = 'pistol';
        this.bind[50] = 'uzi';
        this.bind[51] = 'shotgun';
        this.bind[99] = 'killAll';
        // контроль событий клавиатуры
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    },
    onKeyDown: function (event) {
        var action = eventsManager.bind[event.keyCode];
        if (eventsManager.action['left'] !== true && eventsManager.action['right'] !== true
            && eventsManager.action['up'] !== true && eventsManager.action['down'] !== true) {
            if (action) // проверка на action === true
                eventsManager.action[action] = true; // выполняем действие
        } else {
            // if (action === 'fire') {
            //     eventsManager.action[action] = true;
            // }
        }
        if (action === 'fire') {
            eventsManager.action[action] = true;
        }
        if (eventsManager.action['left'] === true || eventsManager.action['right'] === true
            || eventsManager.action['up'] === true || eventsManager.action['down'] === true) {
            if (gameManager.lastKeys.length === 0) {
                if (eventsManager.action['left'] === true && action !== 'left') {
                    var right = true;
                    for (var i = 0; i < gameManager.lastKeys.length; i++) {
                        if (gameManager.lastKeys[i] === 'left'){
                            right = false;
                            break;
                        }
                    }
                    if (right)
                        gameManager.lastKeys.push('left');
                }
                if (eventsManager.action['right'] === true && action !== 'right') {
                    var right = true;
                    for (var i = 0; i < gameManager.lastKeys.length; i++) {
                        if (gameManager.lastKeys[i] === 'right'){
                            right = false;
                            break;
                        }
                    }
                    if (right)
                    gameManager.lastKeys.push('right');
                }
                if (eventsManager.action['up'] === true && action !== 'up') {
                    var right = true;
                    for (var i = 0; i < gameManager.lastKeys.length; i++) {
                        if (gameManager.lastKeys[i] === 'up'){
                            right = false;
                            break;
                        }
                    }
                    if (right)
                    gameManager.lastKeys.push('up');
                }
                if (eventsManager.action['down'] === true && action !== 'down') {
                    var right = true;
                    for (var i = 0; i < gameManager.lastKeys.length; i++) {
                        if (gameManager.lastKeys[i] === 'down'){
                            right = false;
                            break;
                        }
                    }
                    if (right)
                    gameManager.lastKeys.push('down');
                }
            }
            eventsManager.action['left'] = false;
            eventsManager.action['right'] = false;
            eventsManager.action['up'] = false;
            eventsManager.action['down'] = false;
        }
        if (action) {// проверка на action === true
            eventsManager.action[action] = true; // выполняем действие
            var right = true;
            for (var i = 0; i < gameManager.lastKeys.length; i++) {
                if (gameManager.lastKeys[i] === action){
                    right = false;
                    break;
                }
            }
            if (right)
            gameManager.lastKeys.push(action);
        }
    },
    onKeyUp: function (event) {
        var action = eventsManager.bind[event.keyCode];
        if (action)
            eventsManager.action[action] = false; // отменили действие
        if (action === 'left' || action === 'right' || action === 'up' || action === 'down' ) {
            for (var i = gameManager.lastKeys.length - 1; i >= 0; i--) {
                if (action === gameManager.lastKeys[i]) gameManager.lastKeys.splice(i, 1);
            }
        }
    }
};