import { Injectable, Logger } from '@nestjs/common';
import { exposedRawConfigurationValuesForDebugging } from '../decorators/env.decorator';

@Injectable()
export class ConfigPrinter {
  private readonly logger = new Logger(ConfigPrinter.name);

  print(config: Record<string, any>): void {
    this.logger.log(`Config values:`);
    exposedRawConfigurationValuesForDebugging.forEach((value) => {
      this.logger.log({
        key: value.propertyKey,
        envVar: value.envVar,
        rawValue: value.exposed ? value.rawValue : '[HIDDEN]',
        sanitizedValue: value.exposed ? config[value.propertyKey] : '[HIDDEN]',
      });
    });
  }
}
