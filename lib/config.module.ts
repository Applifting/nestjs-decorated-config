import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigPrinter } from './utils/config-printer';
import { ConfigValidator } from './utils/config-validator';

type ConfigModuleOptions = {
  /**
   * False by default
   */
  printOnStartup?: boolean;
  /**
   * True by default
   */
  validate?: boolean;
};

@Global()
@Module({})
export class ConfigModule {
  static async forRootAsync(
    ConfigService: {
      new (): Record<string, any>;
    },
    options: ConfigModuleOptions,
  ): Promise<DynamicModule> {
    const optionsWithDefaults = {
      printOnStartup: options.printOnStartup ?? false,
      validate: options.validate ?? true,
    };

    const config = new ConfigService();
    const configPrinter = new ConfigPrinter();
    const configValidator = new ConfigValidator();

    if (optionsWithDefaults.printOnStartup) {
      configPrinter.print(config);
    }
    if (optionsWithDefaults.validate) {
      try {
        await configValidator.validate(config);
      } catch (e) {
        console.error(`Config validation failed: ${e}`);
        process.exit(1);
      }
    }

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
