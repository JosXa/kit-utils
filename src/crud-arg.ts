import "@johnlindquist/kit"
import { Choice } from "@johnlindquist/kit"
import slugify from "slugify"

type CrudArgConfig<T> = {
  addItemPrompt: string
  dbKey: string
  selectOnAdd: boolean
}

const UPDATE_CHOICES: unique symbol = Symbol.for("update-choices")

export async function crudArg<T extends string>(prompt: string, config?: Partial<CrudArgConfig<T>>): Promise<T>

// TODO: The overload with custom `T` is probably a bad idea because getting it right including all kinds of validations is super difficult.
// Probably better to just stick with a `string` version...
// DON'T RECOMMEND USING THIS!
export async function crudArg<T extends { name: string }>(
  prompt: string,
  config: { convertUserInput: (userInput: string) => T | Promise<T> } & Partial<CrudArgConfig<T>>,
): Promise<T>

/** Implementation */
export async function crudArg<T extends string | { name: string }>(
  prompt: string,
  {
    addItemPrompt = "Create Item",
    dbKey = slugify(prompt, { lower: true, trim: true, remove: /[.\-:?]/g, replacement: "_" }),
    selectOnAdd = true,
    ...rest
  }:
    | Partial<CrudArgConfig<T>>
    | ({ convertUserInput?: (userInput: string) => T | Promise<T> } & Partial<CrudArgConfig<T>>) = {},
): Promise<T> {
  const convertUserInput =
    rest && "convertUserInput" in rest && rest.convertUserInput ? rest.convertUserInput : (x: string) => x as T

  debugger
  const { entries, write } = await db(dbKey, {
    entries: [] as Array<T>,
  })

  const formatEntriesAsPanel = () =>
    md(
      entries
        .map((x) => (typeof x === "string" ? x : x.name))
        .map((x) => `- ${x}`)
        .join("\n"),
    )

  const resetSidebar = async () => await setFlagValue(undefined)

  async function onRemoveItem(item: T) {
    const toRemoveIdx = entries.findIndex((x) => {
      if (typeof x === "string" && typeof item === "string") {
        return x === item
      }
      // @ts-expect-error Not quite correct, but we'll expect the user only passes one type of item, either string or {name: string}
      return x.name === item.name
    })
    if (toRemoveIdx === -1) {
      throw Error("Could not find this item")
    }
    entries.splice(toRemoveIdx, 1)
    await write()

    await resetSidebar()
  }

  async function onAddItem(value?: T) {
    if (value) {
      entries.push(value)
    } else {
      const promise = arg<string>(addItemPrompt, formatEntriesAsPanel())

      await resetSidebar()

      entries.push(await convertUserInput(await promise))
    }
    await write()
  }

  async function onEditItem(item: T) {
    const toEditIdx = entries.findIndex((x) => {
      if (typeof x === "string" && typeof item === "string") {
        return x === item
      }
      // @ts-expect-error Not quite correct, but we'll expect the user only passes one type of item, either string or {name: string}
      return x.name === item.name
    })
    if (toEditIdx === -1) {
      throw Error("Could not find this item")
    }

    await resetSidebar()

    const promise = arg<string>({ hint: "Edit item" })
    setInput(typeof item === "string" ? item : item.name)

    const edited = await promise

    entries.splice(toEditIdx, 1, await convertUserInput(edited))
    await write()
  }

  while (true) {
    const promiseResult = await new Promise<T | typeof UPDATE_CHOICES>(async (resolve) => {
      const choices = entries.map((x) => {
        return {
          name: typeof x === "string" ? x : x.name,
          value: x,
          actions: [
            {
              name: "Remove",
              onAction: async (_, state) => {
                await onRemoveItem(state!.focused!.value)
                resolve(UPDATE_CHOICES)
              },
              shortcut: "ctrl+d",
              visible: true,
            },
            {
              name: "Edit",
              onAction: async (_, state) => {
                await onEditItem(state!.focused!.value)
                resolve(UPDATE_CHOICES)
              },
              shortcut: "ctrl+e",
              visible: true,
            },
          ],
        } as Choice<T>
      })

      const selection = await arg<T>(
        {
          placeholder: prompt,
          actions: [
            {
              name: "Add",
              onAction: async () => {
                await onAddItem()
                resolve(UPDATE_CHOICES)
              },
              shortcut: "ctrl+n",
              visible: true,
            },
          ],
        },

        [
          {
            name: addItemPrompt,
            miss: true,
            pass: true,
            hideWithoutInput: true, // https://github.com/johnlindquist/kit/issues/1468
            async onSubmit(input) {
              const item = await convertUserInput(input)
              await onAddItem(item)

              if (selectOnAdd) {
                resolve(item)
              } else {
                resolve(UPDATE_CHOICES)
                return preventSubmit
              }
            },
          },
          ...choices,
        ],
      )

      resolve(selection)
    })

    if (promiseResult === UPDATE_CHOICES) {
      continue
    }

    return promiseResult
  }
}
