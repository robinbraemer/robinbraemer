import { Effect, Schema } from "effect"
import { profile } from "../profile.config.ts"

class ReadmeWriteError extends Schema.TaggedError<ReadmeWriteError>()("ReadmeWriteError", {
  cause: Schema.Defect(),
}) {}

const badgeUrl = (text: string, color: string) =>
  `https://img.shields.io/badge/${text.replace(/ /g, "%20")}-${color}?style=for-the-badge`

const featuredRow = (project: (typeof profile.featuredProjects)[number]) => `  <tr>
    <td align="center" width="33%">
      <br/>
      <a href="${project.url}">
        <img src="${badgeUrl(project.badge.text, project.badge.color)}" alt="${project.badge.text.replace(/-/g, " ")}"/>
      </a>
      <br/><br/>
      <b>${project.title}</b>
      <br/><br/>
      ${project.description}
      <br/><br/>
      <a href="${project.url}">${project.url.replace(/^https?:\/\//, "")} →</a>
    </td>
    <td align="center" width="67%" colspan="2">
      <a href="${project.url}">
        <img width="600" alt="${project.title} screenshot" src="${project.image}" />
      </a>
    </td>
  </tr>`

const workRow = (entry: (typeof profile.workHistory)[number]) => `${
  entry.sectionBefore
    ? `<tr>\n<td align="center" colspan="3"><br><b>${entry.sectionBefore}</b></td>\n</tr>\n`
    : ""
}<tr>
<td><b>${entry.company}</b><br>${entry.period}</td>
<td>${entry.impact}</td>
<td><details><summary>More</summary>${entry.details.join("<br>")}</details></td>
</tr>`

const render = () => `<!-- GENERATED FILE — do not hand-edit. Edit profile.config.ts, then run: bun run render-readme -->
<div align="center">

<a href="https://github.com/robinbraemer">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=120&section=header&animation=fadeIn"/>
  <source media="(prefers-color-scheme: light)" srcset="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=120&section=header&animation=fadeIn"/>
  <img width="100%" alt="Header" src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=120&section=header&animation=fadeIn"/>
</picture>
</a>

# ${profile.name}

**${profile.tagline}**

<!-- Social badges with hover effect -->

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](${profile.links.find((l) => l.label === "LinkedIn")?.href})
[![Email](https://img.shields.io/badge/Email-EA4335?style=flat&logo=gmail&logoColor=white)](${profile.links.find((l) => l.label === "Email")?.href})

</div>

<br>

> ${profile.bioIntro}

${profile.bioLong}

<br>

<table width="100%">
  <tr>
    <td align="center" colspan="3">
      <b>Featured Projects</b>
    </td>
  </tr>
${profile.featuredProjects.map(featuredRow).join("\n")}
</table>

---

## Professional Path & Impact

<table>
<tr>
<th width="20%">Company</th>
<th width="45%">My Impact</th>
<th width="35%">Details</th>
</tr>
${profile.workHistory.map(workRow).join("\n")}
</table>

---

## Technical DNA

<div align="center">

<!-- Tech stack with skillicons - https://skillicons.dev -->
<img src="https://skillicons.dev/icons?i=go,ts,svelte,java,python,bash&perline=6" />
<br><sub>Languages</sub>
<br><br>
<img src="https://skillicons.dev/icons?i=kubernetes,docker,gcp,cloudflare,prometheus,grafana,terraform,ansible&perline=8" />
<br><sub>Infrastructure & Cloud</sub>
<br><br>
<img src="https://skillicons.dev/icons?i=postgres,redis,mysql,cassandra,sqlite,firebase,graphql&perline=7" />
<br><sub>Databases</sub>
<br><br>
<img src="https://skillicons.dev/icons?i=tailwind,html,css,nextjs,react&perline=5" />
<br><sub>Frontend</sub>
<br><br>
<img src="https://skillicons.dev/icons?i=git,github,gitlab,linux,idea,vscode,discord&perline=7" />
<br><sub>Tools & Platforms</sub>

</div>

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=gradient&color=0:667eea,100:764ba2&height=100&section=footer"/>
`

const program = Effect.gen(function* () {
  const content = render()
  yield* Effect.tryPromise({
    try: () => Bun.write(new URL("../README.md", import.meta.url), content),
    catch: (cause) => new ReadmeWriteError({ cause }),
  })
  yield* Effect.log("Wrote README.md")
})

Effect.runPromise(program).catch((error) => {
  console.error(error)
  process.exit(1)
})
