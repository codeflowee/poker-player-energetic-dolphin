import { GameState } from "./interfaces/GameState";
import cardRankings from "./cardRankings";
import Logsene from "logsene-js";
import hasPairInHandWithPlayerCards from './rankFunctions/hasPairInHandWithPlayerCards'
import hasThreeOfKind from "./rankFunctions/hasThreeOfKind";
import getRank from './getRank';

const logger = new Logsene('f94e5824-2c17-4c45-a019-92598a343b73');
export class Player {

  public log(message: string, anyObj?: any): void {
    logger.log('info', message, anyObj);
    console.log(message, anyObj);
  }

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    getRank(gameState);

    logger.log('info', 'betRequest', { gameState });
    console.log('betRequest', { gameState });

    // Our player
    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    // Cards on the table
    const tableCards = gameState.community_cards;

    this.log('Table cards', tableCards);

    const tableCardsArray = gameState.community_cards.map(({ rank }) => rank);


    if (player) {
      logger.log('info', 'Player', { player })
      console.log('Player', { player })

      const playerCardsArray = player.hole_cards?.map(({ rank }) => rank) ?? [];

      let hasPlayerPair = false;

      if (playerCardsArray) {
        hasPlayerPair = playerCardsArray[0] === playerCardsArray[1];
      }

      const riskTolerance = 7;
      let playerRisk = 0;
      playerCardsArray?.forEach((card) => {
        const cardIndex = cardRankings.ranks.indexOf(card);

        if (cardIndex > playerRisk) {
          playerRisk = cardIndex;
        }
      })

      const allIn = player.stack;
      const call = gameState.current_buy_in - player.bet;
      const raise = gameState.current_buy_in - player.bet + gameState.minimum_raise;

      if (!tableCardsArray.length) {
        // Before there are table cards
        if (hasPairInHandWithPlayerCards(playerCardsArray, tableCardsArray)) {
          if (playerRisk > 7) {
            this.log('Start Game. Have strong pair, all in with', allIn);
            betCallback(allIn);
          } else {
            this.log('Start Game. Have weak pair, raise', raise);
            betCallback(raise);
          }
        } else if (playerRisk > riskTolerance) {
          this.log('Start Game. Have above risk tolerance, calling with:', call)
          betCallback(call);
        } else {
          this.log('Start Game. ELSE BLOCK WE CALL with:', call);
          // TODO Fold if someone raised
          // TODO Check only if we are big blind
          betCallback(gameState.current_buy_in > 300 ? 0 : call);
        }
      } else {
        // When there are table cards
        if (hasThreeOfKind(playerCardsArray, tableCardsArray)) {
          this.log('In Game, three of a kind, all in with', allIn);
          betCallback(allIn);
        } else if (hasPairInHandWithPlayerCards(playerCardsArray, tableCardsArray)) {
          const amount = gameState.current_buy_in > 300 ? 0 : call;
          this.log('In Game, Current buy in', gameState.current_buy_in);
          this.log('In Game, have pair, calling with ', amount);
          betCallback(amount);
        } else if (playerRisk > riskTolerance) {
          this.log('In Game, Have above risk tolerance, calling with:', call);
          betCallback(gameState.current_buy_in);
        } else {
          this.log('In Game, ESLE BLOCK WE ARE FOLDING');
          betCallback(0);
        }
      }
    }
  }

  public showdown(gameState: GameState): void {
    logger.log('info', 'showdown', { gameState });
    console.log('showdown', { gameState });
  }
};

export default Player;
