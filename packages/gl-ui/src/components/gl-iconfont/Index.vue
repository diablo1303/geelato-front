<template>
  <span class="GlIconfont">
    <GlIconfontBase v-if="type" :type="type" :spin="spin" :rotate="rotate" :twoToneColor="twoToneColor"
                    :style="iconStyle"></GlIconfontBase>
    <span v-if="text" class="GlIconfontText">{{ text }}</span>
  </span>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {createFromIconfontCN} from '@ant-design/icons-vue';

const GlIconfontBase = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_2457479_dm72t8c3b6v.js', // 在 iconfont.cn 上生成
});
export default defineComponent({
  name: "GlIconfont",
  components: {GlIconfontBase},
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
</style>
