import tiles from './tiles.js';
import { fase1 } from './scenarios.js';
import player from '../player/player.js';
import { getTileById, arrayContains } from '../utils/utils.js';
import enemyManager from '../enemy/enemy_manager.js';
import bombManager from '../player/bombs.js';
import { tileSize } from '../utils/physics.js';
const game = {
    context: null,
    scenario: [],
    updaterId: 0,
    reseting: false,
    getCoordinate: (pos) => game.scenario[pos.y][pos.x],
    coordinateToAbsolute: (pos) => {
        return { x: pos.x * tileSize, y: pos.y * tileSize };
    },
    forCoordinates: (doOnCoordinate) => {
        for (let y = 0; y < game.scenario.length; y++) {
            for (let x = 0; x < game.scenario[y].length; x++) {
                doOnCoordinate({ x: x, y: y });
            }
        }
    },
    start: () => {
        const canvas = document.getElementById("app_canvas");
        game.context = canvas.getContext('2d');
        game.reset();
        canvas.width = game.scenario[0].length * tileSize;
        canvas.height = game.scenario.length * tileSize;
        player.start();
    },
    update: () => {
        if (game.reseting)
            return;
        game.forCoordinates(pos => game.drawTile(pos, tiles.ground));
        game.forCoordinates(pos => {
            let coordinate = game.getCoordinate(pos);
            for (let z = 0; z < coordinate.length; z++) {
                let tile = getTileById(coordinate[z]);
                if (tile.isEnemy) {
                    let enemy = enemyManager.getEnemy(pos, tile.id);
                    if (enemy) {
                    }
                    if (arrayContains(coordinate, tiles.explosion.id)) {
                        enemyManager.damage(enemy);
                    }
                }
                else if (tile.isPlayer) {
                    let enemy = game.getCoordinate(pos).find(id => {
                        let tile = getTileById(id);
                        return tile.isEnemy;
                    });
                    if (arrayContains(coordinate, tiles.explosion.id) || enemy) {
                        player.damage();
                    }
                    game.drawSprite(player.absolutePosition, tiles.player.sprite);
                    continue;
                }
                game.drawTile(pos, tile);
            }
            if (arrayContains(coordinate, tiles.player.id)) {
                if (arrayContains(coordinate, tiles.explosion.id)
                    || arrayContains(coordinate, tiles.enemySimpleMove.id)) {
                    player.damage();
                }
            }
        });
        player.update();
        enemyManager.update();
    },
    reset: () => {
        game.reseting = true;
        clearInterval(game.updaterId);
        bombManager.reset();
        game.scenario = JSON.parse(JSON.stringify(fase1));
        player.reset();
        enemyManager.start();
        game.updaterId = setInterval(game.update, 22);
        game.reseting = false;
    },
    drawTile: (pos, tile) => {
        let posX = pos.x * tileSize;
        let posY = pos.y * tileSize;
        game.drawSprite({ x: posX, y: posY }, tile.sprite);
    },
    drawSprite: (pos, sprite) => {
        let image = new Image();
        image.src = "./resources/images/" + sprite + ".png";
        game.context.drawImage(image, pos.x, pos.y, tileSize, tileSize);
    }
};
export default game;
//# sourceMappingURL=game.js.map