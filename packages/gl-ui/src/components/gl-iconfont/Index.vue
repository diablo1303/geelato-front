<template>
  <span class="gl-icon-font">
    <svg aria-hidden="true" :style="iconStyle">
      <use :xlink:href="'#'+type"></use>
    </svg>
    <span v-if="text">{{ text }}</span>
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GlIconfont",
  // components: {GlIconfontBase},
  props: {
    type: String,
    text: String,
    // 是否有旋转动画
    spin: Boolean,
    // 图标旋转角度（IE9 无效）
    rotate: Number,
    // 仅适用双色图标。设置双色图标的主要颜色
    twoToneColor: String,
    // 样式
    iconStyle: Object
  },
  created() {

  },
  mounted() {
    // 动态import，解决build时，window is not defined的问题
    // @ts-ignore
    import('../../assets/iconfont.js').then(module => {
      // use code
    })
  }
})
</script>

<style>
.gl-icon-font {
  display: inline-block;
}

.gl-icon-font > svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.gl-icon-font > span {

}
</style>
