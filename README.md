# vue-finger

Vue plugin for  supporting touch gesture. Support Vue 2.0+.

Gesture supported:

+ Swipe
+ SwipeMove
+ Pinch
+ Tap
+ Double Tap


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


### Event

#### Swipe

`e.direction`

the direction of the swipe: "Left", "Right", "Up", "Down".

`e.deltaX`

the delta on X axis of the whole swipe.

`e.deltaY`

the delta on Y axis of the whole swipe.

#### SwipeMove

`e.direction`

the direction of the swipe: "Left", "Right", "Up", "Down".

`e.distenceX`

the cumulate distence on X axis of the swipe.

`e.distenceY`

the cumulate distence on Y axis of the swipe.

#### Pinch

`e.customScale`

the difference value between latest scale and last scale

#### Tap

no custom event props 

#### doubleTap

no custom event props 

