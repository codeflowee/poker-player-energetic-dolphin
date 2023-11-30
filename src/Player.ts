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

      const hasPair = playerCardsArray?.find((card) => tableCardsArray.includes(card));

      const risk = 9;
      let riskIndex = 0;
      playerCardsArray?.forEach((card) => {
        const cardIndex = cardRankings.ranks.indexOf(card);

        if (cardIndex > riskIndex) {
          riskIndex = cardIndex;
        }
      })


      if (gameState.bet_index === 0) {
        console.log('Execute go in');

        betCallback(gameState.current_buy_in);
      } else if (riskIndex > risk) {
        console.log('Execute above risk', { risk, riskIndex });

        betCallback(gameState.current_buy_in);
        // } else if () {
      } else if (hasPair) {
        console.log('Execute hasPair');

        betCallback(gameState.current_buy_in);
      } else {
        console.log('Execute fold');

        betCallback(0);
      }
    }
  }

  public showdown(gameState: GameState): void {
    console.log('gameState gameState', gameState);
  }
};

export default Player;
