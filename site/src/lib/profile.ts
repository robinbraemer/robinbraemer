import { Effect, Layer } from "effect"
import { GithubApi } from "./github.ts"
import { ProfileCache } from "./cache.ts"
import { profile as config } from "../../../profile.config.ts"

export const ProfileLayer = Layer.mergeAll(GithubApi.layer, ProfileCache.layer)

const CACHE_KEY = "profile:aggregate:v1"
const CACHE_TTL_MS = 15 * 60 * 1000

export interface ResolvedRepo {
  name: string
  description: string
  stars: number
  language: string
  url: string
}

export interface ResolvedProfile {
  login: string
  name: string
  bio: string
  company: string
  location: string
  avatar_url: string
  followers: number
  repos: ReadonlyArray<ResolvedRepo>
  source: "kv" | "github" | "static"
}

const staticFallback: ResolvedProfile = {
  login: "robinbraemer",
  name: config.name,
  bio: "Senior SRE & Agentic Platform Engineer | Rust, Go, TS, Kubernetes, AI",
  company: "@akua-dev @minekube",
  location: "Germany, Berlin",
  avatar_url: `${config.avatarSource}?s=512`,
  followers: 0,
  repos: [],
  source: "static",
}

interface CachedPayload {
  fetchedAt: number
  data: Omit<ResolvedProfile, "source">
}

const fetchFresh = Effect.fn("profile.fetchFresh")(function* () {
  const gh = yield* GithubApi
  const user = yield* gh.user("robinbraemer")

  const repoLists = yield* Effect.all(
    config.githubSources.map((source) => gh.reposFor(source)),
    { concurrency: "unbounded" },
  )

  const seen = new Set<string>()
  const repos: ResolvedRepo[] = repoLists
    .flat()
    .filter((repo) => !repo.fork)
    .filter((repo) => {
      if (seen.has(repo.html_url)) return false
      seen.add(repo.html_url)
      return true
    })
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 20)
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      stars: repo.stargazers_count,
      language: repo.language ?? "",
      url: repo.html_url,
    }))

  const data: Omit<ResolvedProfile, "source"> = {
    login: user.login,
    name: user.name ?? config.name,
    bio: user.bio ?? "",
    company: user.company ?? "",
    location: user.location ?? "",
    avatar_url: user.avatar_url,
    followers: user.followers,
    repos,
  }
  return data
})

// Never fails: cache hit -> live fetch -> stale cache -> static fallback,
// each step degrading gracefully instead of surfacing an error to the page.
export const loadProfile: Effect.Effect<ResolvedProfile, never, GithubApi | ProfileCache> = Effect.gen(
  function* () {
    const cache = yield* ProfileCache

    const cachedRaw = yield* cache.get(CACHE_KEY).pipe(Effect.catch(() => Effect.succeed(null)))
    const cached = cachedRaw ? (JSON.parse(cachedRaw) as CachedPayload) : null

    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return { ...cached.data, source: "kv" as const }
    }

    const fresh = yield* fetchFresh().pipe(
      Effect.map((data) => ({ ok: true as const, data })),
      Effect.catch(() => Effect.succeed({ ok: false as const, data: undefined })),
    )

    if (fresh.ok) {
      const payload: CachedPayload = { fetchedAt: Date.now(), data: fresh.data }
      yield* cache.put(CACHE_KEY, JSON.stringify(payload)).pipe(Effect.catch(() => Effect.void))
      return { ...fresh.data, source: "github" as const }
    }

    if (cached) {
      return { ...cached.data, source: "kv" as const }
    }

    return staticFallback
  },
)
