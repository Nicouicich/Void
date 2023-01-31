import { PlayerController } from '../Controllers/player.controller';
import { PlayerService } from '../Services/player.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
