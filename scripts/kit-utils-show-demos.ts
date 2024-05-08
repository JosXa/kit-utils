// Name: [kit-utils] Show or Hide Demos

import "@johnlindquist/kit"
import { getKenvs, getMetadata, getScriptFiles, setMetadata } from "@johnlindquist/kit/core/utils"
import { refreshScripts } from "@johnlindquist/kit/core/db"

const falseSymbol = Symbol.for("false")

const data = await db({ shown: false })

const selection = await select(
  {
    hint:
      `The kit-utils demo scripts are currently ${data.shown ? "visible" : "not visible"} in the menu.` + data.shown
        ? ""
        : ` Would you like to show them?`,
    multiple: false,
  },
  data.shown
    ? [
        { name: "Bring me to the Demos", value: "redirect" },
        { name: "❌ Hide the demo Scripts", value: falseSymbol },
      ]
    : [{ name: "✅ Show the Demo Scripts", value: true }],
)

if (selection === "redirect") {
  await redirect()
} else {
  data.shown = selection === true
  await data.write()

  const allKenvs = await getKenvs()
  const kitUtilsKenv = allKenvs.find((x) => x.endsWith("kit-utils"))
  const kitUtilsScripts: string[] = await getScriptFiles(kitUtilsKenv)

  const scriptsToChange = kitUtilsScripts.filter(
    (x) => !x.endsWith("kit-utils-show-demos.ts") && !x.startsWith("internal-"),
  )

  async function changeExcludeComment(filePath: string, nowShown: boolean) {
    const fileContents = await readFile(filePath, { encoding: "utf-8" })
    const newContent = setMetadata(fileContents, { Exclude: nowShown ? "false" : "true" })
    await writeFile(filePath, newContent)
  }

  await Promise.allSettled(scriptsToChange.map((x) => changeExcludeComment(x, data.shown)))

  if (data.shown) {
    await refreshScripts()
    await redirect()
  }
}

async function redirect() {
  await mainScript("[kit-utils demo] ")
}
