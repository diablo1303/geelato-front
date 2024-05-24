<script lang="ts">
export default {
  name: 'GlComponentStyleSetter'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import { type PropType, ref, watch } from 'vue'
import type { ComponentInstance, ComponentSetterMetaImpl } from '@geelato/gl-ui-schema'
import GlBackgroundImageSetter from './background/GlBackgroundImageSetter.vue'

const emits = defineEmits(['update'])
const props = defineProps({
  // style 对象
  // modelValue: {
  //   type: Object,
  //   default() {
  //     return {}
  //   }
  // },
  /**
   *  属性的配置展示模式
   */
  componentMeta: {
    type: Object as PropType<ComponentSetterMetaImpl>,
    required: true
  },
  componentInstance: {
    type: Object as PropType<ComponentInstance>
  }
})

if (!props.componentInstance.style) {
  props.componentInstance.style = {}
}

const styleMv = ref(props.componentInstance.style)
watch(styleMv, () => {
  emits('update', styleMv.value)
})

const activeKey = ref([1, 2, 3, 4])
</script>
<template>
  <div class="gl-component-style-setter">
    <a-collapse
      v-model:activeKey="activeKey"
      :bordered="false"
      @change="changeActiveKey"
    >
      <a-collapse-item :key="1" header="布局与大小">
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">宽度</div>
            <div class="gl-table-cell">
              <a-input v-model="styleMv.width" placeholder="例如：200px" allowClear></a-input>
            </div>
          </div>
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">高度</div>
            <div class="gl-table-cell">
              <a-input v-model="styleMv.height" placeholder="例如：200px" allowClear></a-input>
            </div>
          </div>
        </div>
      </a-collapse-item>
      <a-collapse-item :key="2" header="间距">
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">外边距</div>
            <div class="gl-table-cell">
              <a-input v-model="styleMv.margin" placeholder="例如：14px 28px" allowClear></a-input>
            </div>
          </div>
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">内边距</div>
            <div class="gl-table-cell">
              <a-input v-model="styleMv.padding" placeholder="例如：14px 28px" allowClear></a-input>
            </div>
          </div>
        </div>
      </a-collapse-item>
      <a-collapse-item :key="3" header="文本">
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">字号</div>
            <div class="gl-table-cell">
              <a-input
                v-model="styleMv.fontSize"
                placeholder="例如：14px或1.2em"
                allowClear
              ></a-input>
            </div>
          </div>
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">行高</div>
            <div class="gl-table-cell">
              <a-input v-model="styleMv.lineHeight" placeholder="例如：14px或1.2em"></a-input>
            </div>
          </div>
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">颜色</div>
            <div class="gl-table-cell">
              <div style="display: flex">
                <GlColor
                  :key="styleMv.color"
                  v-model="styleMv.color"
                  showText
                ></GlColor>
                <span>
                  <a-button @click="styleMv.color = ''" type="text">清除</a-button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-collapse-item>
      <a-collapse-item :key="4" header="背景">
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label">背景颜色</div>
            <div class="gl-table-cell">
              <div style="display: flex">
                <GlColor
                  :key="styleMv.backgroundColor"
                  v-model="styleMv.backgroundColor"
                  showText
                ></GlColor>
                <span>
                  <a-button @click="styleMv.backgroundColor = ''" type="text">清除</a-button>
                </span>
              </div>
            </div>
          </div>
          <!--          <div class="gl-table-row">-->
          <!--            <div class="gl-table-cell gl-label">背景图</div>-->
          <!--            <div class="gl-table-cell">-->
          <!--              <GlBackgroundImageSetter v-model="styleMv.backgroundImage" ></GlBackgroundImageSetter>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </a-collapse-item>
      <a-collapse-item :key="5" header="位置"> 待支持</a-collapse-item>
      <a-collapse-item :key="6" header="边框"> 待支持</a-collapse-item>
    </a-collapse>
  </div>
</template>

<style>
.gl-component-style-setter .gl-table-cell.gl-label {
  width: 7em;
}

.gl-component-style-setter .gl-table-cell {
  line-height: 32px;
}

.gl-component-style-setter .ant-collapse-header {
  padding: 6px !important;
}

.gl-component-style-setter .ant-collapse-header > div {
  line-height: 1.2em;
}

.gl-component-style-setter .ant-collapse-content-box {
  padding: 1px;
}
</style>
