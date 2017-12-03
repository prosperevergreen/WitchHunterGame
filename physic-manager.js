////////////////////////////////////////////////////
////////////////PHYSIC MANAGER///////////////////////
/////////////////////////////////////////////////////

var physicManager = {
    update: function (obj) {
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop"; // скорости движения нулевые

        var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        // анализ пространства на карте по направлению движения
        var ts = mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2);
        var e = this.entityAtXY(obj, newX, newY); // объект на пути
        if (e !== null && obj.onTouchEntity) // если есть конфликт
            obj.onTouchEntity(e); // разбор конфликта внутри объекта
        if (ts !== 0 && obj.onTouchMap) // есть препятствие
            obj.onTouchMap(ts); // разбор конфликта с препятствием внутри объекта

        if (ts === 0 && e === null) { // перемещаем объект на свободное место
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else
            return "break"; // дальше двигаться нельзя

        switch (obj.move_x + 2* obj.move_y) {
            case -1: // двигаемся влево
                return "move_left";
                break;
            case 1: // двигаемся вправо
                return "move_right";
                break;
            case -2: // двигаемся вверх
                return "move_up";
                break;
            case 2: // двигаемся вниз
                return "move_down";
                break;
        }
    },
    entityAtXY: function (obj, x, y) { // поиск объекта по координатам
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i]; // рассматриваем все объекты на карте
            if (e.name !== obj.name && !e.name.match(/spawn/)) { // имя не совпадает
                if (x + obj.size_x < e.pos_x || // не пересекаются
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y)
                    continue;
                return e; // найден объект
            }
        }
        return null; // объект не найден
    }
};