// Name: [kit-utils demo] With CRUD Cache
// Exclude: false

import "@johnlindquist/kit"
import { withCRUDCache } from ".."

await withCRUDCache(() => arg({ name: "Select a city" }, ["Berlin", "Stockholm"]))
