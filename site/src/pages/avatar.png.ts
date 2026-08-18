import type { APIRoute } from "astro"
import { Effect } from "effect"
import { env } from "cloudflare:workers"

interface CloudflareEnv {
  PROFILE_KV: KVNamespace
}
const kv = (env as unknown as CloudflareEnv).PROFILE_KV

const AVATAR_URL = "https://avatars.githubusercontent.com/u/22003767?v=4"
const CACHE_KEY = "avatar:png:v1"
const CACHE_TTL_SECONDS = 24 * 60 * 60

const program = Effect.gen(function* () {
  const cached = yield* Effect.tryPromise(() => kv.get(CACHE_KEY, "arrayBuffer")).pipe(
    Effect.catch(() => Effect.succeed(null)),
  )
  if (cached) return cached

  const bytes = yield* Effect.tryPromise(async () => {
    const res = await fetch(AVATAR_URL)
    if (!res.ok) throw new Error(`GitHub avatar fetch failed: ${res.status}`)
    return res.arrayBuffer()
  })

  yield* Effect.tryPromise(() => kv.put(CACHE_KEY, bytes, { expirationTtl: CACHE_TTL_SECONDS })).pipe(
    Effect.catch(() => Effect.void),
  )

  return bytes
})

export const GET: APIRoute = async () => {
  const bytes = await Effect.runPromise(
    program.pipe(
      Effect.catch(() => Effect.tryPromise(() => fetch(AVATAR_URL).then((r) => r.arrayBuffer()))),
    ),
  )
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
