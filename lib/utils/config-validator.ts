import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class ConfigValidator {
  private readonly logger: LoggerService = new Logger(ConfigValidator.name);

  async validate(config: Record<string, any>): Promise<void> {
    this.logger.log(`Validating config...`);

    const errors = await validate(config);

    if (errors.length) {
      this.logger.log(errors);
      throw new Error('Config validation failed. Fix the issues above.');
    } else {
      this.logger.log(`Config is valid.`);
    }
  }
}
