import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Email } from './entities/email.entity';
import { PhoneNumber } from './entities/phone.entity';
import { ReturnPersonDto } from './dto/return-person.dto';

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

    const savedPerson = await this.repo.save(newPerson);

    return plainToClass(ReturnPersonDto, savedPerson);
  }

  async findAll() {
    const data = await this.repo.find({
      relations: {
        emails: true,
        phoneNumbers: true,
      },
    });
    return data.map((d) => plainToClass(ReturnPersonDto, d));
  }

  findOne(id: string) {
    return plainToClass(
      ReturnPersonDto,
      this.repo.findOne({
        where: { id },
        relations: { emails: true, phoneNumbers: true },
      }),
    );
  }

  update(id: string, updatePersonDto: UpdatePersonDto) {
    return plainToClass(ReturnPersonDto, this.repo.update(id, updatePersonDto));
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
