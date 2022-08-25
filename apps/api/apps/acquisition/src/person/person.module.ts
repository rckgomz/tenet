import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Person } from './entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { PhoneNumber } from './entities/phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Address, PhoneNumber])],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
