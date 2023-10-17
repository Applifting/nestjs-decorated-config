# NestJS Awesome Config Module

- [ ] TODO: come up with a better name
- [ ] TODO: create docs

## Example config service
```ts
import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsSemVer,
  IsUrl,
} from 'class-validator';
import { Env } from './decorators/env.decorator';

/**
 * A config class that is populated from environment variables and enable the use of validation decorators.
 */
@Injectable()
export class Config {
  /**
   * Example environment variables
   */
  @Env('NODE_ENV', { expose: true })
  @IsOptional()
  readonly nodeEnv?: string;

  @Env('BASE_URL', {
    defaultValue: 'http://localhost:3000',
    expose: true,
    removeTrailingSlash: true,
  })
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly baseUrl: string;

  @Env('PORT', { expose: true, defaultValue: 3000 })
  readonly port: number;

  @Env('DATABASE_URL', {
    expose: true,
    defaultValue: 'postgres://postgres:password4251@postgres:5432/example',
  })
  readonly postgresConnectionString: string;

  @Env('POSTGRES_SSL', { expose: true, defaultValue: false })
  @IsBoolean()
  readonly postgresSsl: boolean;

  /**
   * You can also hardcode config values
   */
  @IsSemVer()
  readonly version: string = '0.8.0';

  /**
   * Example of a getter
   */
  get postgresUser(): string | undefined {
    return (
      this.postgresConnectionString.split('://')[1]?.split(':')[0] ?? undefined
    );
  }
}
```