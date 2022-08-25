import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Email } from './entities/email.entity';
import { PhoneNumber } from './entities/phone.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly repo: Repository<Person>,
    @InjectRepository(Email)
    private readonly emailRepo: Repository<Email>,
    @InjectRepository(PhoneNumber)
    private readonly phoneRepo: Repository<PhoneNumber>,
  ) {}

  create(createPersonDto: CreatePersonDto) {
    const person = this.repo.create();
    const newPerson = plainToClassFromExist(person, createPersonDto);

    const email = this.emailRepo.create({
      type: 'primary',
      value: createPersonDto.primaryEmail.toLowerCase(),
    });

    const phone = this.phoneRepo.create({
      type: 'primary',
      value: createPersonDto.primaryPhoneNumber,
    });

    person.emails = [email];
    person.phoneNumbers = [phone];

    console.log(person);
    return this.repo.save(newPerson);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  update(id: string, updatePersonDto: UpdatePersonDto) {
    return this.repo.update(id, updatePersonDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
