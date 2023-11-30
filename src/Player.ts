import { GameState } from "./interfaces/GameState";
import cardRankings from "./cardRankings";
import Logsene from "logsene-js";

const logger = new Logsene('f94e5824-2c17-4c45-a019-92598a343b73')

export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    logger.log('info', 'betRequest', { gameState });
    console.log('betRequest', { gameState });

    // Our player
    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    // Cards on the table
    const tableCards = gameState.community_cards;

    const tableCardsArray = gameState.community_cards.map(({ rank }) => rank);

    if (player) {
      logger.log('info', 'Player', { player })
      console.log('Player', { player })

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


      // Before Table cards
      if (hasPlayerPair) {
        logger.log('info', 'Executing has pair', { playerCardsArray });
        console.log('Executing has pair', { playerCardsArray });

        betCallback(gameState.current_buy_in);
      } else if (!tableCardsArray.length && riskIndex > risk) {
        logger.log('info', 'Execute above risk', { risk, riskIndex });
        console.log('Execute above risk', { risk, riskIndex });

        betCallback(gameState.current_buy_in);

        // WHen game has started
      } else if (hasPairWithTable) {
        logger.log('info', 'Execute hasPairWithTable');
        console.log('Execute hasPairWithTable');

        betCallback(gameState.current_buy_in);
      } else {
        logger.log('info', 'Execute fold');
        console.log('Execute fold');

        betCallback(0);
      }
    }
  }

  public showdown(gameState: GameState): void {
    logger.log('info', 'showdown', { gameState });
    console.log('showdown', { gameState });
  }
};

export default Player;
