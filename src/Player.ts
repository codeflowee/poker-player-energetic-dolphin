export interface GameState {
  tournament_id: string;
  game_id: string;
  round: number;
  bet_index: number;
  small_blind: number;
  current_buy_in: number;
  pot: number;
  minimum_raise: number;
  dealer: number;
  orbits: number;
  in_action: number;
  players: Player[];
  community_cards: Card[];
}

export interface Card {
  rank: string;
  suit: string;
}

export interface Player {
  id: number;
  name: string;
  status: string;
  version: string;
  stack: number;
  bet: number;
  hole_cards?: Card[];
}

const cardRankings = {
  ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  suits: ["hearts", "diamonds", "clubs", "spades"]
};

function hasPair(playerCards: string[]): boolean {
  return playerCards[0] === playerCards[1];
}

function hasThreeOfKind(playerCards: string[], tableCards: string[]): boolean {
  const allCards = [...playerCards, ...tableCards];
  const cardsCount = allCards.reduce((countMap, card) => {
    countMap.set(card, (countMap.get(card) || 0) + 1);
    return countMap;
  }, new Map<string, number>());

  return Object.values(cardsCount).some((count) => count >= 3);
}

export class Player {

  private log(message: string, anyObj?: any): void {
    console.log(message, anyObj);
  }

  private evaluateHand(playerCards: string[], tableCards: string[]): number {
    // Add your own hand evaluation logic here
    if (hasThreeOfKind(playerCards, tableCards)) {
      return 3;
    }
    if (hasPair(playerCards)) {
      return 2;
    }
    return 1; // Default for a high card or no significant hand
  }

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    console.log('betRequest', { gameState });

    const player = gameState.players.find(({ name }) => name === 'Energetic Dolphin');

    if (player) {
      console.log('Player', { player });

      const playerCardsArray = player.hole_cards?.map(({ rank }) => rank) || [];
      const tableCardsArray = gameState.community_cards.map(({ rank }) => rank);

      const riskTolerance = 7;
      const allIn = player.stack;
      const call = gameState.current_buy_in - player.bet;
      const raise = gameState.current_buy_in - player.bet + gameState.minimum_raise;

      const handStrength = this.evaluateHand(playerCardsArray, tableCardsArray);

      if (handStrength >= 3) {
        this.log('In Game, Strong hand, all in with', allIn);
        betCallback(allIn);
      } else if (handStrength === 2) {
        this.log('In Game, Have a pair, raising', raise);
        betCallback(raise);
      } else if (handStrength === 1 && gameState.current_buy_in > 300) {
        this.log('In Game, Above risk tolerance, calling with:', call);
        betCallback(call);
      } else {
        this.log('In Game, Folding', 0);
        betCallback(gameState.current_buy_in > 300 ? 0 : call);
      }
    }
  }

  public showdown(gameState: GameState): void {
    console.log('showdown', { gameState });
  }
}

export default Player;
