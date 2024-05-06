// Name: With CRUD Tests

import '@johnlindquist/kit'
import { Action, Choice, Choices, Panel, PromptConfig } from '@johnlindquist/kit'
import slugify from 'slugify'
import { typedObjectValues } from '../lib/typed-stdlib'
import { refreshable } from './refreshable'

type CacheEntries<T> = {
  items: { [key: string]: { choice: NormalizedChoice<T>; state: 'added' } | { state: 'removed' } }
}

class Cache<T> {
  private pendingDb?: {
    write: () => Promise<void>
    read: () => Promise<CacheEntries<T>>
    data: any
  } & CacheEntries<T>

  private get db() {
    if (!this.pendingDb) {
      throw Error('Must be initialized before use')
    }
    return this.pendingDb
  }

  constructor(private dbKey: string) {}

  private _keyOf(item: string | NormalizedChoice<T>) {
    return typeof item === 'string' ? item : item.name
  }

  public async initialize() {
    this.pendingDb = await db(this.dbKey, {
      items: {},
    } satisfies CacheEntries<T>)

    await this.db.write()
  }

  public getChoices(predefinedChoices: NormalizedChoice<T>[]) {
    const result = [] as NormalizedChoice<T>[]

    for (const pre of predefinedChoices) {
      const found = this.db.items[this._keyOf(pre)]

      if (!found) {
        // Not explicitly added or removed, add it
        result.push(pre)
      }
    }

    typedObjectValues(this.db.items).forEach((value) => {
      debugger
      if (value.state === 'added') {
        result.push(value.choice)
      }
    })

    return result
  }

  public async remove(name: string) {
    const found = this.db.items[name]

    if (found && found.state === 'removed') {
      console.warn(`Item with name ${name} was already removed!`)
    }

    this.db.items[name] = { state: 'removed' }

    await this.db.write()
  }

  public async add(item: NormalizedChoice<T>) {
    this.db.items[this._keyOf(item)] = { state: 'added', choice: item }

    await this.db.write()
  }

  public async rename(oldName: string, updatedChoice: NormalizedChoice<T>) {
    const found = this.db.items[this._keyOf(updatedChoice)]

    if (found && found.state === 'removed') {
      throw Error(`Item ${updatedChoice.name} is removed and cannot be renamed!`)
    } else {
      this.db.items[oldName] = { state: 'removed' }
      this.db.items[this._keyOf(updatedChoice)] = { state: 'added', choice: updatedChoice }
    }

    await this.db.write()
  }
}

const DEFAULT_CAPTIONS = {
  addItemPrompt: 'Add Item',
  addItemAction: 'Add',
  editItemAction: 'Edit',
  removeItemAction: 'Remove',
  editItemHint: 'Edit Item',
}

// TODO: Maybe `overrides` for the individual thingies would be the better way to go

const DEFAULT_SHORTCUTS = {
  addItem: 'ctrl+n',
  removeItem: 'ctrl+d',
}

type CrudMenuConfig<T> = {
  dbKey: string
  selectOnAdd: boolean
  captions: typeof DEFAULT_CAPTIONS
  shortcuts: typeof DEFAULT_SHORTCUTS
}

type NormalizedChoice<T> = Choice<T> & { name: string; value: T }

export class WithCRUD<T extends string> {
  private captions: CrudMenuConfig<T>['captions']
  private shortcuts: CrudMenuConfig<T>['shortcuts']
  private selectOnAdd: boolean
  private dbKey?: string
  private db?: Cache<T>

  private predefinedActions: Action[] = []
  private predefinedChoices: NormalizedChoice<T>[] = []

  constructor(
    private prompt: () => Promise<T>,
    { dbKey = undefined, selectOnAdd = false, captions, shortcuts }: Partial<CrudMenuConfig<T>> = {},
  ) {
    this.captions = { ...DEFAULT_CAPTIONS, ...captions }
    this.shortcuts = { ...DEFAULT_SHORTCUTS, ...shortcuts }
    this.selectOnAdd = selectOnAdd
    this.dbKey = dbKey
  }

  private get cache() {
    if (!this.db) {
      throw Error('DB is not initialized')
    }
    return this.db
  }

  private async updateCurrentState() {
    const currentConfig = global.__currentPromptConfig as PromptConfig

    const { name, placeholder } = currentConfig

    this.predefinedActions = this.normalizeActions(currentConfig.actions)
    this.predefinedChoices = this.normalizeChoices(currentConfig.choices)
    // this.name = currentConfig.name
    // this.placeholder = currentConfig.

    // Sanity check
    if (this.predefinedChoices.some((x) => Object.values(x).some((field) => typeof field === 'function'))) {
      console.warn('Please do not use unserializable values in choices. These entries will not be cached correctly.')
    }

    if (!this.db) {
      // Initialize Database
      const dbKey =
        this.dbKey ??
        slugify(name ?? placeholder ?? 'unknown-prompt', {
          lower: true,
          trim: true,
          remove: /[\.\-:]/g,
        })

      this.db = new Cache<T>(dbKey)
      await this.db.initialize()
    }
  }

  public async run() {
    return await refreshable(async (refresh, resolve) => {
      const userPromptPromise = this.prompt()

      await this.updateCurrentState()

      await this.mutateChoices(refresh, resolve)
      await this.mutateActions(refresh)

      return await userPromptPromise
    })
  }

  private async mutateChoices(forceReload: () => unknown, resolve: (value: T) => void): Promise<T | void> {
    const onSubmitAddItemChoice = async (input: string) => {
      const item = this.createChoiceFromInput(input)
      await this.onAddItem(item)

      if (this.selectOnAdd) {
        return item.value
      } else {
        forceReload()
        return preventSubmit
      }
    }
    onSubmitAddItemChoice.bind(this)

    const choices = [
      {
        name: this.captions.addItemPrompt,
        miss: true,
        pass: true,
        hideWithoutInput: true, // https://github.com/johnlindquist/kit/issues/1468
        onSubmit: onSubmitAddItemChoice,
      },
      ...this.cache.getChoices(this.predefinedChoices),
    ] as Array<NormalizedChoice<T> | Choice>

    setChoices(
      choices.map(
        ({ actions, ...rest }) =>
          ({
            ...rest,
            actions: [
              {
                name: this.captions.removeItemAction,
                onAction: async (_, state) => {
                  await this.onRemoveItem(state!.focused!.name)
                  forceReload()
                },
                shortcut: this.shortcuts.removeItem,
                visible: true,
              },
              {
                name: this.captions.editItemAction,
                onAction: async (_, state) => {
                  await this.onEditItem(state!.focused as NormalizedChoice<T>)
                  forceReload()
                },
                shortcut: 'ctrl+e',
                visible: true,
              },
              ...(actions ?? []),
            ],
          }) satisfies Choice<T>,
      ),
    )
  }

  private async mutateActions(refresh: () => unknown): Promise<void> {
    const existingAddAction = this.predefinedActions.find(
      (x) => x.shortcut === this.shortcuts.addItem || x.name === this.captions.addItemAction,
    )

    if (existingAddAction) {
      return
    }

    setActions([
      {
        name: this.captions.addItemAction,
        onAction: async () => {
          await this.onAddItem()
          refresh()
        },
        shortcut: this.shortcuts.addItem,
        visible: true,
        flag: 'add',
      },
      ...this.predefinedActions,
    ])
  }

  private formatChoicesAsPanel() {
    return md(
      this.cache
        .getChoices(this.predefinedChoices)
        .map((x) => `- ${x.name}`)
        .join('\n'),
    )
  }

  private async resetSidebar() {
    return await setFlagValue(undefined)
  }

  private async onRemoveItem(name: string) {
    await this.cache.remove(name)
    await this.resetSidebar()
  }

  private async onAddItem(value?: NormalizedChoice<T>) {
    if (value) {
      await this.cache.add(value)
    } else {
      const promise = arg<T>(this.captions.addItemPrompt, this.formatChoicesAsPanel())

      await this.resetSidebar()
      await this.cache.add(this.normalizeChoice(await promise))
    }
  }

  private async onEditItem(item: NormalizedChoice<T>) {
    await this.resetSidebar()

    const promise = arg<T>({ hint: this.captions.editItemHint })
    await setInput(item.name)

    const newName = await promise

    const newItem = this.createChoiceFromInput(newName)
    await this.cache.rename(item.name, newItem)
  }

  private createChoiceFromInput(input: string): NormalizedChoice<T> {
    // @ts-expect-error TODO: This must get exposed to the caller
    return { name: input, value: input }
  }

  private normalizeChoice(choice: T | Choice<T>): NormalizedChoice<T> {
    // @ts-expect-error No sanity check here yet, we just assume...
    if (typeof choice === 'object') return choice

    return { name: choice, value: choice }
  }

  private normalizeChoices(choices?: Panel | Choices<any>): Array<NormalizedChoice<T>> {
    // TODO: Account for choice generator functions

    if (!choices || !Array.isArray(choices)) {
      return []
    }

    return choices.map((c) => {
      if (typeof c === 'object') {
        return { ...c, value: c.value ?? c.name }
      }
      return { name: c, value: c }
    })
  }

  private normalizeActions(actions?: Action[] | Panel): Action[] {
    if (!actions) {
      return []
    }

    if (Array.isArray(actions)) {
      return actions as Action[]
    }

    return []
  }
}

export async function withCRUDCache<T extends string>(
  prompt: () => Promise<T>,
  config: Partial<CrudMenuConfig<T>> = {},
) {
  const wrapper = new WithCRUD(prompt, config)
  return await wrapper.run()
}
