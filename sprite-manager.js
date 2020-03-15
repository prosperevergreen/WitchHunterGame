/////////////////////////////
////// SPRITE MANAGER /////////
////////////////////////////////

var spriteManager = {
    image: new Image(), // рисунок с объектами
    sprites: [], // массив объектов для отображения
    imgLoaded: false, // изображения загружены
    jsonLoaded: false, // JSON загружен
    loadAtlas: function (atlasJson, atlasImg) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                spriteManager.parseAtlas(request.responseText);
            }
        };
        request.open("GET", atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    },
    loadImg: function (imgName) { // загрузка изображения
        this.image.onload = function () {
            spriteManager.imgLoaded = true;
        };
        this.image.src = imgName;
    },
    parseAtlas: function (atlasJSON) { // разбор атласа с обеъектами
        var atlas = JSON.parse(atlasJSON);
        atlas.forEach(item => {
            this.sprites.push({name: item.name, x:item.x, y: item.y, w: item.width, h: item.height}); // сохранение характеристик frame в виде объекта
        });
        this.jsonLoaded = true; // атлас разобран
    },
    drawSprite: function (ctx, name, x, y, curFrame, size) {
        // если изображение не загружено, то повторить запрос через 100 мс
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () {
                spriteManager.drawSprite(ctx, name, x, y, curFrame);
            }, 100);
        } else {
            var sprite = this.getSprite(name); // получить спрайт по имени
           
            if (!mapManager.isVisible(x, y, sprite.w, sprite.h))
                return; // не рисуем за пределами видимой зоны
            x -= mapManager.view.x;
            y -= mapManager.view.y;
            // отображаем спрайт на холсте
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);

        }
    },
    getSprite: function (name) { // получить спрайт по имени
        var sprite = this.sprites.find(x=>x.name == name);
        return sprite;
    }
};