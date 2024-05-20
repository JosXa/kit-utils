import { getKenvs, getScriptFiles } from "@johnlindquist/kit/core/utils"

/**
 * Returns the paths for scripts in all kenvs as well as the main kenv
 */
export default async function getAllScriptPaths(): Promise<string[]> {
  const allKenvs = await getKenvs()
  const allScriptFiles = await Promise.all([...allKenvs.map((k) => getScriptFiles(k)), getScriptFiles()])
  return allScriptFiles.flat()
}
