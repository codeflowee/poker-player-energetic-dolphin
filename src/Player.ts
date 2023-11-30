import { GameState } from "./interfaces/GameState";
import cardRankings from "./cardRankings";
import Logsene from "logsene-js";
import hasPairInHandWithPlayerCards from './rankFunctions/hasPairInHandWithPlayerCards'
import hasThreeOfKind from "./rankFunctions/hasThreeOfKind";
// import getRank from './getRank';

const logger = new Logsene('f94e5824-2c17-4c45-a019-92598a343b73');
export class Player {

  public log(message: string, anyObj?: any): void {
    // logger.log('info', message, anyObj);
    console.log(message, anyObj);
  }

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    // getRank(gameState);

    // logger.log('info', 'betRequest', { gameState });
    console.log('betRequest', { gameState });

    // Our player
    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    // Cards on the table
    const tableCards = gameState.community_cards;

    this.log('Table cards', tableCards);

    const tableCardsArray = gameState.community_cards.map(({ rank }) => rank);

    if (player) {
      // logger.log('info', 'Player', { player })
      console.log('Player', { player })

      const playerCardsArray = player.hole_cards?.map(({ rank }) => rank) ?? [];

      const riskTolerance = 7;
      let hasPlayerPair = false;
      let highCard = false;
      if (playerCardsArray.length) {
        hasPlayerPair = playerCardsArray[0] === playerCardsArray[1];
        highCard = cardRankings.ranks.indexOf(playerCardsArray[0]) > riskTolerance
          || cardRankings.ranks.indexOf(playerCardsArray[1]) > riskTolerance;
      }

      const allIn = player.stack;
      const call = gameState.current_buy_in - player.bet;
      const raise = gameState.current_buy_in - player.bet + gameState.minimum_raise;

      if (!tableCardsArray.length) {
        // Before there are table cards
        if (hasPairInHandWithPlayerCards(playerCardsArray, tableCardsArray)) {
          if (highCard) {
            this.log('Start Game. Have strong pair, all in with', call);
            betCallback(call);
          } else {
            this.log('Start Game. Have weak pair, raise', raise);
            betCallback(raise);
          }
        } else if (highCard) {
          this.log('Start Game. Have above risk tolerance, calling with:', call)
          betCallback(call);
        } else {
          this.log('Start Game. ELSE BLOCK WE CALL with:', call);
          betCallback(gameState.current_buy_in > 300 ? 0 : call);
        }
      } else {
        // When there are table cards
        if (hasThreeOfKind(playerCardsArray, tableCardsArray) && hasPlayerPair) {
          const amount = highCard ? allIn : raise;
          this.log('In Game, three of a kind, all in with', amount);
          betCallback(amount);
        } else if (hasThreeOfKind(playerCardsArray, tableCardsArray)) {
          this.log('In Game, three of a kind', call);
          betCallback(call);
        } else if (hasPairInHandWithPlayerCards(playerCardsArray, tableCardsArray)) {
          const amount = gameState.current_buy_in > 300 ? 0 : call;
          this.log('In Game, Current buy in', gameState.current_buy_in);
          this.log('In Game, have pair, calling with ', amount);
          betCallback(amount);
        } else if (highCard) {
          const amount = gameState.current_buy_in > 300 ? 0 : call
          this.log('In Game, Current buy in', gameState.current_buy_in);
          this.log('In Game, Have above risk tolerance, calling with:', amount);
          betCallback(amount);
        } else {
          this.log('In Game, ESLE BLOCK WE ARE FOLDING', 0);
          betCallback(gameState.current_buy_in > 300 ? 0 : call);
        }
      }
    }
  }

  public showdown(gameState: GameState): void {
    // logger.log('info', 'showdown', { gameState });
    console.log('showdown', { gameState });
  }
};

export default Player;
