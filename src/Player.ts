import { GameState } from "./interfaces/GameState";

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    betCallback(10);
  }

  public showdown(gameState: GameState): void {

  }
};

export default Player;
