<script lang="ts">
export default {
  name: 'GlRoleMenuItem'
}
</script>
<script lang="ts" setup>
import {type Ref, ref, watch} from 'vue'
import {useAppStore} from '@geelato/gl-ide'
import {applicationApi, entityApi, securityApi, useGlobal, utils} from '@geelato/gl-ui'
import type {QueryRolePermissionForm} from '@geelato/gl-ui'

interface RoleGrantedMenuItem {
  id: string
  treeNodeId: string
  roleId: string
}

// id key,pid,text name,iconType
interface AppMenuItem {
  key: string
  pid: string
  name: string
  iconType: string
  checked: boolean
  children: AppMenuItem[]
}

interface Role {
  id: string
  name: string
  code: string
  weight: number
}

interface Permission {
  id: string;
  name: string;
  code: string;
  type: string;
  object: string;
  rule: string;
  description: string;
  checked: boolean;
  treeId: string;
}

interface TreePermission {
  data: Permission[];
  count: number;
  checkedAll: boolean;
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

const global = useGlobal()
const appStore = useAppStore()
const appId = appStore.currentApp.id
const currentRoleIndex = ref(-1)
const currentRole: Ref<any> = ref({})
const expandedKeys = ref([])
const appRoles: Ref<Role[]> = ref([])
// 应用菜单，加载之后不改变
const appTreeNodes: Ref<AppMenuItem[]> = ref([])
const appMenuItems: Ref<AppMenuItem[]> = ref([])
// 当前选择角色已授权菜单信息
const currentRoleGrantedMenuItems: Ref<RoleGrantedMenuItem[]> = ref([])
// 树结构数据，当前正在配置的应和菜单，包括当前的应用菜单信息、授权的菜单信息
const currentRoleAppMenuItems: Ref<AppMenuItem[]> = ref([])
const currentMenuPermissions = ref<Record<string, TreePermission>>({});

// 当前应用的角色
const loadAppRoles = async (appId: string) => {
  try {
    const {data} = await securityApi.pageQueryOfRole({
      'appId': appId, current: 1, pageSize: 10000, order: 'weight|desc'
    });
    // @ts-ignore
    data.items.sort((a, b) => a.type >= b.type ? 1 : -1);
    appRoles.value = (data.items || []) as unknown as Role[];
  } catch (err) {
    console.log(err);
  }
}

const loadAppMenuItems = (appId: string) => {
  entityApi
      .query('platform_tree_node', 'id key,pid,text name,iconType,seqNo', {'@p': '1,5000', treeId: appId},false,false,undefined,'seqNo|+')
      .then((res) => {
        // @ts-ignore
        res.data.sort((a, b) => a.seqNo - b.seqNo);
        appTreeNodes.value = res.data || [];
        appMenuItems.value = utils.listToTree(res.data, appId, {id: 'key'})
      })
}

const loadAppPagePermissions = async (appId: string) => {
  try {
    const {data} = await applicationApi.queryPermissionByPage({'appId': appId, type: 'ep'});
    if (data && (data as unknown as Permission[]).length > 0) {
      const treeIds: string[] = [];
      for (const item of (data as unknown as Permission[])) {
        if (!treeIds.includes(item.treeId)) {
          treeIds.push(item.treeId);
        }
      }
      for (const treeId of treeIds) {
        const permissions: Permission[] = [];
        for (const item of (data as unknown as Permission[])) {
          if (treeId === item.treeId) {
            item.checked = false;
            permissions.push(item);
          }
        }
        currentMenuPermissions.value[treeId] = {data: permissions, count: permissions.length, checkedAll: false};
      }
    }
  } catch (e) {
    console.log(e)
  }
}

const loadAppPageRolePermission = async (appId: string, roleId: string) => {
  if (roleId) {
    try {
      const {data} = await applicationApi.queryRolePermissionByPage({'appId': appId, type: 'ep', 'roleId': roleId});
      for (const key in currentMenuPermissions.value) {
        let checkedAll = true;
        for (const item of currentMenuPermissions.value[key].data) {
          item.checked = false;
          if (data && data.length > 0) {
            for (const permission of data) {
              if (item.id === permission.permissionId && permission.roleId === roleId) {
                item.checked = true;
                break;
              }
            }
          }
          if (item.checked === false) checkedAll = false;
        }
        currentMenuPermissions.value[key].checkedAll = checkedAll;
      }
    } catch (e) {
      console.log(e)
    }
  }
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
  if (roleId) {
    entityApi
        .query('platform_role_r_tree_node', 'id,treeNodeId,roleId', {
          treeId: appId,
          roleId: roleId
        })
        .then((res) => {
          // 从服务端获取已有权限
          currentRoleGrantedMenuItems.value = res.data
          console.log('从服务端获取已有权限', res.data)
          // 重置当前的角色菜单
          const appMenuItemsCopy: AppMenuItem[] = JSON.parse(JSON.stringify(appMenuItems.value))

          currentRoleGrantedMenuItems.value?.forEach((item: RoleGrantedMenuItem) => {
            setTreeItemChecked(appMenuItemsCopy, item.treeNodeId)
          })
          currentRoleAppMenuItems.value = appMenuItemsCopy
        })
  }
}

const selectAllMenuItem = () => {
  const selectAll = (treeItems: any[], ids: string[]) => {
    if (!treeItems || treeItems.length === 0) {
      return
    }
    treeItems.forEach((record: any) => {
      if (!record.checked && !ids.includes(record.key)) ids.push(record.key);
      record.checked = true
      selectAll(record.children, ids)
    })
  }
  const treeNodeIds: string[] = [];
  selectAll(currentRoleAppMenuItems.value, treeNodeIds);
  if (treeNodeIds.length > 0) {
    securityApi.insertRoleTreeNode({
      appId: appId, treeId: appId, roleId: currentRole.value.id, treeNodeId: treeNodeIds.join(','),
    })
  }
}

const reverseSelectAllMenuItem = () => {
  const selectAll = (treeItems: any[], tIds: string[], fIds: string[]) => {
    if (!treeItems || treeItems.length === 0) {
      return
    }
    treeItems.forEach((record: any) => {
      if (record.checked && !tIds.includes(record.key)) tIds.push(record.key);
      if (!record.checked && !fIds.includes(record.key)) fIds.push(record.key);
      record.checked = !record.checked
      selectAll(record.children, tIds, fIds);
    })
  }
  const tIds: string[] = [];
  const fIds: string[] = [];
  selectAll(currentRoleAppMenuItems.value, tIds, fIds);
  if (tIds.length > 0) {
    securityApi.deleteRoleTreeNode({
      appId: appId, treeId: appId, roleId: currentRole.value.id, treeNodeId: tIds.join(','),
    })
  }
  if (fIds.length > 0) {
    securityApi.insertRoleTreeNode({
      appId: appId, treeId: appId, roleId: currentRole.value.id, treeNodeId: fIds.join(','),
    })
  }
}

const selectRole = (role: any, roleIndex: number) => {
  currentRoleIndex.value = roleIndex
  currentRole.value = role
  currentRoleAppMenuItems.value = []
  currentRoleGrantedMenuItems.value = []
  loadRoleGrantedMenuItem(appId, currentRole.value.id)
  loadAppPageRolePermission(appId, currentRole.value.id)
}

const save = () => {
  // 待删除的授权信息 toDeleteItems
  const toDeleteItems: RoleGrantedMenuItem[] = []

  // 当前角色可配置授权的菜单
  const currentRoleAppMenuItemMap: Record<string, any> = {}
  utils.treeToMap(currentRoleAppMenuItems.value, 'key', currentRoleAppMenuItemMap)
  currentRoleGrantedMenuItems.value.forEach((grantedItem: RoleGrantedMenuItem) => {
    const appMenuItem = currentRoleAppMenuItemMap[grantedItem.treeNodeId]
    // 已有的授权哪些已取消
    if (appMenuItem && !appMenuItem.checked) {
      toDeleteItems.push(grantedItem)
    }
  })

  // 待添加的授权信息 toAddItems
  const toAddItems: any[] = []
  const genAddItems = () => {
    Object.keys(currentRoleAppMenuItemMap).forEach((key: string) => {
      const item = currentRoleAppMenuItemMap[key]
      if (item.checked) {
        const foundNotToAddItem = currentRoleGrantedMenuItems.value.find(
            (grantedItem: RoleGrantedMenuItem) => {
              return grantedItem.treeNodeId === item.key
            }
        )
        if (!foundNotToAddItem) {
          toAddItems.push({
            treeId: appId,
            'appId': appId,
            roleId: currentRole.value.id,
            treeNodeId: item.key,
            title: item.name,
            treeNodeText: item.name,
            roleName: currentRole.value.name
          })
        }
      }
    })
  }
  genAddItems()

  console.log('toAddItems', toAddItems, 'toDeleteItems', toDeleteItems)

  let promises: Promise<any>[] = []
  // TODO 需放到事务中
  toDeleteItems.forEach((item) => {
    const promise = entityApi.delete('platform_role_r_tree_node', {id: item.id})
    promises.push(promise)
  })

  toAddItems.forEach((item) => {
    const promise = entityApi.save('platform_role_r_tree_node', item)
    promises.push(promise)
  })

  Promise.all(promises).then((values) => {
    // 保存之后需刷新
    reset()
  })
}

const loadChecked = (record: TreePermission) => {
  let isChecked = true;
  for (const item of record.data) {
    if (!item.checked) {
      isChecked = false;
      break;
    }
  }
  record.checkedAll = isChecked;
}

const permissionCheckedChange = async (item: Permission, record: TreePermission) => {
  try {
    await securityApi.switchRolePermission({
      roleId: currentRole.value.id, permissionId: item.id
    } as unknown as QueryRolePermissionForm);
    global.$message.success(item.checked ? '授权成功！' : '取消授权成功！');
  } catch (e) {
    item.checked = !item.checked;
    console.log(e)
  } finally {
    loadChecked(record);
  }
}

const permissionCheckedSubmit = async (record: TreePermission) => {
  const checkedIds: string[] = [];
  const unCheckedIds: string[] = [];
  for (const item of record.data) {
    if (item.checked) {
      checkedIds.push(item.id);
    } else {
      unCheckedIds.push(item.id);
    }
  }
  try {
    await securityApi.switchRolePermission({
      roleId: currentRole.value.id,
      // 有没有选中的，即 全部授权，反之 即 全部取消
      permissionId: unCheckedIds.length > 0 ? unCheckedIds.join(',') : checkedIds.join(','),
    } as unknown as QueryRolePermissionForm);
    global.$message.success(unCheckedIds.length > 0 ? '全部授权成功！' : '全部取消授权成功！');
    for (const item of record.data) {
      item.checked = unCheckedIds.length > 0;
    }
  } catch (e) {
    console.log(e)
  } finally {
    loadChecked(record);
  }
}

const getTreePermission = (treeId: string) => {
  for (const key in currentMenuPermissions.value) {
    if (treeId === key) {
      return currentMenuPermissions.value[key];
    }
  }
  return {data: [], count: 0, checkedAll: false};
}

const getParentTreeNodeIds = (pid: string, ids: string[]) => {
  if (pid !== appId) {
    const parent = appTreeNodes.value.find((item) => item.key === pid);
    if (parent) {
      ids.push(parent?.key);
      getParentTreeNodeIds(parent?.pid, ids);
    }
  }
}

const getChildrenTreeNodeIds = (pid: string, ids: string[]) => {
  const parent = appTreeNodes.value.filter((item) => item.pid === pid);
  if (parent && parent.length > 0) {
    for (const item of parent) {
      ids.push(item?.key);
      getChildrenTreeNodeIds(item?.key, ids);
    }
  }
}

const cancelAppMenuItems = (record: AppMenuItem) => {
  if (record.children && record.children.length > 0) {
    for (const item of record.children) {
      item.checked = false;
    }
  }
}

const checkedAppMenuItems = (records: AppMenuItem[], ids: string[]) => {
  records?.forEach((item) => {
    if (ids.includes(item.key)) {
      item.checked = true;
    }
    checkedAppMenuItems(item.children, ids)
  })
}

const switchBeforeChange = async (record: AppMenuItem) => {
  let isSuccess = false;
  try {
    const treeNodeIds: string[] = [record.key];
    if (record.checked) {// 取消授权，子节点也要取消授权
      getChildrenTreeNodeIds(record.key, treeNodeIds);
      securityApi.deleteRoleTreeNode({
        appId: appId, treeId: appId, roleId: currentRole.value.id, treeNodeId: treeNodeIds.join(','),
      })
      cancelAppMenuItems(record);
    } else {// 授权，父节点也要授权
      getParentTreeNodeIds(record.pid, treeNodeIds);
      securityApi.insertRoleTreeNode({
        appId: appId, treeId: appId, roleId: currentRole.value.id, treeNodeId: treeNodeIds.join(','),
      })
      checkedAppMenuItems(currentRoleAppMenuItems.value, treeNodeIds);
    }
    isSuccess = true;
  } catch (err) {
    console.log(err);
  }

  return isSuccess;
}

const refreshClick = () => {
  loadAppMenuItems(appId)
  loadAppPagePermissions(appId);
  loadRoleGrantedMenuItem(appId, currentRole.value.id)
  loadAppPageRolePermission(appId, currentRole.value.id)
}

const reset = () => {
  loadAppRoles(appId)
  loadAppMenuItems(appId)
  loadAppPagePermissions(appId);
  loadRoleGrantedMenuItem(appId, currentRole.value.id)
  loadAppPageRolePermission(appId, currentRole.value.id)
}

reset()

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
        <a-list-item
            v-for="(role, roleIndex) in appRoles"
            :class="{ 'gl-active': roleIndex === currentRoleIndex }"
            @click="selectRole(role, roleIndex)"
        >
          <span>{{ `${role.weight} ${role.name}` }}</span>
        </a-list-item>
      </a-list>
    </div>
    <div class="gl-layout-right">
      <a-tabs>
        <template #extra>
          <a-button type="outline" @click="refreshClick">
            <template #icon>
              <gl-iconfont type="gl-refresh"/>
            </template>
            刷新
          </a-button>
        </template>
        <a-tab-pane key="1">
          <template #title>
            <gl-iconfont type="gl-calendar"/>
            菜单页面权限
          </template>
          <a-table
              :data="currentRoleAppMenuItems"
              v-model:expandedKeys="expandedKeys"
              stripe
              style="margin-left: 20px"
              :bordered="{ wrapper: true, cell: true }"
              :pagination="false"
          >
            <template #columns>
              <a-table-column title="菜单项" data-index="name" :width="300">
                <template #cell="{ record }">
                  <GlIconfont :type="record.iconType"></GlIconfont>
                  {{ record.name }}
                </template>
              </a-table-column>
              <a-table-column data-index="checked" :width="240">
                <template #title>
                  是否授权访问
                  <a-button-group type="primary" size="mini" shape="round">
                    <a-button @click="selectAllMenuItem">全选</a-button>
                    <a-button @click="reverseSelectAllMenuItem">反选</a-button>
                  </a-button-group>
                </template>
                <template #cell="{ record }">
                  <a-switch v-model="record.checked" :before-change="newValue => switchBeforeChange(record)"/>
                </template>
              </a-table-column>
              <a-table-column title="该页面相关元素权限" data-index="entities">
                <template #cell="{ record,info = getTreePermission(record.key) }">
                  <a-space v-if="info&&info.count>0">
                    <a-popconfirm position="tl" :content="info.checkedAll?'是否全部取消授权？':'是否全部授权？'"
                                  @ok="permissionCheckedSubmit((info as TreePermission))">
                      <a-button type="text" style="height: 20px;padding: 0px;">
                        <gl-iconfont type="gl-setting"/>
                      </a-button>
                    </a-popconfirm>
                    <div>
                      <a-checkbox v-for="(item,index) in info.data" v-model="item.checked" :key="index"
                                  :value="item.id" @change="permissionCheckedChange(item,info)">
                        {{ item.name }}
                      </a-checkbox>
                    </div>
                  </a-space>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title>
            <gl-iconfont type="gl-table"/>
            应用模型权限
          </template>
          Content of Tab Panel 2
        </a-tab-pane>
      </a-tabs>
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
