import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { CreateEmailDto } from './dto/create-email.dto';
import { plainToClass } from 'class-transformer';
import { ReturnPersonDto } from './dto/return-person.dto';
import { ReturnEmailDto } from './dto/return-address.dto';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return plainToClass(
      ReturnPersonDto,
      this.personService.create(createPersonDto),
    );
  }

  @Get()
  async findAll() {
    const data = await this.personService.findAll();
    return data.map((d) => plainToClass(ReturnPersonDto, d));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return plainToClass(ReturnPersonDto, this.personService.findOne(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return plainToClass(
      ReturnPersonDto,
      this.personService.update(id, updatePersonDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(id);
  }

  @Post(':id/emails')
  createEmail(@Param('id') id: string, @Body() createEmailDto: CreateEmailDto) {
    return plainToClass(
      ReturnEmailDto,
      this.personService.addAddress(id, createEmailDto),
    );
  }

  @Get(':id/emails')
  getEmails(@Param('id') id: string) {
    return plainToClass(ReturnEmailDto, this.personService.getEmails(id));
  }
}
