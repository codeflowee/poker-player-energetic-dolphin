import { GameState } from "./interfaces/GameState";

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    console.log('betRequest gameState', gameState);
    betCallback(1000);
  }

  public showdown(gameState: GameState): void {
    console.log('gameState gameState', gameState);
  }
};

export default Player;
