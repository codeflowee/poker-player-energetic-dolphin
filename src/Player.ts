import { GameState } from "./interfaces/GameState";

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    console.log('betRequest gameState', gameState);

    // Our player
    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');
    // Cards on the table
    const tableCards = gameState.community_cards;

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
