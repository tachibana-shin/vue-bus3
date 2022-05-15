import { getCurrentInstance } from "vue"
import { onBeforeUnmount } from "vue"

import { TypeEventsGlobal } from "../TypeEventsGlobal"

import Bus, { Listener } from "./Bus"

export default class BusComponent<
  TypeDataCurrent extends {
    // eslint-disable-next-line functional/prefer-readonly-type
    [name: string]: unknown
  },
  TypeData extends TypeEventsGlobal & TypeDataCurrent
> {
  private readonly currentInstance = getCurrentInstance()
  // eslint-disable-next-line @typescript-eslint/ban-types, functional/prefer-readonly-type
  private readonly fns = new Map<keyof TypeData, Function[]>()
  constructor(private readonly bus: Bus<TypeData>) {
    onBeforeUnmount(() => {
      this.fns.forEach((cbs, name) => {
        cbs.forEach((cb) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.bus.off(name, cb as any)
        })
      })
    })
  }

  public on<EventName extends keyof TypeData>(
    name: EventName,
    listener: Listener<TypeData[EventName]>
  ): () => void {
    this.bus.on(name, listener)
    if (this.fns.has(name)) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      this.fns.get(name)!.push(listener)
    } else {
      this.fns.set(name, [listener])
    }

    return () => this.off(name, listener)
  }
  public off<EventName extends keyof TypeData>(
    name: EventName,
    listener?: Listener<TypeData[EventName]>
  ): void {
    this.bus.off(name, listener)
    if (listener) {
      // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-non-null-assertion
      this.fns.get(name)?.splice(this.fns.get(name)!.indexOf(listener) >>> 0, 1)
    } else {
      // eslint-disable-next-line functional/immutable-data
      this.fns.get(name)?.splice(0)
    }
  }
  public once<EventName extends keyof TypeData>(
    name: EventName,
    listener: Listener<TypeData[EventName]>
  ): () => void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cb = (data: any) => {
      listener(data)
      this.off(name, cb)
    }

    this.on(name, cb)

    return () => this.off(name, cb)
  }
  public emit<EventName extends keyof TypeData>(
    name: EventName,
    data: TypeData[EventName]
  ): void {
    this.bus.emit(name, data, this.currentInstance)
  }
}

