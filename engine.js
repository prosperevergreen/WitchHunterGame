
///////////////////////////////////////////////
////////////ENTITIES//////////////////////////
/////////////////////////////////////////////

var Entity = {
    pos_x: 0, pos_y: 0, // позиция объекта
    size_x: 0, size_y: 0, // размеры объекта
    extend: function (extendProto) { // расширение сущности
        var object = Object.create(this); // создание нового объекта
        for (var property in extendProto) { // для всех свойств нового объекта
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                // если свойства отсутствуют в родительском объекте, то добавляем
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};

var Player = Entity.extend({
    lifetime: 10,
    currentFrame: 0,
    direction: 1,
    dirSprite: null,
    lastFrame: 0,
    shooting: false,
    gun: 'pistol',
    frameReload: 0,
    ammunition: 20,
    move_x: 0, move_y: 0, // направление движения
    speed: 15, // скорость объекта
    draw: function (ctx) { // прорисовка объекта
        // spriteManager.drawSprite(ctx,this.dirSprite, this.pos_x, this.pos_y);
        spriteManager.drawSprite(ctx,this.dirSprite, this.pos_x, this.pos_y, this.currentFrame, 50);
        if (this.frameReload >= 2) {
            this.currentFrame++;
            this.frameReload = 0;
        }
        if (this.currentFrame > 3) this.currentFrame = 0;
    },
    update: function () { // обновление в цикле
        this.frameReload++;
        var result = physicManager.update(this);
        if (result === 'stop') {this.currentFrame = 0;}
        if (result === 'stop' && this.shooting) {this.currentFrame = 5; this.shooting = false;}
        if (result === 'move_left') {this.direction = 0; this.dirSprite = 'witch-left';}
        if (result === 'move_right') {this.direction = 1; this.dirSprite = 'witch-right';}
        if (result === 'move_up') {this.direction = 3; this.dirSprite = 'witch-back';}
        if (result === 'move_down') {this.direction = 2; this.dirSprite = 'witch-front';}
    },
    onTouchEntity: function (obj) { // обработка столкновения с препятствием
        
    },
    kill: function () { // уничтожение объекта
        
        gameManager.kill(this);

        localStorage.setItem("lastScore", gameManager.score);

        window.location = 'menu.html';
    },
    fire: function () { // выстрел
        var shotgun = false;
        if ((gameManager.time >= 5 && this.gun.match(/Pistol/)) ||
            (gameManager.time >= 2 && this.gun.match(/Uzi/)) || (gameManager.time >= 5 && this.gun.match(/Shotgun/))) {
            gameManager.time = 0;
        } else return;
        if (this.ammunition > 0 || (this.ammunition === 0 && this.gun.match(/Pistol/))) {
            var bullet = Object.create(Bullet);
            if (this.gun.match(/Pistol/)) {
                soundManager.play('music/shoot.mp3', {looping: false, volume: 1});
                bullet.speed = 50;
                bullet.name = "bullet_pistol" + (++gameManager.fireNum);
                bullet.size_x = 17; bullet.size_y = 17;
                bullet.move_x = this.move_x;
                bullet.move_y = this.move_y;
            }
            else if (this.gun.match(/Uzi/)) {
                this.ammunition--;
                soundManager.play('music/uzi_shoot.mp3', {looping: false, volume: 1});
                bullet.speed = 80;
                bullet.name = "bullet_uzi" + (++gameManager.fireNum);
                bullet.size_x = 17; bullet.size_y = 17;
                bullet.move_x = this.move_x;
                bullet.move_y = this.move_y;
            } else {
                this.ammunition--;
                shotgun = true;
                var bullet2 = Object.create(Bullet);
                var bullet3 = Object.create(Bullet);
                bullet.speed = 50;
                bullet2.speed = 50;
                bullet3.speed = 50;
                bullet.name = "bullet_shotgun" + (++gameManager.fireNum);
                bullet2.name = "bullet_shotgun" + (++gameManager.fireNum);
                bullet3.name = "bullet_shotgun" + (++gameManager.fireNum);
                bullet.size_x = 10; bullet.size_y = 10;
                bullet2.size_x = 10; bullet2.size_y = 10;
                bullet3.size_x = 10; bullet3.size_y = 10;
                bullet.move_x = this.move_x;
                bullet.move_y = this.move_y;
                bullet2.move_x = this.move_x;
                bullet2.move_y = this.move_y;
                bullet3.move_x = this.move_x;
                bullet3.move_y = this.move_y;
                switch (this.direction) {
                    case 0: // выстрел влево
                        bullet.pos_x = this.pos_x + 15;
                        bullet.pos_y = this.pos_y + 3;
                        bullet.move_x = -1;
                        bullet2.pos_x = this.pos_x + 15;
                        bullet2.pos_y = this.pos_y - 5;
                        bullet2.move_x = -1;
                        bullet2.move_y = -0.1;
                        bullet3.pos_x = this.pos_x + 15;
                        bullet3.pos_y = this.pos_y + 11;
                        bullet3.move_x = -1;
                        bullet3.move_y = 0.1;
                        break;
                    case 1: // выстре вправо
                        bullet.pos_x = this.pos_x + this.size_x - 25;
                        bullet.pos_y = this.pos_y + 15;
                        bullet.move_x = 1;
                        bullet2.pos_x = this.pos_x + this.size_x - 25;
                        bullet2.pos_y = this.pos_y + 23;
                        bullet2.move_x = 1;
                        bullet2.move_y = 0.1;
                        bullet3.pos_x = this.pos_x + this.size_x - 25;
                        bullet3.pos_y = this.pos_y + 7;
                        bullet3.move_x = 1;
                        bullet3.move_y = -0.1;
                        break;
                    case 3: // выстрел вверх
                        bullet.pos_x = this.pos_x + 25;
                        bullet.pos_y = this.pos_y + 15;
                        bullet.move_y = -1;
                        bullet2.pos_x = this.pos_x + 10;
                        bullet2.pos_y = this.pos_y + 15;
                        bullet2.move_y = -1;
                        bullet2.move_x = -0.1;
                        bullet3.pos_x = this.pos_x + 40;
                        bullet3.pos_y = this.pos_y + 15;
                        bullet3.move_y = -1;
                        bullet3.move_x = 0.1;
                        break;
                    case 2: // выстрел вниз
                        bullet.pos_x = this.pos_x + 6;
                        bullet.pos_y = this.pos_y + 8;
                        bullet.move_y = 1;
                        bullet2.pos_x = this.pos_x - 4;
                        bullet2.pos_y = this.pos_y + 8;
                        bullet2.move_y = 1;
                        bullet2.move_x = -0.1;
                        bullet3.pos_x = this.pos_x + 16;
                        bullet3.pos_y = this.pos_y + 8;
                        bullet3.move_y = 1;
                        bullet3.move_x = +0.1;
                        break;
                }
                gameManager.entities.push(bullet2);
                gameManager.entities.push(bullet3);
            }
            this.shooting = true;
            switch (this.currentFrame) {
                case 0:
                    //this.currentFrame = 5;
                    this.currentFrame = 4;
                    break;
                case 1:
                    //this.currentFrame = 4;
                    this.currentFrame = 5;
                    break;
                case 2:
                    //this.currentFrame = 5;
                    this.currentFrame = 6;
                    break;
                case 3:
                    //this.currentFrame = 6;
                    this.currentFrame = 5;
                    break;
            }
            if (!shotgun)
                switch (this.direction) {
                    case 0: // выстрел влево
                        bullet.pos_x = this.pos_x + 3; //15
                        bullet.pos_y = this.pos_y + 3;
                        bullet.move_x = -1;
                        break;
                    case 1: // выстре вправо
                        bullet.pos_x = this.pos_x + this.size_x - 25;
                        bullet.pos_y = this.pos_y + 15;
                        bullet.move_x = 1;
                        break;
                    case 3: // выстрел вверх
                        bullet.pos_x = this.pos_x + 27;
                        bullet.pos_y = this.pos_y + 10;//20
                        bullet.move_y = -1;
                        break;
                    case 2: // выстрел вниз
                        bullet.pos_x = this.pos_x;
                        bullet.pos_y = this.pos_y + 9; //3
                        bullet.move_y = 1;
                        break;
                }
            this.pos_x += 7*this.move_x;
            this.pos_y += 7*this.move_y;
            gameManager.entities.push(bullet);
        } else {

        }
    }
});

var Spawn = Entity.extend({
    count: 0,
    update: function () {
        var obj = Object.create(Spirit);
        obj.pos_x = this.pos_x;
        obj.pos_y = this.pos_y;
        obj.size_x = 35;
        obj.size_y = 40;
        var e = physicManager.entityAtXY(obj,this.pos_x, this.pos_y);
        // obj.pos_x += 11;
        // obj.pos_y += 2;
        // obj.size_x = 26;
        // obj.size_y = 44;
        if (this.count > 0 && e === null) {
            this.count--;
            obj.name = 'zombie'+(++gameManager.zombieNum);
            gameManager.zombieMaxNum++;
            gameManager.entities.push(obj);
        }
        if (this.count === 0 && gameManager.zombieNum === 0 && gameManager.zombieMaxNum === 0) {
            this.count = gameManager.level * 5;
        }
    }
});

var Bullet = Entity.extend({
    move_x: 0, move_y: 0,
    speed: 50,
    draw: function (ctx) {
        if (gameManager.player.gun.match(/Pistol/)) {
            if (this.move_x === 1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
            if (this.move_x === -1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
            if (this.move_y === 1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
            if (this.move_y === -1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
        } else if (gameManager.player.gun.match(/Uzi/)) {
            if (this.move_x === 1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
            if (this.move_x === -1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
            if (this.move_y === 1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
            if (this.move_y === -1) {
                spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
            }
        } else {
            spriteManager.drawSprite(ctx, "bullet", this.pos_x, this.pos_y, 1, 20);
        }
    },
    update: function () {
        physicManager.update(this);
    },
    onTouchEntity: function (obj) {
        if (obj.name.match(/zombie/)) {
            if (this.name.match(/bullet_pistol/)) {
                obj.lifetime -= 40;
            }
            if (this.name.match(/bullet_uzi/)) {
                obj.lifetime -= 60;
            }
            if (this.name.match(/bullet_shotgun/)) {
                obj.lifetime -= 60;
            }
            if (obj.lifetime <= 0) {
                obj.currentFrame = 4;
            }
            //obj.kill();
        }
        this.kill();
    },
    onTouchMap: function (idx) {
        this.kill();
    },
    kill: function () {
        //gameManager.zombieNum--;
        gameManager.kill(this);
    }
});

var Spirit = Entity.extend({
    lifetime: 100,
    move_x: 0, move_y: 0, // направление движения
    speed: 6, // скорость объекта
    currentFrame: 0,
    size_x: 50, size_y: 50,
    direction: 1,
    attackReload: 0,
    frameReload: 0,
    pathReload: 0,

    dirSprite: 'spirit',
    draw: function (ctx) {
        if (this.currentFrame < 4) {
            spriteManager.drawSprite(ctx, this.dirSprite, this.pos_x, this.pos_y, this.currentFrame, 50);
            if (this.frameReload >= 4) {
                this.currentFrame++;
                this.frameReload = 0;
            }
            if (this.currentFrame > 3) this.currentFrame = 0;
        } else {
            spriteManager.drawSprite(ctx, this.dirSprite, this.pos_x, this.pos_y, this.currentFrame, 50);
            if (this.currentFrame === 6) this.currentFrame = 0;
            else this.currentFrame++;
        }
    },
    update: function () {
        if (this.lifetime >= 0) {
            this.attackReload++;
            this.pathReload++;
            this.frameReload++;
            if (this.pathReload >= 15) {
                this.move_x = 0;
                this.move_y = 0;
                var resolution = Math.random();
                if (this.pos_y >= gameManager.player.pos_y && this.pos_x <= gameManager.player.pos_x) {
                    if (resolution >= 0 && resolution <= 0.5) this.move_y = -1;
                    if (resolution > 0.5) this.move_x = 1;
                }
                else if (this.pos_y <= gameManager.player.pos_y && this.pos_x <= gameManager.player.pos_x) {
                    if (resolution >= 0 && resolution <= 0.5) this.move_y = 1;
                    if (resolution > 0.5) this.move_x = 1;
                }
                else if (this.pos_x >= gameManager.player.pos_x && this.pos_y <= gameManager.player.pos_y) {
                    if (resolution >= 0 && resolution <= 0.5) this.move_y = 1;
                    if (resolution > 0.5) this.move_x = -1;
                }
                else if (this.pos_x >= gameManager.player.pos_x && this.pos_y >= gameManager.player.pos_y) {
                    if (resolution >= 0 && resolution <= 0.5) this.move_y = -1;
                    if (resolution > 0.5) this.move_x = -1;
                }
                this.pathReload = 0;
            }
            var result = physicManager.update(this);
            if (result === 'stop') {
                this.currentFrame = 0;
            }
        } else {

            this.move_x = 0; this.move_y = 0;
            if (this.currentFrame == 6)
                this.kill();
        }
    },
    onTouchEntity: function (obj) {
        if (obj.name.match(/player/)) {
            if (this.attackReload >= 10) {
                soundManager.play('music/attack.mp3', {looping: false, volume: 3});
                this.attackReload = 0;
                this.currentFrame = 6;
                obj.lifetime -= 20;
                document.getElementById("hp").innerHTML = 'Жизни: ' + obj.lifetime;
                if (obj.lifetime <= 0){
                    obj.kill();
                }
                
            }
        }
    },
    onTouchMap: function (idx) {

    },
    kill: function () {
        gameManager.score++;
        document.getElementById("score").innerHTML = 'Очки: ' + gameManager.score;
        var obj = Object.create(Blood);
        obj.size_x = 80; obj.size_y = 80;
        obj.name = "blood" + (++gameManager.bloodNum); // счетчик выстрелов
        obj.move_x = 0;
        obj.move_y = 0;
        obj.pos_x = this.pos_x-7; obj.pos_y = this.pos_y+4;
        gameManager.zombieNum--;
        gameManager.onlytodraw.push(obj);
        gameManager.kill(this);
        //gameManager.zombieNum--;
    },
    attack: function () {

    }
});

var Blood = Entity.extend({
    move_x: 0, move_y:0,
    size_x: 80, size_y: 80,
    update: function () {

    },
    draw: function () {
        spriteManager.drawSprite(ctx,"blood_80_80", this.pos_x, this.pos_y, 0, 80);
    },
    kill: function () {
        gameManager.kill(this);
    }
});


//////////////////////////////////////////////////
///////////////GAME MANAGER//////////////////////
//////////////////////////////////////////////////

var gameManager = { // менеджер игры
    factory: {}, // фабрика объектов на карте
    entities: [], // объекты на карте
    onlytodraw: [],
    fireNum: 0, // идентификатор выстрела
    spawnNum: 0,
    zombieNum: 0,
    lastKeys: [],
    zombieMaxNum: 0,
    score: 0,
    time: 5,
    level: 1,
    bloodNum: 0,
    boxNum: 0,
    newLevel: false,
    player: null, // указатель на объект игрока
    laterKill: [], // отложенное уничтожение объектов
    initPlayer: function (obj) { // инициализация игрока
        this.player = obj;
        this.player.gun = 'Pistol';
    },
    kill: function (obj) {
        this.laterKill.push(obj);
    },
    update: function () { // обновление информации
        if (this.player === null)
            return;
        this.player.move_x = 0;
        this.player.move_y = 0;
        // if (eventsManager.action["up"]) this.player.move_y = -1;
        // if (eventsManager.action["down"]) this.player.move_y = 1;
        // if (eventsManager.action["left"]) this.player.move_x = -1;
        // if (eventsManager.action["right"]) this.player.move_x = 1;
        if (this.lastKeys[this.lastKeys.length-1] === "up") this.player.move_y = -1;
        if (this.lastKeys[this.lastKeys.length-1] === "down") this.player.move_y = 1;
        if (this.lastKeys[this.lastKeys.length-1] === "left") this.player.move_x = -1;
        if (this.lastKeys[this.lastKeys.length-1] === "right") this.player.move_x = 1;

        if (eventsManager.action["fire"]) this.player.fire();
        gameManager.player.gun = 'Pistol';
        eventsManager.action["pistol"] = false;

        if (eventsManager.action["killAll"]) {
            for (var i = 0; i < gameManager.entities.length; i++) {
                if (gameManager.entities[i].name.match(/zombie/)) {
                    gameManager.entities[i].kill();
                }
            }
        }

        //обновление информации по всем объектам на карте
        this.entities.forEach(function (e) {
            try {
                e.update();
            } catch(ex) {}
        });
        this.time++;

        // удаление всех объектов попавших в laterKill
        for(var i = 0; i < this.laterKill.length; i++) {
            var idx = this.entities.indexOf(this.laterKill[i]);
            if(idx > -1)
                this.entities.splice(idx, 1); // удаление из массива 1 объекта
        }
        if (this.laterKill.length > 0) // очистка массива laterKill
            this.laterKill.length = 0;
        mapManager.draw(ctx);
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(ctx);
        // if (this.zombieNum !== 0)
        //     this.newLevel = false;
        if (this.zombieNum === 0 && this.zombieMaxNum === this.level*10) {
            //this.zombieNum = 1;
            this.zombieMaxNum = 0;
            this.level++;

            this.newLevel = true;
            document.getElementById("levelToChange").style.display = 'block';
            document.getElementById("levelToChange").innerHTML = 'Level ' + this.level;
            document.getElementById("levelToChange").style.top = '200px';
            document.getElementById("levelToChange").style.left = '630px';
            document.getElementById("levelToChange").style.fontSize = '33px';
            document.getElementById("levelToChange").style.color = 'black';
            document.getElementById("level").innerHTML = 'Уровень: ' + this.level;

            setTimeout(function () {
                document.getElementById("levelToChange").style.display = 'none';
            },3000);
        }
    },
    draw: function (ctx) {
        for (var a = 0; a < this.onlytodraw.length; a++) {
            this.onlytodraw[a].draw(ctx);
        }
        for (var e = 0; e < this.entities.length; e++) {
            if (!this.entities[e].name.match(/spawn/))
                this.entities[e].draw(ctx);
        }
    },
    loadAll: function () {
        soundManager.init();
        soundManager.loadArray(['music/main.mp3',"music/shoot.mp3","music/attack.mp3"]);
       // soundManager.play('music/main.mp3',{looping: true, volume: 1});
        mapManager.loadMap("map.json"); // загрузка карты
        spriteManager.loadAtlas("sprites.json", "images/spritesheet.png"); // загрузка атласа
        gameManager.factory['Player'] = Player; // инициализация фабрики
        gameManager.factory['Zombie'] = Spirit;
        gameManager.factory['Bullet'] = Bullet;
        gameManager.factory['Spawn'] = Spawn;
        mapManager.parseEntities(); // разбор сущностей карты
        mapManager.draw(ctx); // отобразить карту
        eventsManager.setup(); // настройка событий
    },
    play: function () {
        gameManager.loadAll();
        setInterval(updateWorld, 100);
    }
};




function updateWorld() {
    gameManager.update();
}