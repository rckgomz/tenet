import { NestFactory } from '@nestjs/core';
import { AcquisitionModule } from './acquisition.module';

async function bootstrap() {
  const app = await NestFactory.create(AcquisitionModule);
  await app.listen(3000);
}
bootstrap();
