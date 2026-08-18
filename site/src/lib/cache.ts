import { Context, Effect, Layer, Schema } from "effect"
import { env } from "cloudflare:workers"

interface CloudflareEnv {
  PROFILE_KV: KVNamespace
}

export class KvReadError extends Schema.TaggedError<KvReadError>()("KvReadError", {
  cause: Schema.Defect(),
}) {}

export class KvWriteError extends Schema.TaggedError<KvWriteError>()("KvWriteError", {
  cause: Schema.Defect(),
}) {}

export class ProfileCache extends Context.Service<ProfileCache, {
  readonly get: (key: string) => Effect.Effect<string | null, KvReadError>
  readonly put: (key: string, value: string) => Effect.Effect<void, KvWriteError>
}>()("site/lib/ProfileCache") {
  // Cloudflare only reveals bindings via the `cloudflare:workers` module import
  // at the point of use (there's no upfront env object to close over), so the
  // Layer just wraps that import directly rather than threading a request
  // context through — Astro's Cloudflare adapter gives every request a fresh
  // module evaluation, so this stays request-scoped in practice.
  static readonly layer = Layer.succeed(
    ProfileCache,
    ProfileCache.of({
      get: (key) =>
        Effect.tryPromise({
          try: () => (env as unknown as CloudflareEnv).PROFILE_KV.get(key),
          catch: (cause) => new KvReadError({ cause }),
        }),
      put: (key, value) =>
        Effect.tryPromise({
          try: () => (env as unknown as CloudflareEnv).PROFILE_KV.put(key, value),
          catch: (cause) => new KvWriteError({ cause }),
        }),
    }),
  )
}
