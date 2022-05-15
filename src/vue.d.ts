import "vue"
import { getCurrentInstance, inject, onBeforeUnmount } from "@vue/runtime-core"

declare module "vue" {
  export { getCurrentInstance, onBeforeUnmount, inject }
}

