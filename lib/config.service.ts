import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsSemVer,
  IsUrl,
} from 'class-validator';
import parseDatabaseUrl from 'ts-parse-database-url';
import { Env } from './decorators/env.decorator';
import { GraphqlIdeEnum, MockSchemaEnum } from './types/enums';

/**
 * A config class that is populated from environment variables and enable the use of validation decorators.
 */
@Injectable()
export class Config {
  // basic info
  readonly name: string = 'Applifting NestJS Template';
  readonly description: string =
    'Template NestJS backend for Applifting projects. Implements basic functionality that is a good start for most projects.';

  @IsSemVer()
  readonly version: string = '0.8.0';

  @Env('NODE_ENV', { expose: true })
  @IsOptional()
  readonly nodeEnv: string;

  @Env('VERSION', { expose: true })
  @IsOptional()
  readonly versionOverride: string;

  @Env('ENV_NAME', { expose: true })
  @IsOptional()
  readonly envName: string;

  @Env('BASE_URL', {
    defaultValue: 'http://localhost:3000',
    expose: true,
    removeTrailingSlash: true,
  })
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly baseUrl?: string;

  @Env('FRONTEND_BASE_URL', {
    defaultValue: 'http://localhost:3001',
    expose: true,
    removeTrailingSlash: true,
  })
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  readonly frontendBaseUrl?: string;

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

  @Env('GRAPHQL_IDE', { expose: true })
  @IsEnum(GraphqlIdeEnum)
  @IsOptional()
  readonly graphqlIde: string;

  @Env('GRAPHQL_INTROSPECTION', { expose: true, defaultValue: true })
  @IsBoolean()
  readonly graphqlIntrospection: boolean;

  @Env('GRAPHQL_MOCKS_MODE', { expose: true })
  @IsEnum(MockSchemaEnum)
  @IsOptional()
  readonly graphqlMocksMode: string;

  @Env('SENTRY_DSN', {
    expose: true,
  })
  @IsOptional()
  readonly sentryDsn?: string;

  @Env('CI_COMMIT_TAG', { expose: true })
  @IsOptional()
  readonly ciCommitTag: string;

  @Env('CI_COMMIT_SHORT_SHA', { expose: true })
  @IsOptional()
  readonly ciCommitShortSha: string;

  // for eventual admin endpoints (e.g. delete organization/tenant etc)
  @Env('ADMIN_API_KEY')
  @IsNotEmpty()
  readonly adminApiKey: string;

  @Env('LOG_HTTP_CLIENT_REQUESTS', { defaultValue: true, expose: true })
  @IsBoolean()
  readonly logHttpClientRequests: boolean;

  @Env('ENCRYPTION_KEY_PASSWORD')
  @IsNotEmpty()
  readonly encryptionKeyPassword: string;

  @Env('STRIPE_API_KEY')
  @IsOptional()
  @IsNotEmpty()
  readonly stripeApiKey: string;

  @Env('STRIPE_CONFIGURATION_ID', {})
  @IsOptional()
  @IsNotEmpty()
  readonly stripeConfigurationId: string;

  @Env('JWT_SECRET')
  @IsNotEmpty()
  readonly jwtSecret: string;

  @Env('ACCESS_TOKEN_EXPIRATION_TIME', { defaultValue: '1h', expose: true })
  readonly accessTokenExpirationTime: string;

  @Env('REFRESH_TOKEN_EXPIRATION_TIME', { defaultValue: '7d', expose: true })
  readonly refreshTokenExpirationTime: string;

  @Env('HTTP_ONLY_COOKIEs', { defaultValue: true, expose: true })
  readonly httpOnlyCookies: true;

  @Env('SAME_SITE_COOKIES', { defaultValue: 'lax', expose: true })
  readonly sameSiteCookies: 'none' | 'lax' | 'strict';

  @Env('SECURE_COOKIES', { defaultValue: true, expose: true })
  readonly secureCookies: boolean;

  /**
   * Whether this instance is a scheduler instance
   */
  @Env('IS_SCHEDULER', { defaultValue: true, expose: true })
  @IsOptional()
  @IsBoolean()
  readonly isScheduler?: boolean;

  @Env('GOOGLE_OAUTH_CLIENT_ID')
  @IsOptional()
  @IsNotEmpty()
  readonly googleOauthClientId: string;

  @Env('GOOGLE_OAUTH_CLIENT_SECRET')
  @IsOptional()
  @IsNotEmpty()
  readonly googleOauthClientSecret: string;

  /**
   * Default cache config for rest endpoints
   */
  @Env('CACHE_TTL_MS', { defaultValue: 10 * 1000, expose: true })
  readonly cacheTtlMs: number;

  /**
   * Default cache config for rest endpoints
   */
  @Env('CACHE_MAX_ITEMS', { defaultValue: 1000, expose: true })
  readonly cacheMaxItems: number;

  // parsed postgres values:
  get postgresUser(): string | undefined {
    return parseDatabaseUrl(this.postgresConnectionString).user ?? undefined;
  }

  get postgresPassword(): string | undefined {
    return (
      parseDatabaseUrl(this.postgresConnectionString).password ?? undefined
    );
  }

  get postgresHost(): string {
    return parseDatabaseUrl(this.postgresConnectionString).host ?? 'localhost';
  }

  get postgresPort(): number {
    return parseDatabaseUrl(this.postgresConnectionString).port ?? 5432;
  }

  get postgresDatabase(): string {
    return (
      parseDatabaseUrl(this.postgresConnectionString).database ?? 'example'
    );
  }
}
