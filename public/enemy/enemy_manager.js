import game from "../game/game.js";
import tiles from "../game/tiles.js";
import { arrayContains } from "../utils/utils.js";
import EnemySimpleMove from './enemy_simple_move.js';
import EnemyNestedMove from "./enemy_nested_move.js";
const enemyManager = {
    enemies: [],
    skipCount: 0,
    skipMax: 2,
    start: () => {
        enemyManager.enemies = [];
        game.forCoordinates(pos => {
            let coordinate = game.getCoordinate(pos);
            let enemy;
            if (arrayContains(coordinate, tiles.enemySimpleMove.id)) {
                enemy = new EnemySimpleMove();
            }
            if (arrayContains(coordinate, tiles.enemyNestedMove.id)) {
                enemy = new EnemyNestedMove();
            }
            if (enemy) {
                enemy.start(pos);
                enemyManager.enemies.push(enemy);
            }
        });
    },
    getEnemy: (pos, tileId) => {
        return enemyManager.enemies.find(enemy => enemy.id === tileId && enemy.position.x === pos.x && enemy.position.y === pos.y);
    },
    update: () => {
        if (enemyManager.enemies.length === 0) {
            return;
        }
        enemyManager.skipCount++;
        enemyManager.enemies.forEach(enemy => enemy.update(enemyManager.skipCount !== enemyManager.skipMax));
        if (enemyManager.skipCount == enemyManager.skipMax)
            enemyManager.skipCount = 0;
    },
    damage: (enemy) => {
        enemy.damage();
        if (enemy.hp === 0) {
            let index = enemyManager.enemies.indexOf(enemy);
            enemyManager.enemies.splice(index, 1);
        }
    }
};
export default enemyManager;
//# sourceMappingURL=enemy_manager.js.map