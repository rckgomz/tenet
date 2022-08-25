import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClassFromExist } from 'class-transformer';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Email } from './entities/email.entity';
import { PhoneNumber } from './entities/phone.entity';
import { CreateEmailDto } from './dto/create-email.dto';
import { CreatePhoneNumberDto } from './dto/create-phone-number.dto';

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

  async create(createPersonDto: CreatePersonDto) {
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

    return this.repo.save(newPerson);
  }

  findAll() {
    return this.repo.find({
      relations: {
        emails: true,
        phoneNumbers: true,
      },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: { emails: true, phoneNumbers: true },
    });
  }

  update(id: string, updatePersonDto: UpdatePersonDto) {
    return this.repo.update(id, updatePersonDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  async addEmail(id: string, createEmailDto: CreateEmailDto) {
    const person = await this.repo.findOneBy({ id });
    const newEmail = this.emailRepo.create({
      person,
      value: createEmailDto.email,
    });
    const newAddress = plainToClassFromExist(newEmail, createEmailDto);

    return this.emailRepo.save(newAddress);
  }

  getEmails(id: string) {
    return this.emailRepo.find({
      where: {
        person: { id },
      },
      relations: {
        person: true,
      },
    });
  }

  async addPhoneNumber(id: string, createPhoneNumberDto: CreatePhoneNumberDto) {
    const person = await this.repo.findOneBy({ id });
    const newPhoneNumber = this.phoneRepo.create({
      person,
      value: createPhoneNumberDto.number,
    });
    const mergedPhoneNumber = plainToClassFromExist(
      newPhoneNumber,
      createPhoneNumberDto,
    );

    return this.phoneRepo.save(mergedPhoneNumber);
  }

  getPhoneNumbers(id: string) {
    return this.phoneRepo.find({
      where: {
        person: { id },
      },
      relations: {
        person: true,
      },
    });
  }

  getPhoneNumber(id: string, phoneNumberId: string) {
    return this.phoneRepo.find({
      where: {
        person: { id },
        id: phoneNumberId,
      },
      relations: {
        person: true,
      },
    });
  }
}
