import { GameState } from './interfaces/GameState.d'
import axios from 'axios';

async function getRank(gameState: GameState) {
  const player = gameState.players[gameState.in_action];

  const playerCards = player.hole_cards ?? [];
  const tableCards = gameState.community_cards;

  if (playerCards.length && tableCards.length) {
    console.log('getRank data', {
      playerCards,
      tableCards,
    })

    try {
      const { data } = await axios.get('https://rainman.leanpoker.org/rank', {
        params: {
          cards: JSON.stringify([...playerCards, ...tableCards])
        }
      })

      console.log('getRank response', data)
    } catch (e) {
      console.log('getRank error', e)
    }

  }
}

export default getRank;
