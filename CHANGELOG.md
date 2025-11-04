# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- `strict` mode option for runtime validation of required environment variables  
- `coerce` mode option for automatic type conversion based on TypeScript types

## [0.1.0] - 2025-11-04

### Added
- Initial release
- `ConfigModule` for NestJS integration with optional `forRoot()` configuration
- `ConfigService` with automatic camelCase to SCREAMING_SNAKE_CASE conversion  
- `@InjectConfig()` decorator for dependency injection
- `TypedConfig<T>` type helper for full TypeScript support
- **Environment file loading** via `loadEnv` option with proper precedence order
- Support for multiple naming conventions (camelCase, PascalCase, mixed case)
- Full destructuring support
- Comprehensive documentation and examples
- Support for `.env`, `.env.local`, `.env.{NODE_ENV}`, and `.env.{NODE_ENV}.local` files

[Unreleased]: https://github.com/shipdventures/neoma-config/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/shipdventures/neoma-config/releases/tag/v0.1.0