# vue-bus3
A package project
[View docs](https://tachibana-shin.github.io/vue-bus3)

[![Build](https://github.com/tachibana-shin/vue-bus3/actions/workflows/docs.yml/badge.svg)](https://github.com/tachibana-shin/vue-bus3/actions/workflows/docs.yml)
[![NPM](https://badge.fury.io/js/vue-bus3.svg)](http://badge.fury.io/js/vue-bus3)

## Vs mitt
- automatically cancel all events listened to at the component before the component is destroyed
- memory saver and clear for javascript garbage collector
- composition api support 

## Installation
NPM / Yarn:
``` bash
yarn add vue-bus3
```

CDN:
``` html
<script src="https://unpkg.com/vue-bus3"></script>
```

## Example
main.ts
``` ts
// your example
import { createBus } from "vue-bus3";

const bus = createBus<{
  "hide-comment": void
}>

app.use(bus);
```

App.vue
``` ts
import { useBus } from "vue-bus3"

const bus = useBus()

bus.on("hide-comment", () => {
    console.log("hide-comment")
})

bus.emit("hide-comment")
```

### Declare event types

bus.d.ts
``` ts
import "vue-bus3"

declare module "vue-bus3" {
    interface TypeEventsGlobal {
        "hide-comment": void
    }
}
```
