<script lang="ts">
export default {
  name: 'GlPermissionsSetter'
}
</script>
<script lang="ts" setup>
import { inject, onUnmounted, type PropType, ref, watch } from 'vue'
import type { ComponentInstance, ComponentMeta } from '@geelato/gl-ui-schema'
import { EventNames, usePageStore } from '@geelato/gl-ide'
import { emitter, entityApi, EntityReader, EntitySaver } from '@geelato/gl-ui'

const emits = defineEmits(['change:permissionValue'])
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: Object as PropType<ComponentInstance>,
    required: true
  }
})

const pageStore = usePageStore()
// 获取页面的权限配置信息
const pageId = pageStore.currentPage?.id

const entityName = 'platform_permission'
const read = ref({ enable: props.componentInstance.perms?.r || 0, name: '', id: '' })

/**
 * 依据应用id、页面id、组件id加载权限数据
 */
const loadPermission = () => {
  const entityReader = new EntityReader()
  entityReader.entity = entityName
  entityReader.setFields('id,name')
  // entityReader.addParam('appId', 'eq', appId)
  entityReader.addParam('object', 'eq', pageId)
  entityReader.addParam('type', 'eq', 'ep')
  entityReader.addParam('code', 'eq', props.componentInstance.id)
  entityReader.pageSize = 1
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    if (res.data.length > 0) {
      read.value.id = res.data[0].id
      read.value.enable = 1
      read.value.name = res.data[0].name
    }
  })
}

// 如果是启用状态，在初始时才需要加载权限
if (read.value.enable) {
  loadPermission()
}

const savePermission = () => {
  if (!read.value.name) {
    read.value.name =
      props.componentInstance.props.label ||
      props.componentInstance.props?.base?.label ||
      props.componentInstance.id
  }
  const entitySaver = new EntitySaver(entityName)
  entitySaver.record = {
    id: read.value.id || undefined,
    name: read.value.name,
    object: pageId,
    type: 'ep',
    code: props.componentInstance.id,
    rule: 'r',
    description: props.componentInstance.componentName
  }
  entityApi.saveEntity(entitySaver).then((res: any) => {
    read.value.id = res.data
  })
}

/**
 *  有权限ID，且为不起用时，才需要删除
 */
const tryDeletePermission = () => {
  if (read.value.id && !read.value.enable) {
    entityApi.deleteById(entityName, read.value.id).then(() => {
      // 删除成功，需要重置当前的数据状态
      read.value.id = ''
      read.value.name = ''
    })
  }
}

watch(
  () => {
    return read.value.enable
  },
  (val) => {
    console.log(val)
    // 单个组件启用权限时，存一条记录到权限表
    // name：${inst.props.label||inst.id}，组件的标题或id
    // object：${pageId}，组件所在页面的Id
    // type:'ep'，固定值ep
    // code:${inst.id}，组件id
    // rule:'r' || 'nw'，一般为read，用于操作一些操作按钮，或表单的描些字段不可见。有时也需要控制在可见的基础上，有些组件不可修改nw（no write）。
    // description：${组件名}
    props.componentInstance.perms = { r: read.value.enable }
    if (read.value.enable) {
      savePermission()
    } else {
      // 切换到关闭时不更新权限，在整个页面点保存时，若是关闭状态且id存在，则保存，避免权限这边在关闭时保存，但页面配置信息未保存
      // 这样可能存在数据没及时删除的情况，允许延迟删除，不影响应用
    }
    emits('change:permissionValue', props.componentInstance.perms)
  }
)

emitter.on(EventNames.GlIdeToolbarPageSaved, tryDeletePermission)
onUnmounted(() => {
  emitter.off(EventNames.GlIdeToolbarPageSaved, tryDeletePermission)
})
</script>

<template>
  <div class="gl-permissions-setter">
    <a-card title="查看权限控制" :bordered="false">
      <a-form :model="read">
        <a-form-item label="启用权限">
          <div>
            <a-switch
              v-model="read.enable"
              checked-text="当前已启用查看权限控制"
              unchecked-text="当前未启用查看权限控制"
              :checked-value="1"
              :unchecked-value="0"
            ></a-switch>
            <a-alert type="normal" class="gl-normal">
              如果不开启权限控制，默认所有用户都可见。开启了查看权限控制之后，默认看不到该组件，只有给角色分配了该查看权限才可看到。
              用于控制查看、编辑、删除、导出等操作按钮、表单字段等是否可见。
            </a-alert>
          </div>
        </a-form-item>
        <a-form-item label="权限名称">
          <a-input
            v-model="read.name"
            placeholder="启用时，默认为组件标题或组件ID"
            :readonly="!read.enable"
            @change="savePermission"
          ></a-input>
        </a-form-item>
        <a-form-item label="服务端ID">
          <a-input v-model="read.id" placeholder="启用时，服务端保存的权限ID" readonly></a-input>
        </a-form-item>
      </a-form>
    </a-card>
    <!--    <a-card title="编辑权限控制" :bordered="false">-->
    <!--      <a-form>-->
    <!--        <a-form-item label="启用权限">-->
    <!--          <div>-->
    <!--            <a-switch-->
    <!--              checked-text="当前已启用编辑权限控制"-->
    <!--              unchecked-text="当前未启用编辑权限控制"-->
    <!--            ></a-switch>-->
    <!--            <a-alert type="normal" class="gl-normal">-->
    <!--              用于管制表单字段是否可修改。-->
    <!--            </a-alert>-->
    <!--          </div>-->
    <!--        </a-form-item>-->
    <!--        <a-form-item label="权限名称">-->
    <!--          <a-input placeholder="启用时，默认为组件标题或组件ID"></a-input>-->
    <!--        </a-form-item>-->
    <!--      </a-form>-->
    <!--    </a-card>-->
  </div>
</template>

<style scoped>
.gl-permissions-setter .gl-normal {
  margin: 8px 0;
}
</style>
