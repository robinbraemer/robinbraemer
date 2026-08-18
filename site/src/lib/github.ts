import { Context, Effect, flow, Layer, Schema } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"
import type { GithubSourceType } from "../../../profile.config.ts"

export class GithubRepo extends Schema.Class<GithubRepo>("GithubRepo")({
  name: Schema.String,
  description: Schema.NullOr(Schema.String),
  stargazers_count: Schema.Int,
  language: Schema.NullOr(Schema.String),
  html_url: Schema.String,
  fork: Schema.Boolean,
}) {}

export class GithubUser extends Schema.Class<GithubUser>("GithubUser")({
  login: Schema.String,
  name: Schema.NullOr(Schema.String),
  bio: Schema.NullOr(Schema.String),
  company: Schema.NullOr(Schema.String),
  location: Schema.NullOr(Schema.String),
  avatar_url: Schema.String,
  followers: Schema.Int,
}) {}

export class GithubApiError extends Schema.TaggedError<GithubApiError>()("GithubApiError", {
  cause: Schema.Defect(),
}) {}

export class GithubApi extends Context.Service<GithubApi, {
  readonly user: (login: string) => Effect.Effect<GithubUser, GithubApiError>
  readonly reposFor: (source: GithubSourceType) => Effect.Effect<ReadonlyArray<GithubRepo>, GithubApiError>
}>()("site/lib/GithubApi") {
  static readonly layer = Layer.effect(
    GithubApi,
    Effect.gen(function* () {
      const client = (yield* HttpClient.HttpClient).pipe(
        HttpClient.mapRequest(flow(
          HttpClientRequest.prependUrl("https://api.github.com"),
          HttpClientRequest.acceptJson,
          HttpClientRequest.setHeader("User-Agent", "robinbraemer-portfolio"),
        )),
        HttpClient.filterStatusOk,
      )

      const user = Effect.fn("GithubApi.user")(function* (login: string) {
        return yield* client.get(`/users/${login}`).pipe(
          Effect.flatMap(HttpClientResponse.schemaBodyJson(GithubUser)),
          Effect.mapError((cause) => new GithubApiError({ cause })),
        )
      })

      const reposFor = Effect.fn("GithubApi.reposFor")(function* (source: GithubSourceType) {
        const path = source.type === "user"
          ? `/users/${source.login}/repos`
          : `/orgs/${source.login}/repos`
        return yield* client.get(path, { urlParams: { per_page: "100", sort: "updated" } }).pipe(
          Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(GithubRepo))),
          Effect.mapError((cause) => new GithubApiError({ cause })),
        )
      })

      return GithubApi.of({ user, reposFor })
    }),
  ).pipe(Layer.provide(FetchHttpClient.layer))
}
