# kit-utils

Script Kit environment (kenv) with UI utilities and other scripting goodies.

This repo does not contain any runnable scripts and is meant to be used as a TypeScript library you can reference in your own scripts.
This means that you do **not** need to mark it as trusted.

## Installation

1. Open Script Kit
2. `Manage Kenvs` -> `Clone repo of scripts`
3. Enter Repo URL: https://github.com/JosXa/kit-utils.git
4. Leave the other options as default and accept the risks. You don't need to mark it as trusted in the next step.

## UI Abstractions

### `crudMenu`

A wrapper around `arg` that remembers previous user choices, with actions to **c**reate, **r**ead, **u**pdate, and **d**elete cached entries.

_Example:_

```ts
import { crudMenu } from '../kenvs/kit-utils'

const city = await crudMenu('Enter a city name')

await div(`You selected: ${city}`)
```
