import { GameState } from "./interfaces/GameState";
import cardRankings from "./cardRankings";

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    console.log('betRequest gameState', gameState);

    // Our player
    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    // Cards on the table
    const tableCards = gameState.community_cards;

    const tableCardsArray = gameState.community_cards.map(({ rank }) => rank);

    if (player) {
      console.log('player', player)

      const playerCardsArray = player.hole_cards?.map(({ rank }) => rank);

      const includesTableCard = playerCardsArray?.find((card) => tableCardsArray.includes(card));

      if (gameState.bet_index === 0) {
        betCallback(gameState.current_buy_in)
      } else if (includesTableCard) {
        betCallback(gameState.current_buy_in);
      } else {
        betCallback(0)
      }
    }
  }

  public showdown(gameState: GameState): void {
    console.log('gameState gameState', gameState);
  }
};

export default Player;
