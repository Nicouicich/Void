export const tierValues = {
  IRON: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  DIAMOND: 6,
  MASTER: 7,
  GRANDMASTER: 8,
  CHALLENGER: 9,
};

export const rankValues = {
  IV: 4,
  III: 3,
  II: 2,
  I: 1,
};

export const getTierValue = (tier: string) => {
  switch (tier) {
    case 'IRON':
      return 1;
    case 'BRONZE':
      return 2;
    case 'SILVER':
      return 3;
    case 'GOLD':
      return 4;
    case 'PLATINUM':
      return 5;
    case 'DIAMOND':
      return 6;
    case 'MASTER':
      return 7;
    case 'GRANDMASTER':
      return 8;
    case 'CHALLENGER':
      return 9;
    default:
      return 0;
  }
};

export const getRankValue = (rank: string) => {
  switch (rank) {
    case 'IV':
      return 4;
    case 'III':
      return 3;
    case 'II':
      return 2;
    case 'I':
      return 1;
    default:
      return 0;
  }
};
