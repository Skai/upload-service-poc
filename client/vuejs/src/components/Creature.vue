<template>
  <div class="creature">
    <div class="click-anim">
      <figure class="hungry"
        v-bind:class="{ 'on-over': hasOver }"
        @dragenter="dragenter"
        @dragleave="dragleave"
        @dragover="dragover"
        @drop="drop">
        <div class="eye"></div>
        <div class="eye"></div>
        <div class="mouth teeth"></div>
      </figure>
    </div>
    <div class="shadow"></div>
  </div>
</template>

<script>
import { UploadService } from './../services'

export default {
  name: 'creature',

  data () {
    return {
      hasOver: false
    }
  },

  methods: {
    dragenter ($evt) {
      $evt.preventDefault()
      this.hasOver = true
    },

    dragleave ($evt) {
      this.hasOver = false
    },

    dragover ($evt) {
      $evt.preventDefault()
      this.hasOver = true
    },

    drop ($evt) {
      $evt.preventDefault()
      this.hasOver = false

      for (let file of $evt.dataTransfer.files) {
        UploadService.newFile(file)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// CSS Creature by Bennett Feely
// See https://codepen.io/bennettfeely/pen/tfbCo

* {
  box-sizing: border-box;
}

.hungry {
  background: #ff9800;

  &.on-over {
    background: #ff5722;
  }
}

.creature {
  width: 270px;
  margin: 0 auto;
  padding-bottom: 3em;
  position: relative;

  &:hover {
    &:after {
      display: block;
      position: absolute;
      bottom: 1em;
      text-align: center;
      width: 100%;
      content: '(drag files into my mouth)';
      color: #999;
    }
  }
}

.click-anim {
  transition: .3s cubic-bezier(.15,.60,.30,1.9);
  transform-origin: center bottom;
}

figure {
  display: inline-block;
  width: 200px;
  height: 180px;
  padding: 40px;
  box-shadow: inset -10px -30px rgba(0,0,0,.06);
  -moz-border-radius: 100px;
  -webkit-border-radius: 100px;
  border-radius: 50%;
  animation: bobble 5s ease-in-out infinite;
  transform-origin: center bottom;
  transition: padding .3s, bottom .3s;
  text-align: center;
}
@keyframes bobble { 33%{ transform:rotate(5deg); } 66%{ transform:rotate(-5deg); } }

.eye {
  display: inline-block;
  width: 10px;
  height: 15px;
  margin: 0 5px 5px;
  background: rgba(0,0,0,.9);
  border-radius: 50%;
  animation: blink 4s ease-in-out infinite;
}
@keyframes blink { 90% { transform:none; } 95% { transform:rotateX(90deg); } }

.mouth {
  display: block;
  width: 100%;
  height: 18px;
  margin: 5px auto 0;
  background: rgba(0,0,0,.9);
  border-radius: 12px 12px 85% 85%;
  transition: border-radius .5s, height .5s cubic-bezier(.15,.60,.30,1.9);
  overflow: hidden;
  line-height: 0;
  transform-origin: center top;
}

.hungry {
  &.on-over {
    .mouth {
      border-radius: 30px 30px 50% 50%;
      height: 90px;
      transition: height 0.2s ease-in;
    }
  }
}

// Disable standard animation, because dragleave triggered by child element
// .hungry {
//   &:not(.on-over),
//   &:not(:hover) {
//     .mouth {
//       animation: hungry .6s infinite;
//       border-radius: 600px 600px 800px 800px;
//       // height: 26px;
//     }
//   }
// }
// @keyframes hungry { 40%{ height: 24px; } }

.teeth:after,
.teeth:before,
.tooth:after {
    display: inline-block;
    content: '';
    margin: 0 2px;
    width: 15px;
    height: 15px;
    background: #eee;
}

.tooth:after {
  margin-left: 17px;
  margin-right: 17px;
}

.shadow {
  height: 20px;
  background: rgba(0,0,0,.1);
  width: 60%;
  border-radius: 100%;
  margin: -30px 0 0 30%;
  transition: .3s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-30px);
  }

  60% {
    transform: translateY(-15px);
  }
}

.bounce {
  transform-origin: center bottom;
  animation: bounce 1s infinite;
}
</style>
