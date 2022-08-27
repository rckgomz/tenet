import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Address } from './entities/address.entity';
import { Email } from './entities/email.entity';
import { Person } from './entities/person.entity';
import { PhoneNumber } from './entities/phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Address, PhoneNumber, Email])],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService],
})
export class PersonModule {}
