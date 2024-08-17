<script lang="ts">
/**
 *  模型列表
 */
export default {
  name: 'GlModelList'
}
</script>
<script lang="ts" setup>
import {compile, h, type Ref, ref, watch} from 'vue'
import {useAppStore} from '@geelato/gl-ide'
import type {QueryAppSqlForm, QueryAppTableForm, QueryAppViewForm, QuerySqlForm, QueryTableForm, QueryViewForm} from '@geelato/gl-ui'
import {modelApi, sqlApi, entityApi, EntityReader, EntityReaderParam, useGlobal, utils} from '@geelato/gl-ui'
import {approvalStatusOptions} from "./application/searchTable";
import {viewTypeOptions} from "./view/searchTable";
import GlModelTableModal from "./table/modal.vue";
import GlModelTableTabs from "./table/tableTabs.vue";
import GlModelTableAppForm from "./application/table/form.vue";
import GlModelTableAppTabs from "./application/table/tableTabs.vue";
import GlModelViewAppForm from "./application/view/form.vue";
import GlModelViewAppTabs from "./application/view/tableTabs.vue";
import GlModelTableViewForm from "./view/form.vue";
import GlModelSqlAppForm from "./application/sql/form.vue";
import GlModelSqlTabs from "./application/sql/tableTabs.vue";

type Item = {
  id: string
  creator: string
  updateAt: string
  updaterName: string
  creatorName: string
  entityName: string
  approval: QueryAppTableForm[]
  title?: string
  tableComment?: string
}

interface ViewItem extends QueryViewForm {
  approval: QueryAppViewForm[]
}

interface SqlItem extends QuerySqlForm {
  approval: QueryAppSqlForm[]
}

const props = defineProps({
  recordId: String
})
const global = useGlobal()
const appStore = useAppStore()
// 应用模型
const allItems: Ref<Item[]> = ref([])
const renderItems: Ref<Item[]> = ref([])
// 模型授权
const allAccreditItems: Ref<QueryAppTableForm[]> = ref([])
const renderAccreditItems: Ref<QueryAppTableForm[]> = ref([])
const allTableAppItems: Ref<QueryAppTableForm[]> = ref([]);
// 应用视图
const allViewItems: Ref<ViewItem[]> = ref([])
const renderViewItems: Ref<ViewItem[]> = ref([])
// 视图授权
const allAccreditViewItems: Ref<QueryAppViewForm[]> = ref([])
const renderAccreditViewItems: Ref<QueryAppViewForm[]> = ref([])
const allTableAppViewItems: Ref<QueryAppViewForm[]> = ref([]);
// 自定义SQL
const allSqlItems: Ref<SqlItem[]> = ref([])
const renderSqlItems: Ref<SqlItem[]> = ref([])
// 自定义SQL授权
const allAccreditSqlItems: Ref<QueryAppSqlForm[]> = ref([])
const renderAccreditSqlItems: Ref<QueryAppSqlForm[]> = ref([])
const allTableAppSqlItems: Ref<QueryAppSqlForm[]> = ref([]);

const searchText = ref('')
const orderBy = ref('updateAt')
const activeKey = ref<number[]>([1, 2, 3]);

const generateRenderItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allItems.value.sort((a, b) => a[orderBy.value].localeCompare(b[orderBy.value]))
  }

  if (!searchText.value) {
    renderItems.value.length = 0
    renderItems.value.push(...allItems.value)
  } else {
    renderItems.value = allItems.value.filter((item) => {
      return (
          item.entityName.indexOf(searchText.value) != -1 || item.title?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 2);
  if (renderItems.value.length > 0) {
    activeKey.value.push(2);
  }
}
const generateRenderAccreditItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allAccreditItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allAccreditItems.value.sort((a, b) => a['tableName'].localeCompare(b['tableName']))
  }

  if (!searchText.value) {
    renderAccreditItems.value.length = 0
    renderAccreditItems.value.push(...allAccreditItems.value)
  } else {
    renderAccreditItems.value = allAccreditItems.value.filter((item) => {
      return (
          item.tableName.indexOf(searchText.value) != -1 || item.tableTitle?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 1);
  if (renderAccreditItems.value.length > 0) {
    activeKey.value.push(1);
  }
}
const generateRenderViewItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allViewItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allViewItems.value.sort((a, b) => a['viewName'].localeCompare(b['viewName']))
  }

  if (!searchText.value) {
    renderViewItems.value.length = 0
    renderViewItems.value.push(...allViewItems.value)
  } else {
    renderViewItems.value = allViewItems.value.filter((item) => {
      return (
          item.viewName.indexOf(searchText.value) != -1 || item.viewName?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 3);
  if (renderViewItems.value.length > 0) {
    activeKey.value.push(3);
  }
}
const generateRenderAccreditViewItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allAccreditViewItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allAccreditViewItems.value.sort((a, b) => a['viewName'].localeCompare(b['viewName']))
  }

  if (!searchText.value) {
    renderAccreditViewItems.value.length = 0
    renderAccreditViewItems.value.push(...allAccreditViewItems.value)
  } else {
    renderAccreditViewItems.value = allAccreditViewItems.value.filter((item) => {
      return (
          item.viewName.indexOf(searchText.value) != -1 || item.viewTitle?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 4);
  if (renderAccreditViewItems.value.length > 0) {
    activeKey.value.push(4);
  }
}

const generateRenderSqlItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allSqlItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allSqlItems.value.sort((a, b) => a['keyName'].localeCompare(b['keyName']))
  }

  if (!searchText.value) {
    renderSqlItems.value.length = 0
    renderSqlItems.value.push(...allSqlItems.value)
  } else {
    renderSqlItems.value = allSqlItems.value.filter((item) => {
      return (
          item.keyName.indexOf(searchText.value) != -1 || item.keyName?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 5);
  if (renderSqlItems.value.length > 0) {
    activeKey.value.push(5);
  }
}
const generateRenderAccreditSqlItems = () => {
  // 如果有排序值，则先对数据进行排序
  if (orderBy.value === 'updateAt') {
    // @ts-ignore 从最新到最老
    allAccreditSqlItems.value.sort((a, b) => b[orderBy.value].localeCompare(a[orderBy.value]))
  } else if (orderBy.value === 'entityName') {
    // @ts-ignore 从小到大
    allAccreditSqlItems.value.sort((a, b) => a['sqlKey'].localeCompare(b['sqlKey']))
  }

  if (!searchText.value) {
    renderAccreditSqlItems.value.length = 0
    renderAccreditSqlItems.value.push(...allAccreditSqlItems.value)
  } else {
    renderAccreditSqlItems.value = allAccreditSqlItems.value.filter((item) => {
      return (
          item.sqlKey.indexOf(searchText.value) != -1 || item.sqlKey?.indexOf(searchText.value) != -1
      )
    })
  }

  activeKey.value = activeKey.value.filter(item => item !== 6);
  if (renderAccreditSqlItems.value.length > 0) {
    activeKey.value.push(6);
  }
}

watch(searchText, () => {
  generateRenderItems()
  generateRenderAccreditItems()
  generateRenderViewItems()
  generateRenderAccreditViewItems()
  generateRenderSqlItems()
  generateRenderAccreditSqlItems()
})
watch(orderBy, () => {
  generateRenderItems()
  generateRenderAccreditItems()
  generateRenderViewItems()
  generateRenderAccreditViewItems()
  generateRenderSqlItems()
  generateRenderAccreditSqlItems()
})

/**
 * 加载记录
 */
const fetchData = (successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_dev_table'
  entityReader.setFields('id,creator,creatorName,updateAt,updaterName,entityName,title,tableComment')
  entityReader.params = []
  entityReader.params.push(new EntityReaderParam('appId', 'eq', appStore.currentApp.id))
  entityApi.queryByEntityReader(entityReader).then(
      async (res: any) => {
        const {data} = await modelApi.queryAppTables({
          tableAppId: appStore.currentApp.id, approvalStatus: "draft"
        });
        allTableAppItems.value = data.filter((item) => item.approvalStatus === "draft");
        for (const item of res.data) {
          item.approval = [];
          for (const node of allTableAppItems.value) {
            if (node.tableName === item.entityName) {
              item.approval.push(node);
            }
          }
        }
        allItems.value = res.data
        if (successBack && typeof successBack === 'function') successBack(res.data);
        generateRenderItems()
      }, () => {
        global.$message.error({content: '获取应用的模型数据失败'})
      }
  )
}

const fetchAccreditData = async (successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  try {
    const {data} = await modelApi.queryAppTables({appId: appStore.currentApp.id});
    // @ts-ignore
    data.sort((a, b) => new Date(b?.updateAt).getTime() - new Date(a?.updateAt).getTime());
    allAccreditItems.value = [];
    const tableNames: string[] = [];
    data.forEach((item) => {
      if (!tableNames.includes(item.tableName)) {
        tableNames.push(item.tableName);
        allAccreditItems.value.push(item);
      }
    });
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    allAccreditItems.value = [];
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    generateRenderAccreditItems()
  }
}

const fetchViewData = async (successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  try {
    const {data} = await modelApi.queryViews({appId: appStore.currentApp.id});
    const result = await modelApi.queryAppViews({viewAppId: appStore.currentApp.id, approvalStatus: "draft"});
    allTableAppViewItems.value = result.data.filter((item) => item.approvalStatus === "draft") as QueryAppViewForm[];
    for (const item of data as unknown as ViewItem[]) {
      item.approval = [];
      for (const node of allTableAppViewItems.value) {
        if (node.viewName === item.viewName) {
          item.approval.push(node);
        }
      }
    }
    allViewItems.value = data as unknown as ViewItem[];
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    allViewItems.value = [];
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    generateRenderViewItems()
  }
}

const fetchAccreditViewData = async (successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  try {
    const {data} = await modelApi.queryAppViews({appId: appStore.currentApp.id});
    // @ts-ignore
    data.sort((a, b) => new Date(b?.updateAt).getTime() - new Date(a?.updateAt).getTime());
    allAccreditViewItems.value = [];
    const viewNames: string[] = [];
    data.forEach((item) => {
      if (!viewNames.includes(item.viewName)) {
        viewNames.push(item.viewName);
        allAccreditViewItems.value.push(item);
      }
    });
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    allAccreditViewItems.value = [];
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    generateRenderAccreditViewItems()
  }
}


const fetchSqlData = async (successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  try {
    const {data} = await sqlApi.querySqls({appId: appStore.currentApp.id});
    const result = await sqlApi.queryAppSqls({sqlAppId: appStore.currentApp.id, approvalStatus: "draft"});
    allTableAppSqlItems.value = result.data.filter((item) => item.approvalStatus === "draft") as QueryAppSqlForm[];
    for (const item of data as unknown as SqlItem[]) {
      item.approval = [];
      for (const node of allTableAppSqlItems.value) {
        if (node.sqlKey === item.keyName) {
          item.approval.push(node);
        }
      }
    }
    allSqlItems.value = data as unknown as SqlItem[];
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    allSqlItems.value = [];
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    generateRenderSqlItems()
  }
}

const fetchAccreditSqlData = async (successBack?: any, failBack?: any) => {
  if (!appStore.currentApp.id) {
    return
  }
  try {
    const {data} = await sqlApi.queryAppSqls({appId: appStore.currentApp.id});
    // @ts-ignore
    data.sort((a, b) => new Date(b?.updateAt).getTime() - new Date(a?.updateAt).getTime());
    allAccreditSqlItems.value = [];
    const viewNames: string[] = [];
    data.forEach((item) => {
      if (!viewNames.includes(item.sqlKey)) {
        viewNames.push(item.sqlKey);
        allAccreditSqlItems.value.push(item);
      }
    });
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    allAccreditSqlItems.value = [];
    if (failBack && typeof failBack === 'function') failBack(err);
  } finally {
    generateRenderAccreditSqlItems()
  }
}

const changeTab = (value: any) => {
  orderBy.value = value
}

const refreshMeta = async () => {
  try {
    await modelApi.refreshMetaRedis({
      appId: appStore.currentApp.id || '',
      tenantCode: appStore.currentApp.tenantCode || ''
    });
    global.$message.success({content: '刷新缓存成功！'})
    fetchData()
    fetchViewData()
  } catch (err) {
    global.$message.error({content: '刷新缓存失败！'})
  }
}

const initViewResult = (result: Record<string, any>) => {
  const data: string[] = [];
  if (result && typeof result === 'object') {
    for (const key in result) {
      if (result[key] !== true) {
        data.push(`<p>${key} - ${result[key]}</p>`);
      }
    }
  }
  if (data.length > 0) {
    global.$message.error({content: '【视图】同步至数据库失败！'})
    global.$message.info({content: () => h(compile(`${data.join('')}`)), duration: 15 * 1000})
  } else {
    global.$message.success({content: '【视图】同步至数据库成功！'})
  }
}

const tableInit = async () => {
  if (!appStore.currentApp.id) {
    return
  }
  appStore.currentApp.initLoading = true;
  let msgLoading = global.$message.loading({content: `（1/2）正在将 ${appStore.currentApp.name} 下的所有【模型】同步至数据库`, duration: 100000 * 10000});
  try {
    const tableResult = await modelApi.initTables(appStore.currentApp.id);
    console.log("init Table", tableResult);
    global.$message.success({content: '【模型】同步至数据库成功！'})
    msgLoading.close();
    msgLoading = global.$message.loading({content: `（2/2）正在将 ${appStore.currentApp.name} 下的所有【视图】同步至数据库`, duration: 100000 * 10000});
    const viewResult = await modelApi.initViews(appStore.currentApp.id);
    console.log("init View", viewResult);
    initViewResult(viewResult.data);
    msgLoading.close();
    fetchData()
    fetchViewData()
  } catch (err) {
    global.$message.error({content: '同步至数据库失败！'})
  } finally {
    appStore.currentApp.initLoading = false;
    msgLoading.close();
  }
}

const resetData = (type: string) => {
  if (type === 'table') {
    fetchData(() => {
      global.$message.success({content: '应用模型数据重置成功！'})
    });
  } else if (type === 'view') {
    fetchViewData(() => {
      global.$message.success({content: '应用视图数据重置成功！'})
    }, () => {
      global.$message.error({content: '应用视图数据重置失败！'})
    })
  } else if (type === 'sql') {
    fetchSqlData(() => {
      global.$message.success({content: '自定义SQL数据重置成功！'})
    }, () => {
      global.$message.error({content: '自定义SQL数据重置失败！'})
    })
  } else if (type === 'accredit') {
    fetchAccreditData(() => {
      global.$message.success({content: '授权模型数据重置成功！'})
    }, () => {
      global.$message.error({content: '授权模型数据重置失败！'})
    })
  } else if (type === 'accreditView') {
    fetchAccreditViewData(() => {
      global.$message.success({content: '授权视图数据重置成功！'})
    }, () => {
      global.$message.error({content: '授权视图数据重置失败！'})
    })
  } else if (type === 'accreditSql') {
    fetchAccreditSqlData(() => {
      global.$message.success({content: '授权自定义SQL数据重置成功！'})
    }, () => {
      global.$message.error({content: '授权自定义SQL数据重置失败！'})
    })
  }
}

fetchData()
fetchAccreditData()
fetchViewData()
fetchAccreditViewData()
fetchSqlData()
fetchAccreditSqlData()

/* 模型tab页所需参数 */
const formTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '76%', refApp: false,
  parameter: {appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
/**
 * 点击打开tab页面
 * @param id
 */
const tableOpen = (id: string) => {
  if (!appStore.currentApp.id) {
    return
  }
  formTabsParams.value.id = id;
  formTabsParams.value.refApp = false;
  formTabsParams.value.visible = true;
}

/* 模型表单所需参数 */
const formParams = ref({
  id: '', visible: false, formState: 'add', formCol: 2, width: '1020px',
  parameter: {connectId: '', appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});
/**
 * 新增模型，打开模型表单
 * @param ev
 */
const addTableForm = (ev?: MouseEvent) => {
  if (!appStore.currentApp.id) {
    return
  }
  formParams.value.visible = true;
}
/**
 * 表单保存成功后
 * @param data
 * @param action
 */
const tableFormSaveSuccess = (data: QueryTableForm, action: string) => {
  // 打开模型tab页面
  if (data.id && action === 'add') tableOpen(data.id);
  // 刷新模型列表
  fetchData();
  fetchViewData();
}

const aTableFormSaveSuccess = (data: QueryAppTableForm, action: string) => {
  // 刷新模型列表
  fetchAccreditData();
}

const viewFormSaveSuccess = (data: ViewItem, action: string) => {
  // 刷新模型列表
  fetchViewData();
}

const aViewFormSaveSuccess = (data: QueryAppViewForm, action: string) => {
  // 刷新视图授权列表
  fetchAccreditViewData();
}

const sqlFormSaveSuccess = (data: SqlItem, action: string) => {
  // 刷新模型列表
  fetchSqlData();
}

const aSqlFormSaveSuccess = (data: QueryAppSqlForm, action: string) => {
  // 刷新视图授权列表
  fetchAccreditSqlData();
}

const atFormTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '80%', refApp: true,
  parameter: {author: true, appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});


const appTableOpen = (record: QueryAppTableForm) => {
  if (!appStore.currentApp.id) {
    return
  }
  atFormTabsParams.value.id = record.tableId;
  atFormTabsParams.value.visible = true;
}

const atFormParams = ref({
  id: '', visible: false, formState: 'add', formCol: 1, width: '', title: '',
  parameter: {
    tableId: '', tableName: '', author: true,
    appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  }
});
/**
 * 新增模型，打开模型表单
 * @param ev
 */
const addAppTableForm = (ev?: MouseEvent) => {
  if (!appStore.currentApp.id) {
    return
  }
  atFormParams.value.id = '';
  atFormParams.value.formState = 'add';
  atFormParams.value.visible = true;
}


const vFormParams = ref({
  id: '', visible: false, formState: 'add', formCol: 2, title: '', width: '76%',
  parameter: {
    connectId: '', entityName: '',
    appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  },
});
const addViewForm = () => {
  Object.assign(vFormParams.value, {
    id: '', visible: true, formState: 'add', title: '新建模型视图',
    parameter: {
      connectId: '', entityName: '',
      appId: appStore.currentApp.id,
      tenantCode: appStore.currentApp.tenantCode
    }
  });
}
const editViewForm = (record: ViewItem) => {
  Object.assign(vFormParams.value, {
    id: record.id, visible: true, formState: 'edit', title: `编辑模型视图（${record.viewName}）`,
    parameter: {
      connectId: record.connectId, entityName: record.entityName,
      appId: appStore.currentApp.id,
      tenantCode: appStore.currentApp.tenantCode
    }
  });
}

const avFormTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '80%', refApp: true,
  parameter: {author: true, appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode}
});

const appViewOpen = (record: QueryAppViewForm) => {
  if (!appStore.currentApp.id) {
    return
  }
  avFormTabsParams.value.id = record.viewId;
  avFormTabsParams.value.visible = true;
}

const avFormParams = ref({
  id: '', visible: false, formState: 'add', formCol: 1, width: '', title: '',
  parameter: {
    viewId: '', viewName: '', author: true,
    appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  }
});

const addAppViewForm = (ev?: MouseEvent) => {
  if (!appStore.currentApp.id) {
    return
  }
  avFormParams.value.id = '';
  avFormParams.value.formState = 'add';
  avFormParams.value.visible = true;
}

/* 申请页面 */
const arFormParams = ref({
  id: '', visible: false, formState: 'add', formCol: 1, title: '', width: '',
  parameter: {
    sqlId: '', sqlKey: '', author: true,
    appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  },
});
/* 表单页面+申请列表 */
const arFormTabsParams = ref({
  id: '', visible: false, formState: 'edit', formCol: 2, width: '80%', title: '',
  parameter: {
    author: false, appId: appStore.currentApp.id, tenantCode: appStore.currentApp.tenantCode
  }
});

const addAppSqlForm = (ev?: MouseEvent) => {
  if (!appStore.currentApp.id) {
    return
  }
  arFormParams.value.id = '';
  arFormParams.value.formState = 'add';
  arFormParams.value.visible = true;
}

const addSqlForm = () => {
  Object.assign(arFormTabsParams.value, {
    id: '', visible: true, formState: 'add', title: '新建自定义SQL',
    parameter: {
      author: false,
      appId: appStore.currentApp.id,
      tenantCode: appStore.currentApp.tenantCode
    }
  });
}
const editSqlForm = (record: SqlItem) => {
  Object.assign(arFormTabsParams.value, {
    id: record.id, visible: true, formState: 'edit', title: `编辑自定义SQL（${record.keyName}）`,
    parameter: {
      author: false,
      appId: appStore.currentApp.id,
      tenantCode: appStore.currentApp.tenantCode
    }
  });
}


const appSqlOpen = (record: QueryAppSqlForm) => {
  Object.assign(arFormTabsParams.value, {
    id: record.sqlId, visible: true, formState: 'view', title: `自定义SQL申请（${record.sqlKey}）`,
    parameter: {
      author: true,
      appId: appStore.currentApp.id,
      tenantCode: appStore.currentApp.tenantCode
    }
  });
}


</script>

<template>
  <div class="gl-model-list">
    <a-tabs :default-active-key="orderBy" size="mini" @change="changeTab">
      <a-tab-pane key="updateAt" title="按时间排序"/>
      <a-tab-pane key="entityName" title="按名称排序"/>
      <template #extra>
        <a-tag color="arcoblue" size="small" style="margin-right: 8px" title="当前应用的模型总数量">
          {{
            allItems.length + allAccreditItems.length +
            allViewItems.length + allAccreditViewItems.length +
            allSqlItems.length + allAccreditSqlItems.length
          }}
        </a-tag>
      </template>
    </a-tabs>

    <div style="padding: 4px 5px 4px 5px;">
      <a-space style="justify-content: flex-start;">
        <a-input-search v-model="searchText" allow-clear placeholder="录入中、英文名查询" size="small"/>
        <a-popconfirm content="是否将该应用下所有【模型】和【视图】同步至数据库？" position="bottom" type="warning" @ok="tableInit">
          <a-button size="small" type="outline" status="danger" style="height: 27px;" :loading="appStore.currentApp.initLoading">
            <template #icon>
              <a-tooltip content="应用【模型】和【视图】同步至数据库">
                <gl-iconfont type="gl-transfer"/>
              </a-tooltip>
            </template>
          </a-button>
        </a-popconfirm>
        <a-popconfirm content="是否刷新该应用下所有模型及视图的缓存？" position="bottom" type="warning" @ok="refreshMeta">
          <a-button size="small" type="outline" style="height: 27px;">
            <template #icon>
              <a-tooltip content="刷新应用模型和视图缓存">
                <gl-iconfont type="gl-sync"/>
              </a-tooltip>
            </template>
          </a-button>
        </a-popconfirm>
      </a-space>
    </div>

    <a-collapse v-model:active-key="activeKey" :bordered="true" class="collapse1">
      <a-collapse-item :key="2" class="colapse-list1">
        <template #header>
          {{ `应用模型（${renderItems.length}${allTableAppItems.length > 0 ? '，' + allTableAppItems.length : ''}）` }}
        </template>
        <template #extra>
          <a-space>
            <a-tooltip content="新建">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="addTableForm">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-tooltip content="重置">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="resetData('table')">
                <gl-iconfont type="gl-reset"/>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="tableOpen(item.id)">
              <a-list-item-meta :title="item.entityName">
                <template #title>
                  <a-tooltip v-if="item.approval.length>0" :content="`模型权限申请（${item.approval.length}）`">
                    <gl-iconfont style="color: rgb(245,63,63)" type="gl-warning-circle"/>
                  </a-tooltip>
                  {{ item.entityName }}
                </template>
                <template #description>
                  {{ item.title }}
                </template>
              </a-list-item-meta>
              <template #actions>
                <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
                  {{ utils.timeAgo(item.updateAt) }}
                </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>
      <a-collapse-item :key="3" :header="`应用视图（${renderViewItems.length}）`" class="colapse-list1">
        <template #header>
          {{ `应用视图（${renderViewItems.length}${allTableAppViewItems.length > 0 ? '，' + allTableAppViewItems.length : ''}）` }}
        </template>
        <template #extra>
          <a-space>
            <a-tooltip content="新建">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="addViewForm">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-tooltip content="重置">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="resetData('view')">
                <gl-iconfont type="gl-reset"/>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderViewItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="editViewForm(item)">
              <a-tooltip position="right"
                         :content="`${utils.getOptionLabel(item.viewType, viewTypeOptions)} ${item.entityName || ''} ${item.description || ''}`">
                <a-list-item-meta :description="item.title" :title="item.viewName">
                  <template #title>
                    <a-tooltip v-if="item.approval.length>0" :content="`视图权限申请（${item.approval.length}）`">
                      <gl-iconfont style="color: rgb(245,63,63)" type="gl-warning-circle"/>
                    </a-tooltip>
                    {{ item.viewName }}
                  </template>
                </a-list-item-meta>
              </a-tooltip>
              <template #actions>
            <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
              {{ utils.timeAgo(item.updateAt || '') }}
            </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>
      <a-collapse-item :key="5" :header="`自定义SQL（${renderSqlItems.length}）`" class="colapse-list1">
        <template #header>
          {{ `自定义SQL（${renderSqlItems.length}${allTableAppSqlItems.length > 0 ? '，' + allTableAppSqlItems.length : ''}）` }}
        </template>
        <template #extra>
          <a-space>
            <a-tooltip content="新建">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="addSqlForm">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-tooltip content="重置">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="resetData('sql')">
                <gl-iconfont type="gl-reset"/>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderSqlItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="editSqlForm(item)">
              <a-list-item-meta :title="item.keyName">
                <template #title>
                  <a-tooltip v-if="item.approval.length>0" :content="`模型权限申请（${item.approval.length}）`">
                    <gl-iconfont style="color: rgb(245,63,63)" type="gl-warning-circle"/>
                  </a-tooltip>
                  {{ item.keyName }}
                </template>
                <template #description>
                  {{ item.title }}
                </template>
              </a-list-item-meta>
              <template #actions>
                <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
                  {{ utils.timeAgo(item.updateAt as string) }}
                </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>

      <a-collapse-item :key="1" :header="`授权模型（${renderAccreditItems.length}）`" class="colapse-list1">
        <template #extra>
          <a-space>
            <a-tooltip content="新建">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="addAppTableForm">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-tooltip content="重置">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="resetData('accredit')">
                <gl-iconfont type="gl-reset"/>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderAccreditItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="appTableOpen(item)">
              <a-list-item-meta :description="item.tableTitle" :title="item.tableName">
              </a-list-item-meta>
              <template #actions>
            <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
              {{ utils.timeAgo(item.updateAt || '') }}
            </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>
      <a-collapse-item :key="4" :header="`授权视图（${renderAccreditViewItems.length}）`" class="colapse-list1">
        <template #extra>
          <a-space>
            <a-tooltip content="新建">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="addAppViewForm">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-tooltip content="重置">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="resetData('accreditView')">
                <gl-iconfont type="gl-reset"/>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderAccreditViewItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="appViewOpen(item)">
              <a-list-item-meta :description="item.viewTitle" :title="item.viewName"/>
              <template #actions>
            <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
              {{ utils.timeAgo(item.updateAt || '') }}
            </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>
      <a-collapse-item :key="6" :header="`授权自定义SQL（${renderAccreditSqlItems.length}）`" class="colapse-list1">
        <template #extra>
          <a-space>
            <a-tooltip content="新建">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="addAppSqlForm">
                <gl-iconfont type="gl-plus-circle"/>
              </a-button>
            </a-tooltip>
            <a-tooltip content="重置">
              <a-button size="mini" style="padding: 0 5px;" type="text" @click.stop="resetData('accreditSql')">
                <gl-iconfont type="gl-reset"/>
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
        <a-list size="small">
          <template v-for="item in renderAccreditSqlItems" :key="item.id">
            <a-list-item style="cursor: pointer;" @click="appSqlOpen(item)">
              <a-list-item-meta :description="item.sqlTitle" :title="item.sqlKey">
              </a-list-item-meta>
              <template #actions>
            <span :title="`${item.updaterName || ''}更新@${item.updateAt}`" class="gl-actions-description">
              {{ utils.timeAgo(item.updateAt || '') }}
            </span>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </a-collapse-item>
    </a-collapse>
  </div>

  <GlModelTableAppForm v-model:visible="atFormParams.visible"
                       :formCol="atFormParams.formCol"
                       :formState="atFormParams.formState"
                       :modelValue="atFormParams.id"
                       :parameter="atFormParams.parameter"
                       :title="atFormParams.title"
                       :width="atFormParams.width"
                       @saveSuccess="aTableFormSaveSuccess"/>

  <GlModelTableAppTabs v-model:visible="atFormTabsParams.visible" :formState="atFormTabsParams.formState"
                       :modelValue="atFormTabsParams.id" :parameter="atFormTabsParams.parameter"
                       :refApp="atFormTabsParams.refApp" :width="atFormTabsParams.width"
                       @deleteSuccess="aTableFormSaveSuccess" @updateSuccess="aTableFormSaveSuccess"/>


  <GlModelViewAppForm v-model:visible="avFormParams.visible"
                      :formCol="avFormParams.formCol"
                      :formState="avFormParams.formState"
                      :modelValue="avFormParams.id"
                      :parameter="avFormParams.parameter"
                      :title="avFormParams.title"
                      :width="avFormParams.width"
                      @saveSuccess="aViewFormSaveSuccess"/>

  <GlModelViewAppTabs v-model:visible="avFormTabsParams.visible" :formState="avFormTabsParams.formState"
                      :modelValue="avFormTabsParams.id" :parameter="avFormTabsParams.parameter"
                      :refApp="avFormTabsParams.refApp" :width="avFormTabsParams.width"
                      @deleteSuccess="aViewFormSaveSuccess" @updateSuccess="aViewFormSaveSuccess"/>

  <GlModelSqlAppForm v-model:visible="arFormParams.visible"
                     :formCol="arFormParams.formCol"
                     :formState="arFormParams.formState"
                     :modelValue="arFormParams.id"
                     :parameter="arFormParams.parameter"
                     :title="arFormParams.title"
                     :width="arFormParams.width"
                     @saveSuccess="aSqlFormSaveSuccess"/>

  <GlModelSqlTabs v-model:visible="arFormTabsParams.visible"
                  :formState="arFormTabsParams.formState"
                  :formCol="arFormTabsParams.formCol"
                  :modelValue="arFormTabsParams.id"
                  :parameter="arFormTabsParams.parameter"
                  :width="arFormTabsParams.width"
                  :title="arFormTabsParams.title"
                  @saveSuccess="sqlFormSaveSuccess"/>

  <GlModelTableModal v-model:visible="formParams.visible" :formCol="formParams.formCol"
                     :formState="formParams.formState" :modelValue="formParams.id"
                     :parameter="formParams.parameter" :width="formParams.width"
                     @saveSuccess="tableFormSaveSuccess"/>

  <GlModelTableTabs v-model:visible="formTabsParams.visible" :formState="formTabsParams.formState"
                    :modelValue="formTabsParams.id" :parameter="formTabsParams.parameter"
                    :refApp="formTabsParams.refApp" :width="formTabsParams.width"
                    @deleteSuccess="tableFormSaveSuccess" @updateSuccess="tableFormSaveSuccess"/>

  <GlModelTableViewForm v-model:visible="vFormParams.visible"
                        :formCol="vFormParams.formCol"
                        :formState="vFormParams.formState"
                        :modelValue="vFormParams.id"
                        :parameter="vFormParams.parameter"
                        :title="vFormParams.title"
                        :width="vFormParams.width"
                        :isPermission="vFormParams.formState==='add'?false:true"
                        :isApproval="vFormParams.formState==='add'?false:true"
                        @saveSuccess="viewFormSaveSuccess"/>
</template>
<style>
.gl-model-list .gl-has {
  color: #165dff;
}

.gl-model-list .arco-list-item {
  padding: 1px 14px !important;
}

.gl-model-list .arco-list-item-meta-description {
  font-size: 11px;
}

.gl-model-list .arco-collapse-item-header-title {
  font-weight: bold !important;
}

.gl-model-list .gl-actions-description {
  font-size: 11px;
}

.colapse-list1 .arco-collapse-item-content {
  padding-left: 4px;
  padding-right: 0px;
  background-color: var(--color-bg-5);
}
</style>
