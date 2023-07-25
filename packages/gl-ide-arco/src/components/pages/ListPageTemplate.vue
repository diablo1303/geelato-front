<script lang="ts">
export default {
  name: 'ListPageTemplate'
}
</script>
<script lang="ts" setup>

import {PropType, ref, watch} from "vue";
import type {CreatePageOptions} from "@/components/pages/CreatePagesFromEntityManager";
import {utils} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<CreatePageOptions>,
    required: true
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

mv.value.listPageId= utils.gid('page')
mv.value.listId = utils.gid('table')
// 生成的列
const columns = []
</script>

<template>
  <div>
    <a-form>
      <a-form-item>

      </a-form-item>
    </a-form>
    <a-select></a-select>
  </div>
  <div>


  </div>
  <div>
    {
      "id": "{{ listPageId }}",
      "componentName": "GlPage",
      "title": "{{ mv.listTitle }}",
      "props": {
        "pageMargin":"0",
        "pageType":"listPage"
      },
      "slots": {},
    "children": [
    {
    "componentName": "GlEntityTablePlus",
    "title": "{{ mv.listTitle }}",
    "group": "dataDisplay",
    "useBy": ["freePage"],
    "style": {},
    "id": "{{ tableId }}",
    "props": {
      "entityName": "{{ mv.entityName }}",
      "query": [{
        "id": "id",
        "name": "ID",
        "cop": "eq",
        "isAdvanceQuery": false,
        "colspan": 6,
        "component": {
          "componentName": "AInput",
          "props": {}
        }
      },
      }],
    "toolbar": {
    "leftColSpan": 12,
    "centerColSpan": 0,
    "rightColSpan": 12,
    "leftItems": [],
    "centerItems": [],
    "rightItems": []
    },
    "columns": [
    {
    "title": "ID",
    "dataIndex": "id",
    "slotName": "index"
    },
    {
    "title": "名称",
    "dataIndex": "name",
    "fixed": "right",
    "sortable": {
    "sortDirections": [
    "ascend",
    "descend"
    ]
    }
    },
    {
    "title": "编码",
    "dataIndex": "code"
    },
    {
    "title": "类型",
    "dataIndex": "type",
    "_renderScript": "ctx.record.type === '1' ? '平台级' : '应用级'"
    },
    {
    "title": "启用",
    "dataIndex": "delStatus",
    "slotName": "delStatus",
    "_renderScript": "ctx.record.delStatus === 1 ? '已启用' : '未启用'"
    },
    {
    "title": "描述",
    "dataIndex": "description"
    },
    {
    "title": "创建时间",
    "dataIndex": "createAt"
    },
    {
    "title": "操作",
    "dataIndex": "optional",
    "slotName": "optional"
    }
    ],
    "columnActions": []
    },
    "slots": {},
    "children": [],
    "actions": []
    }
    ],
    "actions": []
    }
  </div>
</template>

<style scoped>

</style>
