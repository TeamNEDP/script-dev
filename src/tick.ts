import { GameAction, GameStat, MoveAction } from "./types";

function Tick(user: "R" | "B", stat: GameStat): GameAction {
    let action: MoveAction = {
        x: 0,
        y: 0,
        amount: 0,
        movement: "R",
    };

    // TODO: program your AI here

    return action;
}

export default Tick;
