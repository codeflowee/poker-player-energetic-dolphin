const cardsToCountMap = (cards: string[]): Map<string, number> => cards.reduce((countMap, element) => {
  countMap.set(element, (countMap.get(element) || 0) + 1);
  return countMap;
}, new Map<string, number>());

// three of a kind with at least one kind in player cards
export default function hasThreeOfKind(playerCards: string[], tableCards: string[]) {
  const cardMap = cardsToCountMap([...playerCards, ...tableCards]);
  let hasThreeOfKindWithAtLeastOnePlayerCard = false;
  cardMap.forEach((value, key) => {
    if (value === 3 && playerCards.indexOf(key) > -1) {
      hasThreeOfKindWithAtLeastOnePlayerCard = true;
    }
  });
  return hasThreeOfKindWithAtLeastOnePlayerCard;
}
