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
class GameClient {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const activePlayer = gameState.players[gameState.in_action];
    const holeCards = activePlayer.hole_cards || [];
    const communityCards = gameState.community_cards || [];

    // Calculate hand strength based on hole cards and community cards
    const handStrength = this.calculateHandStrength(holeCards, communityCards);

    // Decide betting strategy based on hand strength and game state
    let betAmount = 0;

    if (handStrength >= 0.7) {
      // Strong hand: All in
      betAmount = activePlayer.stack;
    } else if (handStrength >= 0.5) {
      // Good hand: Raise
      betAmount = gameState.current_buy_in + gameState.minimum_raise;
    } else {
      // Weak hand: Call or fold
      betAmount = gameState.current_buy_in - activePlayer.bet;
      if (betAmount < 0) {
        // Negative bet means fold
        betAmount = 0;
      }
    }

    // Make the bet
    betCallback(betAmount);
  }

  // Helper function to calculate hand strength
  public calculateHandStrength(holeCards: Card[], communityCards: Card[]): number {
    const allCards = [...holeCards, ...communityCards];

    // Sort cards by rank
    allCards.sort((a, b) => this.compareRanks(a.rank, b.rank));

    // Check for specific hand combinations
    if (this.isRoyalFlush(allCards)) {
      return 1.0; // Highest hand strength for Royal Flush
    } else if (this.isStraightFlush(allCards)) {
      return 0.9; // High hand strength for Straight Flush
    } else if (this.isFourOfAKind(allCards)) {
      return 0.8; // High hand strength for Four of a Kind
    }
    // Add more conditions for other hand combinations like Full House, Flush, Straight, etc.

    // If no specific hand is detected, return a value based on the highest card
    return this.getHighCardStrength(allCards);
  }

  // Helper function to compare ranks
  private compareRanks(rankA: string, rankB: string): number {
    const rankOrder = "23456789TJQKA";
    return rankOrder.indexOf(rankA) - rankOrder.indexOf(rankB);
  }

  // Helper function to check for a Royal Flush
  private isRoyalFlush(cards: Card[]): boolean {
    // Implement logic to check for a Royal Flush
    // ...
    return false;
  }

  // Helper function to check for a Straight Flush
  private isStraightFlush(cards: Card[]): boolean {
    // Implement logic to check for a Straight Flush
    // ...
    return false;
  }

  // Helper function to check for Four of a Kind
  private isFourOfAKind(cards: Card[]): boolean {
    // Implement logic to check for Four of a Kind
    // ...
    return false;
  }

  // Helper function to get the strength based on the highest card
  private getHighCardStrength(cards: Card[]): number {
    // Return a value between 0 and 1 based on the highest card
    const highestCard = cards[cards.length - 1].rank;
    const rankOrder = "23456789TJQKA";
    return rankOrder.indexOf(highestCard) / (rankOrder.length - 1);
  }

  public showdown(gameState: GameState): void {
    console.log('showdown', { gameState });
  }
}

export default GameClient;
