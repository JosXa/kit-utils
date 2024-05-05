// Name: [kit-utils] Show or Hide Demos

import '@johnlindquist/kit'
import { getKenvs, getScriptFiles } from '@johnlindquist/kit/core/utils'

const falseSymbol = Symbol.for('false')

const data = await db({ shown: false })

const selection = await select(
  {
    hint:
      `The kit-utils demo scripts are currently ${data.shown ? 'visible' : 'not visible'} in the menu.` + data.shown
        ? ''
        : ` Would you like to show them?`,
    multiple: false,
  },
  data.shown
    ? [
        { name: 'Bring me to the Demos', value: 'redirect' },
        { name: '❌ Hide the demo Scripts', value: falseSymbol },
      ]
    : [{ name: '✅ Show the Demo Scripts', value: true }],
)

if (selection === 'redirect') {
  await redirect()
} else {
  data.shown = selection === true
  await data.write()

  const allKenvs = await getKenvs()
  const kitUtilsKenv = allKenvs.find((x) => x.endsWith('kit-utils'))
  const kitUtilsScripts: string[] = await getScriptFiles(kitUtilsKenv)

  const scriptsToChange = kitUtilsScripts.filter((x) => !x.endsWith('kit-utils-show-demos.ts'))

  console.log(scriptsToChange)

  async function changeExcludeComment(filePath: string, nowShown: boolean) {
    const fileContents = await readFile(filePath, { encoding: 'utf-8' })

    let newContent: string
    if (nowShown) {
      newContent = fileContents.replace('// Exclude: true', '// Exclude: false')
    } else {
      newContent = fileContents.replace('// Exclude: false', '// Exclude: true')
    }

    console.log({ nowShown, data: newContent.split('\n').slice(0, 3).join('\n') })

    await writeFile(filePath, newContent)
  }

  await Promise.allSettled(scriptsToChange.map((x) => changeExcludeComment(x, data.shown)))

  if (data.shown) {
    await redirect()
  }
}

async function redirect() {
  await mainScript('[kit-utils demo] ')
}
