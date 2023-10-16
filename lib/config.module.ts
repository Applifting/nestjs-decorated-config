import { Global, Module } from '@nestjs/common';
import { Config } from './config.service';
import { ConfigPrinter } from './utils/config-printer';
import { ConfigValidator } from './utils/config-validator';

@Global()
@Module({
  providers: [Config, ConfigPrinter, ConfigValidator],
  exports: [Config],
})
export class ConfigModule {}
