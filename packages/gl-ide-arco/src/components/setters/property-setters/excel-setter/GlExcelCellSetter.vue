<script lang="ts">
export default {
  name: 'GlExcelCellSetter'
}
</script>
<script lang="ts" setup>
import { computed, type PropType, ref } from 'vue'
import type { ExcelCellMeta } from '@geelato/gl-ui-arco'
import { ExcelCellValueTypeOptions, ExcelCellValueComputeModeOptions } from '@geelato/gl-ui-arco'
import { utils } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<ExcelCellMeta>,
    default() {
      return {}
    }
  },
  modalTitle: String,
  // 隐藏，不需要配置，由外部组件进行默认值控制
  hidePlaceholder: Boolean,
  // 隐藏，不需要配置，由外部组件进行默认值控制
  hideList: Boolean
})
const mv = ref<ExcelCellMeta | Record<string, any>>(props.modelValue)
let isInitEmpty = utils.isEmpty(mv.value)

const visible = ref(false)

const openModal = () => {
  visible.value = true
  // 类型默认为字符串
  // mv.value.valueType = mv.value.valueType || ExcelCellValueType.STRING
}

const onOk = () => {
  visible.value = false
  isInitEmpty = utils.isEmpty(mv.value)
  emits('update:modelValue', mv.value)
}

const onCancel = () => {
  if (isInitEmpty) {
    mv.value = {}
  }
  visible.value = false
}
const clear = () => {
  mv.value = {}
  emits('update:modelValue', mv.value)
}

const configBtnType = computed(() => {
  return utils.isEmpty(mv.value) ? 'text' : 'primary'
})
</script>

<template>
  <div>
    <a-space size="small">
      <a-button :type="configBtnType" @click="openModal" title="设置" style="margin-right: 1em">
        <gl-iconfont type="gl-setting"></gl-iconfont>
      </a-button>
      <a-button type="text" @click="clear" status="danger" title="清除">
        <gl-iconfont type="gl-delete"></gl-iconfont>
      </a-button>
    </a-space>
    <a-modal draggable
      :visible="visible"
      :title="modalTitle || '配置导出单元格'"
      @ok="onOk"
      @cancel="onCancel"
    >
      <a-form ref="validateForm" :model="mv">
        <a-divider orientation="left">导出模板中占位符格式定义</a-divider>
        <a-form-item
          v-if="!hidePlaceholder"
          :rules="[{ required: true, message: '这是必填项' }]"
          field="placeholder"
          label="占位符"
        >
          <a-input v-model.trim="mv.placeholder" placeholder="如：${名称}" />
          <template #extra>
            <div>输入与模板占位符相同格式的字符串，如${名称}。</div>
          </template>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '这是必填项' }]"
          field="valueType"
          label="值类型"
        >
          <a-select v-model="mv.valueType" allow-search>
            <a-option
              v-for="(item, index) in ExcelCellValueTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value as string"
            />
          </a-select>
        </a-form-item>
        <a-form-item v-if="['VAR'].includes(mv.valueComputeMode)" field="isImage" label="是否图片">
          <a-switch v-model="mv.isImage">
            <template #checked> 是</template>
            <template #unchecked> 否</template>
          </a-switch>
        </a-form-item>
        <a-form-item
          v-if="mv.isImage"
          :rules="[{ required: mv.isImage, message: '这是必填项' }]"
          field="imageWidth"
          label="图片宽度"
        >
          <a-input-number v-model="mv.imageWidth" :min="0" :precision="2" :step="1">
            <template #suffix>cm</template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="mv.isImage"
          :rules="[{ required: mv.isImage, message: '这是必填项' }]"
          field="imageHeight"
          label="图片高度"
        >
          <a-input-number v-model="mv.imageHeight" :min="0" :precision="2" :step="1">
            <template #suffix>cm</template>
          </a-input-number>
        </a-form-item>
        <a-divider orientation="left">导出模板中占位符值来源及计算规则</a-divider>
        <a-form-item v-if="!hideList" field="isList" label="来源于列表">
          <a-switch v-model="mv.isList">
            <template #checked> 是</template>
            <template #unchecked> 否</template>
          </a-switch>
        </a-form-item>
        <a-form-item
          :rules="[{ required: true, message: '这是必填项' }]"
          field="valueComputeMode"
          label="取值规则"
        >
          <a-select v-model="mv.valueComputeMode" allow-search>
            <a-option
              v-for="(item, index) in ExcelCellValueComputeModeOptions"
              :key="index"
              :label="item.label"
              :value="item.value as string"
            />
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="['CONST'].includes(mv.valueComputeMode)"
          :rules="[{ required: ['CONST'].includes(mv.valueComputeMode), message: '这是必填项' }]"
          field="constValue"
          label="常量"
        >
          <a-input v-model="mv.constValue" />
        </a-form-item>
        <a-form-item
          v-if="['EXPRESSION'].includes(mv.valueComputeMode)"
          :rules="[
            { required: ['EXPRESSION'].includes(mv.valueComputeMode), message: '这是必填项' }
          ]"
          field="expression"
          label="表达式"
        >
          <a-textarea
            v-model="mv.expression"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </a-form-item>
        <a-form-item
          v-if="!hideList && mv.isList"
          :rules="[{ required: mv.isList, message: '这是必填项' }]"
          field="listVar"
          label="列表变量名"
        >
          <a-input v-model.trim="mv.listVar" />
        </a-form-item>
        <a-form-item
          v-if="!hideList && ['VAR', 'EXPRESSION'].includes(mv.valueComputeMode)"
          :rules="[{ required: true, message: '这是必填项' }]"
          field="var"
          label="变量名"
        >
          <a-input v-model.trim="mv.var" />
        </a-form-item>
        <a-divider orientation="left">数据导到模板之后，对导出文件的处理</a-divider>
        <a-form-item
          v-if="mv.isList || ['CONST'].includes(mv.valueComputeMode)"
          field="isMerge"
          label="合并单元格"
        >
          <a-switch v-model="mv.isMerge">
            <template #checked> 是</template>
            <template #unchecked> 否</template>
          </a-switch>
          <template #extra>
            <div>
              如果合并，则将上下左右相同值的单元格进行合并处理；否则不处理；只适用于导出Excel。
            </div>
          </template>
        </a-form-item>
        <a-form-item v-if="mv.isMerge === true" field="isUnique" label="合并唯一约束">
          <a-switch v-model="mv.isUnique">
            <template #checked> 是</template>
            <template #unchecked> 否</template>
          </a-switch>
          <template #extra>
            <div>
              选择是，如果有10行数据，该字段数据相同的区间是[第1行，第4行]，其他列可以合并的字段仅在此区间内的数据且相同时进行合并。
            </div>
          </template>
        </a-form-item>
        <a-form-item field="description" label="备注">
          <a-textarea
            v-model="mv.description"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped></style>
