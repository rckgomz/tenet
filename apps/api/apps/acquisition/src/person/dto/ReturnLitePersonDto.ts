import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReturnLitePersonDto {
  @Expose()
  id: string;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
}
