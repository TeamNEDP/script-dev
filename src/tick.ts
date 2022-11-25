import { GameAction, GameMap, GameStat, MoveAction } from "./types";

const dx = [0, 0, 1, -1];
const dy = [1, -1, 0, 0];
const move: ("U" | "L" | "D" | "R")[] = ["D", "U", "R", "L"];
let map: GameMap;
let width: number;
let height: number;
let enemyH = -1,
    enemyW = -1;
let toW: number, toH: number;
let moveAction: MoveAction = {
    x: 0,
    y: 0,
    movement: "U",
    amount: 1,
};

const inf = 1e9;

let dist: number[][] = [];

function calDist() {
    dist = [];

    for (let i = 0; i < width * height; ++i) {
        let cur: number[] = [];
        for (let j = 0; j < width * height; ++j) {
            cur.push(inf);
        }
        dist.push(cur);
    }

    // add edges

    for (let i = 0; i < width; ++i) {
        for (let j = 0; j < height; ++j) {
            for (let k = 0; k < 4; ++k) {
                let x = i + dx[k];
                let y = j + dy[k];
                if (!Check(x, y)) continue;
                dist[i * height + j][x * height + y] = 1;
            }

            dist[i * height + j][i * height + j] = 0;
        }
    }

    for (let k = 0; k < width * height; ++k) {
        for (let i = 0; i < width * height; ++i) {
            for (let j = 0; j < width * height; ++j) {
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            }
        }
    }
}

function Check(x: number, y: number): boolean {
    if (!(0 <= x && x < width && 0 <= y && y < height)) return false;

    return (
        map.grids[x * height + y].type !== "M" &&
        map.grids[x * height + y].type !== "MF"
    );
}

function solveGreedy(w: number, h: number) {
    for (let i = 0; i < 4; i++) {
        let x = w + dx[i];
        let y = h + dy[i];
        if (!Check(x, y)) continue;
        if (
            dist[w * height + h][toW * height + toH] >
            dist[x * height + y][toW * height + toH]
        ) {
            moveAction.x = w;
            moveAction.y = h;
            moveAction.movement = move[i];
            moveAction.amount = map.grids[w * map.height + h].soldiers || 0 - 1;
            return;
        }
    }
}

function Tick(user: "R" | "B", stat: GameStat): GameAction {
    let map = stat.map;

    height = map.height;
    width = map.width;

    calDist();

    let enemy: "R" | "B" = user === "R" ? "B" : "R";

    for (let i = 0; i < map.height * map.width; i++) {
        if (map.grids[i].type === enemy) {
            enemyW = Math.floor(i / map.height);
            enemyH = i % map.height;
            break;
        }
    }

    toW = toH = -1;
    if (enemyW !== -1) {
        toW = enemyW;
        toH = enemyH;
    } else {
        if (toW === -1)
            for (let i = 0; i < map.height * map.width; i++) {
                if (
                    map.grids[i].type === "L" + enemy ||
                    map.grids[i].type === "C" + enemy
                ) {
                    toW = Math.floor(i / map.height);
                    toH = i % map.height;
                    break;
                }
            }

        if (toW === -1)
            for (let i = 0; i < map.height * map.width; i++) {
                if (map.grids[i].type === "C") {
                    toW = Math.floor(i / map.height);
                    toH = i % map.height;
                    break;
                }
            }

        if (toW === -1)
            for (let i = 0; i < map.height * map.width; i++) {
                if (map.grids[i].type === "V") {
                    toW = Math.floor(i / map.height);
                    toH = i % map.height;
                    break;
                }
            }
    }

    let w = -1,
        h = -1;
    for (let i = 0; i < map.height * map.width; i++) {
        if (
            map.grids[i].type === user ||
            map.grids[i].type === "L" + user ||
            map.grids[i].type === "C" + user
        ) {
            if (w === -1) {
                w = Math.floor(i / map.height);
                h = i % map.height;
            } else if (
                (map.grids[i].soldiers || 0) >
                (map.grids[w * map.height + h].soldiers || 0)
            ) {
                w = Math.floor(i / map.height);
                h = i % map.height;
            }
        }
    }

    solveGreedy(w, h);

    return moveAction;
}

export default Tick;
