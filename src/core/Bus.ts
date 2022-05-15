import type { App } from "@vue/runtime-core"
import type { getCurrentInstance } from "@vue/runtime-core"

import keyDefault from "../defaultKey"

export type Listener<DataType> = (event: {
  // eslint-disable-next-line functional/prefer-readonly-type
  data: DataType
  // eslint-disable-next-line functional/prefer-readonly-type
  target: ReturnType<typeof getCurrentInstance>
  // eslint-disable-next-line functional/prefer-readonly-type
  timestamp: number
}) => void

export default class Bus<
  TypeData extends {
    // eslint-disable-next-line functional/prefer-readonly-type
    [name: string]: unknown
  }
> {
  private readonly all = new Map<
    keyof TypeData,
    // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
    Listener<any>[]
  >()

  public install(app: App, key: symbol | string = keyDefault) {
    app.provide(key, this)
  }

  public on<EventName extends keyof TypeData>(
    name: EventName,
    listener: Listener<TypeData[EventName]>
  ): void {
    if (!this.all.has(name)) {
      this.all.set(name, [])
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, functional/immutable-data
    this.all.get(name)!.push(listener)
  }
  public off<EventName extends keyof TypeData>(
    name: EventName,
    listener?: Listener<TypeData[EventName]>
  ): void {
    if (!listener) {
      // eslint-disable-next-line functional/immutable-data
      this.all.get(name)?.splice(0)

      return
    }

    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
    this.all.get(name)?.splice(this.all.get(name)!.indexOf(listener) >>> 0, 1)
  }
  public emit<EventName extends keyof TypeData>(
    name: EventName,
    data: TypeData[EventName],
    target: ReturnType<typeof getCurrentInstance> = null
  ): void {
    this.all.get(name)?.forEach((cb) => {
      cb({
        data,
        target,
        timestamp: Date.now(),
      })
    })
  }
}

