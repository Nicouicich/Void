export class SummonerStatsEntity {
  summonerName: string;
  summonerLevel: number;
  queueType: string;
  region: string;
  rank: string;
  wins: number;
  losses: number;
  winrate: number;
  CSPerMinute: number;
  KDA: number;

  constructor(
    summonerName: string,
    summonerLevel: number,
    queueType: string,
    region: string,
    rank: string,
    wins: number,
    losses: number,
    winrate: number,
    CSPerMinute: number,
    KDA: number,
  ) {
    this.summonerName = summonerName;
    this.summonerLevel = summonerLevel;
    this.queueType = queueType;
    this.region = region;
    this.rank = rank;
    this.wins = wins;
    this.losses = losses;
    this.winrate = winrate;
    this.CSPerMinute = CSPerMinute;
    this.KDA = KDA;
  }
}
