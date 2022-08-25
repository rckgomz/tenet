import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Person } from './entities/person.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { PhoneNumber } from './entities/phone.entity';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Address, PhoneNumber, Email])],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
