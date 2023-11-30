import { GameState } from './interfaces/GameState.d'

async function getRank(gameState: GameState) {
  const player = gameState.players[gameState.in_action];

  const playerCards = player.hole_cards;
  const tableCards = gameState.community_cards;

  if (playerCards && tableCards) {
    console.log('getRank', {
      playerCards,
      tableCards,
    })
  }
}

export default getRank;
