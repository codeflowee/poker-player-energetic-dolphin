import { GameState } from "./interfaces/GameState";
import cardRankings from "./cardRankings";
import Logsene from "logsene-js";

const logger = new Logsene('cc28f7c9-ee84-48c2-ac14-c09b93a79e84')

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    logger.log('info', 'betRequest', { gameState });

    // Our player
    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    // Cards on the table
    const tableCards = gameState.community_cards;

    const tableCardsArray = gameState.community_cards.map(({ rank }) => rank);

    if (player) {
      logger.log('info', 'Player', { player })

      const playerCardsArray = player.hole_cards?.map(({ rank }) => rank);

      let hasPlayerPair = false;

      if (playerCardsArray) {
        hasPlayerPair = playerCardsArray[0] === playerCardsArray[1];
      }

      const hasPairWithTable = playerCardsArray?.find((card) => tableCardsArray.includes(card));

      const risk = 9;
      let riskIndex = 0;
      playerCardsArray?.forEach((card) => {
        const cardIndex = cardRankings.ranks.indexOf(card);

        if (cardIndex > riskIndex) {
          riskIndex = cardIndex;
        }
      })


      if (hasPlayerPair) {
        logger.log('info', 'Executing has pair', { playerCardsArray });

        betCallback(gameState.current_buy_in);
      } else if (!tableCardsArray.length && riskIndex > risk) {
        logger.log('info', 'Execute above risk', { risk, riskIndex });

        betCallback(gameState.current_buy_in);
      } else if (hasPairWithTable) {
        logger.log('info', 'Execute hasPairWithTable');

        betCallback(gameState.current_buy_in);
      } else {
        logger.log('info', 'Execute fold');

        betCallback(0);
      }
    }
  }

  public showdown(gameState: GameState): void {
    logger.log('info', 'showdown', { gameState });
  }
};

export default Player;
