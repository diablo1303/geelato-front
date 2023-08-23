<script lang="ts">
export default {
  name: 'GlRoleMenuItem'
}
</script>
<script lang="ts" setup>

import {type Ref, ref, watch} from "vue";
import {useAppStore} from "@geelato/gl-ide";
import {entityApi, utils} from "@geelato/gl-ui";

interface RoleGrantedMenuItem {
  id: string,
  treeNodeId: string,
  roleId: string
}

// id key,pid,text name,iconType
interface AppMenuItem {
  key: string,
  pid: string,
  name: string,
  iconType: string,
  checked: boolean,
  children: AppMenuItem[]
}

interface Role {
  id: string,
  name: string,
  code: string
}

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const size = 0.5

const appStore = useAppStore()
const appId = appStore.currentApp.id
const currentRoleIndex = ref(-1)
const currentRole: Ref<any> = ref({})
const expandedKeys = ref([])
const appRoles: Ref<Role[]> = ref([])
// 应用菜单，加载之后不改变
const appMenuItems: Ref<AppMenuItem[]> = ref([])
// 当前选择角色已授权菜单信息
const currentRoleGrantedMenuItems: Ref<RoleGrantedMenuItem[]> = ref([])
// 当前正在配置的应和菜单，包括当前的应用菜单信息、授权的菜单信息
const currentRoleAppMenuItems: Ref<AppMenuItem[]> = ref([])

// 当前应用的角色
const loadAppRoles = (appId: string) => {
  // TODO 待增加应用id条件
  entityApi.query('platform_role', 'id,name,code',
      {'@p': '1,1000'}).then((res) => {
    appRoles.value = res.data
  })
}

const loadAppMenuItems = (appId: string) => {
  entityApi.query('platform_tree_node', 'id key,pid,text name,iconType',
      {'@p': '1,2000', 'treeId': appId}).then((res) => {
    appMenuItems.value = utils.listToTree(res.data, appId, {id: 'key'})
  })
}

/**
 * 设置菜单树中，相应节点为选中状态
 * @param menuItems
 * @param treeNodeId
 */
const setTreeItemChecked = (menuItems: AppMenuItem[], treeNodeId: string) => {
  // console.log('setTreeItemChecked:', menuItems, treeNodeId)
  menuItems?.forEach((item) => {
    if (item.key === treeNodeId) {

      item.checked = true
    }
    setTreeItemChecked(item.children, treeNodeId)
  })
}

/**
 *  加载某角色已授权的菜单
 */
const loadRoleGrantedMenuItem = (appId: string, roleId: string) => {
  entityApi.query('platform_role_r_tree_node', 'id,treeNodeId key,roleId',
      {'treeId': appId, roleId: roleId}).then((res) => {
    currentRoleGrantedMenuItems.value = res.data.data
    // 重置当前的角色菜单
    const appMenuItemsCopy: AppMenuItem[] = JSON.parse(JSON.stringify(appMenuItems.value))
    currentRoleGrantedMenuItems.value?.forEach((item: RoleGrantedMenuItem) => {
      setTreeItemChecked(appMenuItemsCopy, item.treeNodeId)
    })
    currentRoleAppMenuItems.value = appMenuItemsCopy
  })
}

const selectAllMenuItem = () => {
  const selectAll = (treeItems: any[]) => {
    if (!treeItems || treeItems.length === 0) {
      return
    }
    treeItems.forEach((record: any) => {
      record.checked = true
      selectAll(record.children)
    })
  }
  selectAll(currentRoleAppMenuItems.value)
}

const reverseSelectAllMenuItem = () => {
  const selectAll = (treeItems: any[]) => {
    if (!treeItems || treeItems.length === 0) {
      return
    }
    treeItems.forEach((record: any) => {
      record.checked = !record.checked
      selectAll(record.children)
    })
  }
  selectAll(currentRoleAppMenuItems.value)
}

const selectRole = (role: any, roleIndex: number) => {
  currentRoleIndex.value = roleIndex
  currentRole.value = role
  currentRoleAppMenuItems.value = []
  currentRoleGrantedMenuItems.value = []
  // console.log('role', role)
  loadRoleGrantedMenuItem(appId, currentRole.value.id)
}

const save = () => {
  console.log('currentRoleAppMenuItems', currentRoleAppMenuItems.value)

  // 待删除的授权信息 toDeleteItems
  const toDeleteItems: RoleGrantedMenuItem[] = []

  const findDeleteItem = (menuItems: AppMenuItem[], grantedItem: RoleGrantedMenuItem) => {
    let foundDeleteItem = undefined
    menuItems?.forEach((item: AppMenuItem) => {
      if (item.key === grantedItem.treeNodeId && !item.checked) {
        foundDeleteItem = grantedItem
      } else {
        foundDeleteItem = findDeleteItem(item.children, grantedItem)
      }
    })
    return foundDeleteItem
  }

  currentRoleGrantedMenuItems.value.forEach((grantedItem: RoleGrantedMenuItem) => {
    const item = findDeleteItem(currentRoleAppMenuItems.value, grantedItem)
    if (item) {
      toDeleteItems.push(grantedItem)
    }
  })


  // 待添加的授权信息 toAddItems
  const toAddItems: any[] = []
  const addItem = (menuItems: AppMenuItem[]) => {
    menuItems.forEach((item: any) => {
      if (item.checked) {
        const foundNotToAddItem = currentRoleGrantedMenuItems.value.find((grantedItem: RoleGrantedMenuItem) => {
          return grantedItem.treeNodeId === item.key
        })
        if (!foundNotToAddItem) {
          toAddItems.push({
            treeId: appId,
            roleId: currentRole.value.id,
            treeNodeId: item.key,
            title: item.name,
            treeNodeText: item.name,
            roleName: currentRole.value.name
          })
        }
      }
      if (item.children && item.children.length > 0) {
        addItem(item.children)
      }
    })
  }
  addItem(currentRoleAppMenuItems.value)

  console.log('toAddItems', toAddItems, 'toDeleteItems', toDeleteItems)

  // 需放到事务中
  toDeleteItems.forEach((item) => {
    entityApi.delete('platform_role_r_tree_node', {id: item.id})

  })

  toAddItems.forEach((item) => {
    entityApi.save('platform_role_r_tree_node', item)
  })

}


loadAppRoles(appId)
loadAppMenuItems(appId)
defineExpose({save})
</script>

<template>
  <div class="gl-role-menuitem">
    <div class="gl-layout-left">
      <a-list size="small">
        <template #header>
          <div class="gl-header">
            <span class="gl-title">{{ appStore.currentApp.name }}角色</span>
          </div>
        </template>
        <a-list-item v-for="(role,roleIndex) in appRoles" :class="{'gl-active':roleIndex===currentRoleIndex}"
                     @click="selectRole(role,roleIndex)">
          <span>{{ role.name }}</span>
        </a-list-item>
      </a-list>
    </div>
    <div class="gl-layout-right">
      <a-table :data="currentRoleAppMenuItems" v-model:expandedKeys="expandedKeys"
               stripe style="margin-left: 20px"
               :bordered="{wrapper: true, cell: true}"
               :pagination="false"
      >
        <template #columns>
          <a-table-column title="菜单项" data-index="name">
            <template #cell="{ record }">
              <GlIconfont :type="record.iconType"></GlIconfont>
              {{ record.name }}
            </template>
          </a-table-column>
          <a-table-column data-index="checked">
            <template #title>
              是否授权访问
              <a-button-group type="primary" size="mini" shape="round">
                <a-button @click="selectAllMenuItem">全选</a-button>
                <a-button @click="reverseSelectAllMenuItem">反选</a-button>
              </a-button-group>
            </template>
            <template #cell="{ record }">
              <a-switch v-model="record.checked"/>
            </template>
          </a-table-column>
          <a-table-column title="该页面相关的模型" data-index="entities">
            <template #cell="{ record }">

            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style>
.gl-role-menuitem {
  display: flex;
  min-height: 800px;
}

.gl-role-menuitem .gl-title {
  font-weight: 600;
}

.gl-role-menuitem .arco-list-header {
  background-color: #efefef;

}

.gl-role-menuitem .gl-layout-left {
  width: 250px;
}

.gl-role-menuitem .gl-layout-right {
  min-width: 800px;
  flex: auto;
}
</style>
