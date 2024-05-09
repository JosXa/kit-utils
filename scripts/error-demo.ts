// Name: [kit-utils demo] Error
// Exclude: false
// noinspection ExceptionCaughtLocallyJS

import "@johnlindquist/kit"
import { error } from ".."

try {
  throw new Error("Something went wrong!")
} catch (err) {
  await error(err, "Houston, we have a problem!")
}

await error("This is just a string", "A title")
await error({ this: "is", an: "object" })

try {
  await get("https://some.definitely.invalid-url")
} catch (err) {
  await error(err, "Here's an Axios error!")
}

await error(new Error("<b>Some `text` with </b>__Markdown__ will get **escaped**!"))
