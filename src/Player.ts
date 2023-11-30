import { GameState } from "./interfaces/GameState";
import cardRankings from "./cardRankings";
import Logsene from "logsene-js";
import hasPairInHandWithPlayerCards from './rankFunctions/hasPairInHandWithPlayerCards'
import hasThreeOfKind from "./rankFunctions/hasThreeOfKind";

const logger = new Logsene('f94e5824-2c17-4c45-a019-92598a343b73');
export class Player {

  public log(message: string, anyObj?: any): void {
    logger.log('info', message, anyObj);
    console.log(message, anyObj);
  }

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
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

      if (!tableCardsArray.length) {
        // Before there are table cards
        // We shouldn't fold here yet, can still win with table cards
        const raise = gameState.current_buy_in - player.bet + gameState.minimum_raise;
        if (hasPairInHandWithPlayerCards(playerCardsArray, tableCardsArray)) {
          this.log('Has player pair, betting:', gameState.minimum_raise);
          betCallback(raise);
        } else if (playerRisk > riskTolerance) {
          betCallback(raise);
        } else {
          betCallback(raise);
        }
      } else {
        // When there are table cards

        if (hasThreeOfKind(playerCardsArray, tableCardsArray)) {
          betCallback(gameState.minimum_raise);
        } else if (hasPairInHandWithPlayerCards(playerCardsArray, tableCardsArray)) {
          betCallback(gameState.current_buy_in);
        } else if (playerRisk > riskTolerance) {
          betCallback(gameState.current_buy_in);
        } else {
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
