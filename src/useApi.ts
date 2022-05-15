import { inject } from "vue"

import Bus from "./core/Bus"
import BusComponent from "./core/BusComponent"
import defaultKey from "./defaultKey"

export function createBus<
  TypeData extends {
    // eslint-disable-next-line functional/prefer-readonly-type
    [name: string]: unknown
  }
>() {
  const bus = new Bus<TypeData>()

  return bus
}

export function useBus(key: symbol | string = defaultKey) {
  const bus = inject(key)

  if (!bus) {
    console.warn("[vue-bus3]: `useBus` required call in setup function.")
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new BusComponent(bus as any)
}
