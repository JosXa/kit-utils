// Name: Collect Demos as Markdown
// Exclude: false

import "@johnlindquist/kit"

import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const scriptsPath = dirname(fileURLToPath(import.meta.url))

let scripts = await getScripts()

const scriptFiles = (await readdir(scriptsPath)).map((x) => path.join(scriptsPath, x))

debugger
scripts = scripts
  .filter((script) => scriptFiles.includes(script.filePath))
  .filter((script) => script.name.includes("[kit-utils demo]"))

// Convert names into Markdown h2's with the Content Below
let markdownBody = ""
for (const script of scripts.sort((a, b) => a.name.localeCompare(b.name))) {
  const content = await readFile(script.filePath, "utf8")
  markdownBody += `### ${script.name.replace("[kit-utils demo] ", "")}\n\n`
  markdownBody += "```ts\n"
  markdownBody += content.slice(content.indexOf("import")).replaceAll('".."', '"@josxa/kit-utils"')
  markdownBody += "\n```\n\n"
}

await writeFile(path.join(scriptsPath, "../", "docs", "demos-generated.md"), markdownBody)
