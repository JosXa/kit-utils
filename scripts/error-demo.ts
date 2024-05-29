// Name: [kit-utils demo] Error
// Exclude: false
// noinspection ExceptionCaughtLocallyJS

import "@johnlindquist/kit"
import { showError } from ".."

try {
  throw new Error("Something went wrong!")
} catch (err) {
  await showError(err, "Houston, we have a problem!")
}

await showError("This is just a string", "A title")
await showError({ this: "is", an: "object" })

try {
  await get("https://httpstat.us/400")
} catch (err) {
  await showError(err, "Here's an Axios error!")
}

await showError(new Error("<b>Some `text` with </b>__Markdown__ will get **escaped**!"))
