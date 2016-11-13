# vue-finger

Vue plugin for  supporting touch gesture. Support Vue 2.0+.

Gesture supported:

+ Swipe




### Install

```
npm install vue-finger --save
```

### Usage

```
import vueFinger from "vue-finger"

Vue.use(vueFinger)

```

in your component

```
<template>
  <div  v-finger:swipe="this.bar">
      swipe!
  </div>
</template>


<script>
···
methods:{
    bar(e){
      console.log("swipe", e.direction)
    }
 },
···
</script>

```