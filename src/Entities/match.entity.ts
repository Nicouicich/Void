import { MatchParticipantDto } from './../Dto/matchParticipant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

import { IMatchParticipant } from '../interfaces/matchParticipant.interface';

@Entity()
export class MatchEntity {
  @ApiProperty()
  @PrimaryColumn({ unique: true })
  matchId: string;

  @ApiProperty()
  @Column()
  gameDuration: number;

  @ApiProperty({ type: [MatchParticipantDto] })
  @Column('jsonb')
  participants: IMatchParticipant[];

  @ApiProperty()
  @Column('simple-array')
  summonerids: string[];

  @ApiProperty()
  @Column()
  queueId: number;

  constructor(
    matchId: string,
    queueId: number,
    gameDuration: number,
    participants: IMatchParticipant[],
    summonerids: string[],
  ) {
    this.matchId = matchId;
    this.participants = participants;
    this.queueId = queueId;
    this.gameDuration = gameDuration;
    this.summonerids = summonerids;
  }
}
