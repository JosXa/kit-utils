// Name: [kit-utils demo] Prompt for Confirmation or Yes/No
// Exclude: false

import "@johnlindquist/kit"
import { promptConfirm } from ".."

const isYes = await promptConfirm("Are you sure?", "yesno")
await div(`You said ${isYes ? "Yes" : "No"}`)

const isConfirmed = await promptConfirm("Something will be deleted. Do you confirm?", "confirm")
await div(`You ${isConfirmed ? "confirmed" : "denied"} this request.`)
