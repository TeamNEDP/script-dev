export type GridType =
    | "R"
    | "B"
    | "C"
    | "CR"
    | "CB"
    | "M"
    | "V"
    | "LR"
    | "LB"
    | "F"
    | "MF";

export interface MapGrid {
    type: GridType;
    soldiers?: number;
}

export interface GameMap {
    // 长度宽度
    width: number;
    height: number;
    // idx = w * height + h
    // (w, h 从 0 开始)
    grids: MapGrid[];
}

export interface MoveAction {
    x: number;
    y: number;
    amount: number;
    movement: "U" | "D" | "L" | "R";
}

export type GameAction = MoveAction | null;

export interface GameStat {
    map: GameMap;
    enemy_soldiers: number;
    enemy_lands: number;
}
