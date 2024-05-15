<script lang="ts">
export default {
  name: 'GlPermissionsSetter'
}
</script>
<script lang="ts" setup>
/**
 *  在启用权限时，在权限表中保存该权限元素
 *  在后续的操作过程中，只会更新权限的名称，会一直延用该权限表中的id
 */
import { type PropType, ref, watch } from 'vue'
import type { ComponentInstance, ComponentMeta } from '@geelato/gl-ui-schema'
import { useAppStore, usePageStore } from '@geelato/gl-ide'
import { entityApi, EntityReader, EntitySaver, useGlobal } from '@geelato/gl-ui'

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
const global = useGlobal()
const appStore = useAppStore()
const pageStore = usePageStore()
const appId = appStore.currentApp?.id
// 获取页面的权限配置信息
const pageId = pageStore.currentPage?.id

const entityName = 'platform_permission'
props.componentInstance.perms = props.componentInstance.perms || { r: 0 }
props.componentInstance.__perms = props.componentInstance.__perms || {
  r: { id: '', name: '', enabled: 0 },
  w: { id: '', name: '', enabled: 0 }
}
const readPerms = ref(props.componentInstance.__perms.r)

watch(
  readPerms,
  (val) => {
    // 存一条记录到权限表
    // name：${inst.props.label||inst.id}，组件的标题或id
    // object：${pageId}，组件所在页面的Id
    // type:'ep'，固定值ep
    // code:${inst.id}，组件id
    // rule:'r' || 'w'，一般为read，用于操作一些操作按钮，或表单的描些字段不可见。有时也需要控制在可见的基础上，有些组件不可修改nw（no write）。
    // description：${组件名}
    props.componentInstance.perms!.r = readPerms.value.enabled
    props.componentInstance.__perms!.r = readPerms.value
    emits('change:permissionValue', props.componentInstance.perms)
  },
  { deep: true }
)

/**
 * 依据应用id、页面id、组件id加载权限数据
 * @param permType 'r'或'w'
 */
const loadPermission = (permType?: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = entityName
  entityReader.setFields('id,name')
  entityReader.addParam('appId', 'eq', appId)
  entityReader.addParam('object', 'eq', pageId)
  entityReader.addParam('type', 'eq', 'ep')
  entityReader.addParam('code', 'eq', props.componentInstance.id)
  entityReader.addParam('rule', 'eq', permType || 'r')
  if(readPerms.value.id){
    entityReader.addParam('id', 'eq', readPerms.value.id)
  }
  entityReader.pageSize = 1
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    console.log('res', res)
    if (res.data.length > 0) {
      readPerms.value.id = res.data[0].id
      // 以服务端权限表中已保存的权限名称为准，角色权限配置时，取的也是该权限名称
      readPerms.value.name = res.data[0].name
    }
  })
}

const savePermission = (...args:any) => {
  console.log(args)
  let isNew = !readPerms.value.id
  let title = isNew ? '权限表插入成功' : '权限表更新成功'
  if (!readPerms.value.name) {
    readPerms.value.name =
      props.componentInstance.props.label ||
      props.componentInstance.props?.base?.label ||
      props.componentInstance.id
  }
  const entitySaver = new EntitySaver(entityName)
  entitySaver.record = {
    id: readPerms.value.id || undefined,
    name: readPerms.value.name,
    appId: appStore.currentApp.id,
    object: pageId,
    type: 'ep',
    code: props.componentInstance.id,
    rule: 'r',
    description: props.componentInstance.componentName
  }
  entityApi.saveEntity(entitySaver).then((res: any) => {
    readPerms.value.id = res.data
    global.$notification.success({
      duration: 8000,
      title: title,
      content: '需请进一步【保存】当前页面，并到左边【权限】中配置授权给相关的角色。',
      closable:true
    })
  })
}

const changeEnabled = () => {
  // 如果是新增，则需要保存
  let isNew = !readPerms.value.id
  if (isNew) {
    savePermission()
  }else{
    global.$notification.info({
      duration: 8000,
      content: '需请进一步【保存】当前页面，并到左边【权限】中配置授权给相关的角色。',
      closable:true
    })
  }
}

// 在初始时,如果无权限id
// 查看是否有之前启用保存了记录，但页面没有保存该id的权限数据
// 若有权限id，则基于权限id查询，获取权限名称，确保页面未保存关闭时，页面中的权限名称未更新，在此仍能获取最新的名称
loadPermission('r')
</script>

<template>
  <div class="gl-permissions-setter">
    <template v-if="pageId">
      <a-card title="查看权限控制" :bordered="false">
        <a-form :model="readPerms">
          <a-form-item label="启用权限">
            <div>
              <a-switch
                  v-model="readPerms.enabled"
                  checked-text="当前已启用查看权限控制"
                  unchecked-text="当前未启用查看权限控制"
                  :checked-value="1"
                  :unchecked-value="0"
                  @change="changeEnabled"
              ></a-switch>
              <a-alert type="normal" class="gl-normal">
                如果不开启权限控制，默认所有用户都可见。开启了查看权限控制之后，默认看不到该组件，只有给角色分配了该查看权限才可看到。
                用于控制查看、编辑、删除、导出等操作按钮、表单字段等是否可见。
              </a-alert>
            </div>
          </a-form-item>
          <a-form-item label="权限名称">
            <a-input
                v-model="readPerms.name"
                placeholder="启用时，默认为组件标题或组件ID"
                :readsonly="!readPerms.enabled"
                @change="savePermission"
            ></a-input>
          </a-form-item>
          <a-form-item label="服务端ID">
            <a-input
                v-model="readPerms.id"
                placeholder="启用时，服务端保存的权限ID"
                readonly
            />
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
    </template>
    <template v-else>
      <a-alert type="info" class="gl-normal">
        需先保存当前页面，再配置权限。
      </a-alert>
    </template>
  </div>
</template>

<style scoped>
.gl-permissions-setter .gl-normal {
  margin: 8px 0;
}
</style>
