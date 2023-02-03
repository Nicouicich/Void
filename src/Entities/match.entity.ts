import { IMatchParticipant } from '../interfaces/matchParticipant.interface';
import { Entity, Column, PrimaryColumn } from "typeorm";


@Entity()
export class MatchEntity {

    @PrimaryColumn({ unique: true })
    matchId: string;

    @Column()
    gameDuration: number;

    @Column("jsonb")
    
    participants: IMatchParticipant[];
    @Column("simple-array")
    summonerids: string[];

    @Column()
    queueId: number;

    constructor(matchId: string,
        queueId: number,
        gameDuration: number,
        participants: IMatchParticipant[],
        summonerids: string[]) {

        this.matchId = matchId;
        this.participants = participants;
        this.queueId = queueId;
        this.gameDuration = gameDuration;
        this.summonerids = summonerids;
    }
}