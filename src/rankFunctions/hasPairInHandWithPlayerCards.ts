export default function hasPairInHandWithPlayerCards(playerCards: string[], tableCards: string[]) {
  if (playerCards[0] === playerCards[1]) {
    return true;
  }

  return playerCards.some((card) => tableCards.includes(card));
}
