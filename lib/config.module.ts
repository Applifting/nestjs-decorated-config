import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigPrinter } from './utils/config-printer';
import { ConfigValidator } from './utils/config-validator';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(ConfigService: {
    new (): Record<string, any>;
  }): DynamicModule {
    const config = new ConfigService();
    const configPrinter = new ConfigPrinter();
    const configValidator = new ConfigValidator();

    configPrinter.print(config);
    configValidator.validate(config);

    return {
      module: ConfigModule,
      providers: [
        { provide: ConfigService, useValue: config },
        { provide: ConfigPrinter, useValue: configPrinter },
        { provide: ConfigValidator, useValue: configValidator },
      ],
      exports: [ConfigService, ConfigPrinter, ConfigValidator],
    };
  }
}
