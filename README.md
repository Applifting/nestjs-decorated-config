# NestJS Decorated Config

## Description

Environment variable configuration module for [Nest.js](https://github.com/nestjs/nest) featuring validation using [class-validator](https://github.com/typestack/class-validator) decorators.

## Installation

```bash
$ npm i @applifting-io/nest-decorated-config
```


## Usage

Let's say you have the following .env file (or start your application in an environment providing those variables)

```.env
SECRET="WmOZI77oOQf76cM9GASDWB7tS3MZ01TPM395FCUN9oE="
URL="http://localhost:3000"
```

### ConfigService definition

Create your own ConfigService. Define a property for each environment variable. Decorate them with @Env decorator - make sure the first parameter matches your environment variable name.

Optionally decorate your properties with class-validator decorators.

```ts
// config.service.ts

import { Env } from '@applifting-io/nestjs-decorated-config';
import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

@Injectable()
export class ConfigService {
  @Env('URL')
  @IsUrl()
  readonly url: string;

  @Env('SECRET')
  @IsNotEmpty()
  readonly secret: string;
}
```

#### Options

@Env optionally expects `EnvDecoratorOptions` as second parameter:

```ts
type EnvDecoratorOptions<T = any> = {
  /**
   * Variable's default value, used if no other value is populated from environment. Undefined by default
   */
  defaultValue?: T | (() => T);

  /**
   * Exposing will show the value of variable in log. False by default
   */
  expose?: boolean;

  /**
   * Removes last string character, if it is a forward slash. False by default
   */
  removeTrailingSlash?: boolean;

  /**
   * Parses the value to a JavaScript object with JSON.parse. Throws on invalid input. False by default
   */
  parseJson?: boolean;
};
```

### ConfigModule initialization

Import and add ConfigModule to imports array of your root module.

```ts
// app.module.ts

import { ConfigModule } from '@applifting-io/nestjs-decorated-config';
import { Module } from '@nestjs/common';
import { ConfigService } from 'config.service.ts'

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigService)
  ]
})
export class AppModule {}
```

#### Options

ConfigModule.forRootAsync optionally expects `ConfigModuleOptions` as second parameter:

```ts
type ConfigModuleOptions = {
  /**
   * Print all variables with `expose: true`. False by default
   */
  printOnStartup?: boolean;
  /**
   * Validate all variables using class-validator decorators. True by default
   */
  validate?: boolean;
};
```

### Inject ConfigService where needed

ConfigService is available globally, inject it like any other provider

```ts
// example.service.ts

@Injectable()
export class ExampleService {
  constructor(private readonly config: ConfigService) {}
  
  example() {
    console.log(config.url); // => 'http://localhost:3000'
    console.log(config.secret); // => 'WmOZI77oOQf76cM9GASDWB7tS3MZ01TPM395FCUN9oE='
  }
}
```

## Important

> **IMPORTANT**
> If using .env files:
> `Env` decorators read environment variable values from `process.env`. Due to the nature of decorators in TS, you need to make sure variables from .env file are loaded into process.env **before** importing `Env` or any other JS module that itself imports `Env`.

One way to achieve this in practice is to run dotenv and then dynamically import the rest of your application in your main.ts entrypoint

```ts
// main.ts

import * as dotenv from 'dotenv';

// Dotenv needs to run before importing bootstrap, because @Env decorators are
// executed when JS interpreter interprets the decorated class which is in
// bootstrap's import tree, and we need env var resolution to be finished before that
dotenv.config();

import('./bootstrap').then(({ bootstrap }) => bootstrap());
```

