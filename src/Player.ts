import { GameState } from "./interfaces/GameState";

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    console.log('betRequest gameState', gameState);

    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    console.log('player', player)

    if (player) {
      betCallback(player.stack);
    }
  }

  public showdown(gameState: GameState): void {
    console.log('gameState gameState', gameState);
  }
};

export default Player;
