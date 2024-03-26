<template>
  <div class="gl-ide-sidebar-components gl-scrollbar-small">
    <a-tabs size="small" default-active-key="1">
      <a-tab-pane key="1" title="组件">
        <div v-for="componentMaterialGroup in componentMaterialGroups">
          <div
            class="gl-group-title"
            @click="componentMaterialGroup.opened = !componentMaterialGroup.opened"
            style="border-bottom: 1px solid #04559f; width: 90%"
          >
            <span :title="componentMaterialGroup.name" style="font-weight: 600; color: #7d7d7f">{{
              componentMaterialGroup.text
            }}</span>
            <span class="gl-tag">{{ componentMaterialGroup.items?.length }}</span>
          </div>
          <div class="gl-group-cards" v-if="componentMaterialGroup.opened">
            <template v-for="element in componentMaterialGroup.items">
              <ComponentsDndItem
                v-if="!element.meta.deprecated"
                :element="element"
                :templateInst="createTemplateInst(element)"
                :size="size"
              >
              </ComponentsDndItem>
            </template>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" title="模板">
        <div v-for="templateMaterialGroup in templateMaterialGroups">
          <div
            class="gl-group-title"
            @click="templateMaterialGroup.opened = !templateMaterialGroup.opened"
            style="border-bottom: 1px solid #04559f; width: 90%"
          >
            <span :title="templateMaterialGroup.name" style="font-weight: 600; color: #7d7d7f">{{
              templateMaterialGroup.text
            }}</span>
            <span class="gl-tag">{{ templateMaterialGroup.items?.length }}</span>
          </div>
          <div class="gl-group-cards" v-if="templateMaterialGroup.opened">
            <template v-for="element in templateMaterialGroup.items">
              <ComponentsDndItem
                v-if="!element.meta.deprecated"
                :element="element"
                :templateInst="createTemplateInst(element)"
                :size="size"
              >
              </ComponentsDndItem>
            </template>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" title="自定义区块"> Coming Soon ...</a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlComponentsSidebar'
}
</script>

<script setup lang="ts">
import { computed, type PropType, ref, defineComponent, watch, getCurrentInstance,VueElement } from 'vue'
import { useIdeStore } from '@geelato/gl-ide'
import { entityApi, EntityReader, fileApi, utils } from '@geelato/gl-ui'
import type {
  ComponentMaterial,
  ComponentInstance,
  ComponentMaterialGroup
} from '@geelato/gl-ui-schema'
import { useComponentMaterialStore } from '@geelato/gl-ui-schema-arco'
import ComponentsDndItem from '../../dnd/ComponentDndItem.vue'
import { SizeType } from '../../setters/Types'
import useComponentGroups from './componentGroups'

const props = defineProps({
  size: {
    type: String as PropType<SizeType>,
    default() {
      return SizeType.small
    }
  },
  componentGroups: {
    type: Array as PropType<Array<ComponentMaterialGroup>>,
    default() {
      // {name: 'other', text: '其它', opened: true}
      return [
        { name: 'layout', text: '布局', opened: true },
        { name: 'dataEntry', text: '表单', opened: true },
        { name: 'dataDisplay', text: '展示', opened: true },
        { name: 'chart', text: '图表', opened: true },
        { name: 'feedback', text: '反馈', opened: true },
        { name: 'navigation', text: '导航', opened: false }
      ]
    }
  },
  templateGroups: {
    type: Array as PropType<Array<ComponentMaterialGroup>>,
    default() {
      return [{ name: 'pageTemplate', text: '页面模板', opened: true }]
    }
  }
})

const fontSize = computed(() => {
  switch (props.size) {
    case SizeType.normal:
      return '3em'
    case SizeType.small:
      return '2em'
    case SizeType.mini:
      return '1em'
    default:
      return '2em'
  }
})

const loadedLibs = ref(false)
const fileUrls: string[] = []

// 创建 script 标签并添加到 DOM
const createScript = (src: string) => {
  const script = document.createElement('script')
  script.src = src
  script.type = 'module' // 设置为模块类型，因为我们是加载 ES 模块
  document.head.appendChild(script)
}

/**
 *  加载服务端的组件数据，并注册到useComponentMaterialStore中
 */
const loadLibs = () => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_ui_lib'
  entityReader.setFields('id,scriptFile,cssFile')
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    res.data?.forEach(async (record: any) => {
      const fileUrl = fileApi.getDownloadUrlById(record.scriptFile)
      console.log(fileUrl)
      const module = await import(fileUrl)
      console.log(module)
      // createScript(fileUrl)
      // fileUrls.push(fileUrl)
    })
    loadedLibs.value = true
  })
}
// loadLibs()
// watch(loadedLibs, (val, oldVal) => {
//   if (val === true) {
//     const app = getCurrentInstance()?.appContext.app;
//     const promises: Promise<any>[] = []
//     for (let i in fileUrls) {
//       // 使用 dynamic import 导入模块
//       import(fileUrls[i]).then((module) => {
//         console.log('module',module)
//         // 使用导入的模块
//         // 例如，如果第三方库导出了一个函数叫做 `useLibrary`，您可以这样调用它
//         // module.install(app)
//       }).catch((error) => {
//         // 处理导入错误
//         console.error('Failed to load the module:', error);
//       });
//     }
//
//     Promise.all(promises).then((downRes: any) => {
//       console.log('downRes', downRes)
//     })
//     loadedLibs.value = false
//   }
// })

const ideStore = useIdeStore()
// 所有的物料信息
const componentMaterialStore = useComponentMaterialStore()
componentMaterialStore.initRegisterComponentMetas()
const drag = ref(false)

const toUpperCase = (str: String) => {
  if (str.indexOf('_') !== -1) return str
  return str[0].toUpperCase() + str.substring(1)
}

const componentMaterialGroups = ref<Array<ComponentMaterialGroup>>([])
componentMaterialGroups.value = useComponentGroups(props.componentGroups, componentMaterialStore)

const templateMaterialGroups = ref<Array<ComponentMaterialGroup>>([])
templateMaterialGroups.value = useComponentGroups(props.templateGroups, componentMaterialStore)

/**
 * 基于物料创建实例
 * @param element 物料元素
 */
const createTemplateInst = (element: ComponentMaterial) => {
  const item = JSON.parse(JSON.stringify(element.instance))
  item.__isTemplateInst = true

  // 更改id
  function generateId(item: ComponentInstance) {
    // @ts-ignore
    let alias = ideStore.componentAlias[item.componentName]
    if (!alias) {
      console.warn('组件[', item.componentName, ']未设置别名，将直接生成无组件别名前缀的组件id。')
    }
    item.id = utils.gid(alias || 'id')
    // console.log('gl-runtime > gl-x > clone > generateId > new id:', item.id, 'for', item.componentName)
    if (item.children && item.children.length > 0) {
      for (let i in item.children) {
        item.children[i] = generateId(item.children[i])
        // console.log('gl-runtime > gl-x > clone > child item:', item.children[i])
      }
    }
    // console.log('GlIdePluginCoreComponents > createTemplateInst() > return', item)
    return item
  }

  let result = generateId(item)
  // console.log('gl-runtime > gl-x > clone > return', result)
  return result
}

// resetComponentMaterialGroups()
</script>