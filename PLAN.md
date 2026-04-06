# @neoma/config v0.4.0 — Global Module + Case-Insensitive Lookup

## Context

We're integrating `@neoma/config` into meetbertie to replace raw `process.env.*!` calls with typed, validated config injection. Two issues surfaced:

1. **ConfigModule isn't global** — every module that needs `ConfigService` must import `ConfigModule`, and `GarmrModule.forRootAsync({ inject: [ConfigService] })` can't resolve it without an explicit import. Config is cross-cutting; it should register once at the root.

2. **Lowercase env vars are invisible** — npm sets `npm_package_version` (lowercase), but the proxy only checks `NPM_PACKAGE_VERSION`. The `ViewLocalsMiddleware` in meetbertie needs `npm_package_version` for the template version display.

## Approach — Option A (Fallback Lookup)

**Recommended over Option B (normalize process.env at startup)** because:
- No mutation of global state — `process.env` stays untouched
- Deterministic — always tries UPPER first, lowercase fallback
- No startup cost of iterating all env vars
- Two O(1) hash lookups per access is negligible

### Change 1: Global `forRoot()` + empty base `@Module`

**`libs/config/src/config.module.ts`**:
- Empty the `@Module({})` decorator — remove `providers` and `exports`. Plain `ConfigModule` import becomes a no-op, consistent with NestJS conventions (`@nestjs/typeorm`, etc.)
- Add `global: true` to the `DynamicModule` return from `forRoot()`. `forRoot()` is now the only way to register `ConfigService`.

This is a breaking change from v0.3.0 (plain `ConfigModule` no longer provides `ConfigService`), but we're pre-1.0 and the migration is trivial: `ConfigModule` → `ConfigModule.forRoot()`.

**Tests** (`config.module.spec.ts`):
- `forRoot()` makes `ConfigService` available to child modules without importing `ConfigModule`
- Plain `ConfigModule` does NOT provide `ConfigService`
- Existing `@InjectConfig` test: change `imports: [ConfigModule]` → `imports: [ConfigModule.forRoot()]` (the decorator itself is unchanged, just the test setup)

### Change 2: Case-Insensitive Env Var Lookup

**`libs/config/src/config.service.ts`**:
- Extract `toEnvKey(prop)` helper (eliminates duplication between get/has traps)
- `get` trap: `process.env[envKey] ?? process.env[envKey.toLowerCase()]` — uses `??` not `||` to preserve empty strings
- `has` trap: `process.env[envKey] !== undefined || process.env[envKey.toLowerCase()] !== undefined`
- Precedence: UPPER wins when both exist

**Tests** (`config.service.spec.ts`) — inside the parametrized module variants. Use faker to randomize the lowercase env var name and value (same pattern as existing uppercase tests):
- `config.randomProp` returns value when only `random_prop` (lowercase) is set
- `"randomProp" in config` returns `true` for lowercase-only
- UPPER takes precedence when both exist
- `undefined` / `has` returns `false` when neither exists
- Strict mode: doesn't throw when lowercase exists, throws when neither exists
- Coerce mode: coercion applies to lowercase fallback values

### Housekeeping

- Update `CHANGELOG.md` under `[Unreleased]` (note breaking change: plain `ConfigModule` no longer registers providers)
- Update JSDoc on `forRoot()` to mention global registration
- Update JSDoc on `ConfigModule` class to remove plain import examples
- Version bump happens post-merge on `main`, not on the feature branch

## Files to Modify

| File | Change |
|------|--------|
| `libs/config/src/config.module.ts` | Empty `@Module({})`, add `global: true` to `forRoot()` return |
| `libs/config/src/config.module.spec.ts` | Assert `forRoot()` returns `global: true`, update `@InjectConfig` test setup to use `forRoot()` |
| `libs/config/src/config.service.ts` | Extract `toEnvKey()`, add lowercase fallback in get/has |
| `libs/config/src/config.service.spec.ts` | Remove plain `ConfigModule` from parametrized `modules` array, add case-insensitive tests across all variants + strict + coerce |
| `CHANGELOG.md` | Add `[Unreleased]` entry |

## Verification

```bash
npm run lint
npm run build
npm test
```
