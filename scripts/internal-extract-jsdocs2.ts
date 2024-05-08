// Name: Extract JSDocs to Markdown 2

// import '@johnlindquist/kit'
import { parseExportedFunctionsAsync, renderFunctionDataToMarkdown } from 'generate-ts-docs'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = path.resolve(__dirname, '../')

// const testFile = path.join(root, 'src', '*.ts')
//
// const glob = testFile.replaceAll('\\', '/')
// console.log(glob)
const functionsData = await parseExportedFunctionsAsync(['C:/Users/josch/.kenv/kenvs/kit-utils/src/refreshable.ts'])
console.log(functionsData)
for (const functionData of functionsData) {
  await div(JSON.stringify(renderFunctionDataToMarkdown(functionData)))
}
