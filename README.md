# @neoma/config

Simple, type-safe environment configuration for NestJS applications.

## The Problem

NestJS's built-in ConfigService adds unnecessary complexity:

- Needs schema validation setup for type safety
- Still requires repetitive `get()` calls with magic strings

Even worse than raw `process.env` calls, you end up maintaining configuration boilerplate that grows with every new environment variable.

## The Solution

`@neoma/config` provides a clean, type-safe way to access environment variables through dependency injection:

```typescript
// Before: Repetitive, untyped, error-prone
class DatabaseService {
  connect() {
    const host = process.env.DATABASE_HOST
    const port = process.env.DATABASE_PORT
    const user = process.env.DATABASE_USER
    // No type checking, no autocomplete
  }
}

// After: Clean, typed, injected
class DatabaseService {
  constructor(
    @InjectConfig()
    private config: TypedConfig<{
      databaseHost: string
      databasePort: string
      databaseUser: string
    }>,
  ) {}

  connect() {
    const { databaseHost, databasePort, databaseUser } = this.config
    // Full type safety and autocomplete!
  }
}
```

## Installation

```bash
npm install @neoma/config
```

## Basic Usage

### 1. Import the ConfigModule

```typescript
import { Module } from "@nestjs/common"
import { ConfigModule } from "@neoma/config"

@Module({
  imports: [ConfigModule],
})
export class AppModule {}
```

### 2. Inject and use configuration

```typescript
import { Injectable } from "@nestjs/common"
import { InjectConfig, TypedConfig } from "@neoma/config"

@Injectable()
export class AppService {
  constructor(
    @InjectConfig()
    private config: TypedConfig<{
      apiKey: string
      apiUrl: string
      debugMode: string
    }>,
  ) {}

  makeRequest() {
    // Access environment variables with type safety
    const url = this.config.apiUrl // reads from API_URL
    const key = this.config.apiKey // reads from API_KEY
    const debug = this.config.debugMode // reads from DEBUG_MODE
  }
}
```

## Naming Convention Flexibility

The package automatically converts between camelCase/PascalCase and SCREAMING_SNAKE_CASE, supporting multiple coding styles:

```typescript
// All of these work with DATABASE_URL environment variable:
config.databaseUrl // camelCase (JavaScript convention)
config.databaseURL // Mixed case (common for acronyms)
config.database_url // Snake case (if you prefer)

// Complex examples:
config.apiKey // API_KEY
config.apiURL // API_URL
config.awsS3Bucket // AWS_S3_BUCKET
config.awsS3BucketName // AWS_S3_BUCKET_NAME
```

## Type Safety

Define your configuration interface for full TypeScript support:

```typescript
interface AppConfig {
  // Required configuration
  databaseUrl: string
  redisHost: string
  jwtSecret: string

  // Optional configuration
  port?: string
  logLevel?: string
}

@Injectable()
export class AppService {
  constructor(
    @InjectConfig()
    private config: TypedConfig<AppConfig>,
  ) {}

  connect() {
    // TypeScript knows these are strings
    const dbUrl = this.config.databaseUrl
    const redis = this.config.redisHost

    // TypeScript knows these might be undefined
    const port = this.config.port || "3000"
  }
}
```

## How It Works

Under the hood, `@neoma/config` uses a Proxy to intercept property access and automatically:

1. Convert property names from camelCase to SCREAMING_SNAKE_CASE
2. Look up the corresponding environment variable
3. Return the value with proper typing

This means zero configuration, zero boilerplate, and full type safety.

## API Reference

### `ConfigModule`

NestJS module that provides the ConfigService.

### `ConfigService<T>`

Injectable service that provides typed access to environment variables.

### `TypedConfig<T>`

Type helper that combines ConfigService with your configuration interface.

### `@InjectConfig()`

Decorator for injecting the ConfigService into your services and controllers.

## Links

- [GitHub Repository](https://github.com/shipdventures/neoma-config)
- [NPM Package](https://www.npmjs.com/package/@neoma/config)
- [Neoma Ecosystem](https://github.com/shipdventures/neoma)

## License

MIT

