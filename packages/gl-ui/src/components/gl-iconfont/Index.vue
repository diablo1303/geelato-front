<template>
  <span class="GlIconfont">
<!--    <GlIconfontBase v-if="type" :type="type" :spin="spin" :rotate="rotate" :twoToneColor="twoToneColor"-->
<!--                    :style="iconStyle"></GlIconfontBase>-->
    <svg class="gl-icon" aria-hidden="true" :style="iconStyle">
      <use :xlink:href="'#'+type"></use>
    </svg>
    <span v-if="text" class="GlIconfontText">{{ text }}</span>
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
// import "../../assets/iconfont.js"
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
  mounted () {
    // 动态import，解决build时，window is not defined的问题
    // @ts-ignore
    import('../../assets/iconfont.js').then(module => {
      // use code
    })
  }
})
</script>

<style>
.GlIconfontText {
  padding-left: 4px;
}

.GlIconfont svg {
  /*margin-bottom: 0.45em;*/
}

.ant-tabs-tab .GlIconfont .anticon {
  margin-right: 0;
}

.gl-icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
