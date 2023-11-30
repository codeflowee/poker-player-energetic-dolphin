import axios from 'axios';
import { GameState } from './interfaces/GameState';

export default async function checkRank(gameState: GameState) {
  const player = gameState.players[gameState.in_action];

  if (player.hole_cards) {
    const response = await axios.get('https://rainman.leanpoker.org/rank', {
      params: {
        cards: [
          ...player.hole_cards,
          ...gameState.community_cards,
        ]
      }
    })

    console.log('Ranking response: ', response)
  }
}
