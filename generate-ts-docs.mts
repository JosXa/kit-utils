import { parseExportedFunctionsAsync, renderFunctionDataToMarkdown } from 'generate-ts-docs'

import path from 'path'
import { parseTypeDeclarationSourceFiles } from 'generate-ts-docs/lib/utilities/parse-type-declaration-source-files'

// const testFile = path.join(root, 'src', '*.ts')
//
// const glob = testFile.replaceAll('\\', '/')
// console.log(glob)

// const functionsData = await parseExportedFunctionsAsync(['./index.ts', './src/*.ts'], { tsconfigFilePath: './tsconfig.json' })
// console.log({ functionsData })
// for (const functionData of functionsData) {
//   console.log(renderFunctionDataToMarkdown(functionData))
//   // await div(JSON.stringify(renderFunctionDataToMarkdown(functionData)))
// }


await parseTypeDeclarationSourceFiles(["./dist/"])
