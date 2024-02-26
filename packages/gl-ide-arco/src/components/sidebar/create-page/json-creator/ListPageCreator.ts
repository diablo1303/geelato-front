import { FieldMeta, utils } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { useComponentStore } from '@geelato/gl-ide'
import { PageCreator, PageCreatorOptions } from './PageCreator'
import { useFieldMetaToComponentInst } from './useFieldMetaToComponentInst'

const useToolbarInst = (
  options: PageCreatorOptions,
  tableInst: ComponentInstance,
  formInst: ComponentInstance
) => {
  const tablePageId = '${createPage.tablePageExtendId}'
  return {
    leftColSpan: 12,
    centerColSpan: 0,
    rightColSpan: 12,
    leftItems: [
      {
        id: utils.gid('btn'),
        componentName: 'GlButton',
        group: '',
        props: {
          type: 'primary',
          status: 'normal',
          label: '新增',
          iconType: 'gl-plus-circle'
        },
        slots: {},
        children: [],
        actions: [
          {
            id: utils.gid('act'),
            eventName: 'click',
            name: 'click',
            title: '点击',
            body: `const content = $gl.fn.loadPage("","${options.pageInfo.pageExtendId}",[],"create");
            $gl.fn.openDrawer({
                title:"${options.pageInfo.label}",
                content: content,
                width:"80%",
                okText:"保存",
                onBeforeOk: async ()=>{
                    try{
                        return $gl.fn.invokeComponentMethod("${formInst.id}","submitForm",[]);
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onOpen:async ()=>{
                    try{
                        
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onClose:async ()=>{
                    try{
                        $gl.fn.invokeComponentMethod("${tableInst.id}","refresh",[]);
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                cancelText:"取消",
                hideCancel:true
            })`,
            __commandBlock: {
              componentName: 'GlPage',
              id: utils.gid('blockPage'),
              props: {
                pageType: 'blockPage',
                label: '指令',
                pageMargin: '0',
                pagePadding: '0'
              },
              slots: {},
              children: [
                {
                  id: utils.gid('id'),
                  title: '',
                  componentName: 'GlOpenComponentPageBlock',
                  group: 'block_page',
                  props: {
                    extendId: `${options.pageInfo.pageExtendId}`,
                    title: `${options.pageInfo.label}`,
                    params: [],
                    okText: '保存',
                    hideCancel: true,
                    invokeBlocks: ['onBeforeOk', 'onClose'],
                    width: '80%',
                    pageStatus: 'create'
                  },
                  slots: {},
                  children: [
                    {
                      componentName: 'GlVirtual',
                      id: utils.gid('v'),
                      props: {},
                      slots: {},
                      children: [
                        {
                          id: utils.gid('id'),
                          title: '',
                          componentName: 'GlComponentInvokeBlock',
                          group: 'block_page',
                          props: {
                            extendId: `${options.pageInfo.pageExtendId}`,
                            componentId: `${formInst.id}`,
                            params: [],
                            methodName: 'submitForm',
                            enableReturn: true
                          },
                          slots: {},
                          children: [],
                          actions: [],
                          style: {},
                          propsWrapper: '',
                          i18n: [],
                          propsExpressions: {},
                          slotsExpressions: {}
                        }
                      ],
                      actions: [],
                      style: {}
                    },
                    {
                      componentName: 'GlVirtual',
                      id: utils.gid('v'),
                      props: {},
                      slots: {},
                      children: [
                        {
                          id: utils.gid('id'),
                          title: '',
                          componentName: 'GlComponentInvokeBlock',
                          group: 'block_page',
                          props: {
                            extendId: tablePageId,
                            componentId: `${tableInst.id}`,
                            methodName: 'refresh',
                            params: []
                          },
                          slots: {},
                          children: [],
                          actions: [],
                          style: {},
                          propsWrapper: '',
                          i18n: [],
                          propsExpressions: {},
                          slotsExpressions: {}
                        }
                      ],
                      actions: [],
                      style: {}
                    }
                  ],
                  actions: [],
                  style: {},
                  propsWrapper: '',
                  i18n: [],
                  propsExpressions: {},
                  slotsExpressions: {}
                }
              ],
              actions: [],
              style: {}
            }
          }
        ],
        style: {},
        propsWrapper: '',
        i18n: [],
        propsExpressions: {},
        slotsExpressions: {}
      }
    ],
    centerItems: [],
    rightItems: []
  }
}

const useEmptyToolbarInst = () => {
  return {
    leftColSpan: 12,
    centerColSpan: 0,
    rightColSpan: 12,
    leftItems: [],
    centerItems: [],
    rightItems: []
  }
}

const useQueryInst = (options: PageCreatorOptions) => {
  const insts = useFieldMetaToComponentInst(options.entityMeta.entityName, options.queryFields)

  const items: any[] = []
  insts.forEach((inst: ComponentInstance, index: number) => {
    // const fieldMeta = options.queryFields[index]

    items.push({
      id: utils.gid('query'),
      component: inst,
      cop: 'eq',
      colspan: 6
    })
  })

  return items
}

const useColumnsInst = (options: PageCreatorOptions) => {
  const columns: any[] = []
  columns.push({
    title: 'ID',
    dataIndex: 'id'
  })
  options.showFields.forEach((fieldMeta: FieldMeta) => {
    columns.push({
      title: fieldMeta.title,
      dataIndex: fieldMeta.alias || fieldMeta.name,
      _propsExpressions: {},
      // sortable: { sortDirections: ['ascend', 'descend'] },
      sortable: {}
    })
  })

  return columns
}

const useColumnActionsInst = (
  options: PageCreatorOptions,
  tableInst: ComponentInstance,
  formInst: ComponentInstance
) => {
  const tablePageId = '${createPage.tablePageExtendId}'
  const formPageId = options.pageInfo.pageExtendId
  const paramFormId = utils.gid('id')
  const paramPageStatusId = utils.gid('id')
  const actions: any[] = []
  actions.push({
    id: utils.gid('btn'),
    componentName: 'GlButton',
    group: '',
    props: { type: 'text', label: '详细', iconType: '' },
    propsExpressions: {},
    slots: {},
    slotsExpressions: {},
    children: [],
    actions: [
      {
        id: utils.gid('act'),
        eventName: 'click',
        name: 'click',
        title: '点击',
        body: `const content = $gl.fn.loadPage("","${formPageId}",[{"id":"${paramFormId}","name":"form.id","valueExpression":"$gl.ctx.record.id"},{"id":"${paramPageStatusId}","name":"page.status","valueExpression":"\\"read\\""}],"read");
            $gl.fn.openDrawer({
                title:"详细信息",
                content: content,
                width:"80%",
                okText:"关闭",
                onBeforeOk: async ()=>{
                    try{
                        
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onOpen:async ()=>{
                    try{
                        
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onClose:async ()=>{
                    try{
                        
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                cancelText:"取消",
                hideCancel:true
            })`,
        __commandBlock: {
          componentName: 'GlPage',
          id: utils.gid('blockPage'),
          props: {
            pageType: 'blockPage',
            label: '指令',
            pageMargin: '0',
            pagePadding: '0'
          },
          slots: {},
          children: [
            {
              id: utils.gid('id'),
              title: '',
              componentName: 'GlOpenComponentPageBlock',
              group: 'block_page',
              props: {
                extendId: formPageId,
                title: '详细信息',
                params: [
                  {
                    id: paramFormId,
                    name: 'form.id',
                    valueExpression: '$gl.ctx.record.id'
                  },
                  {
                    id: paramPageStatusId,
                    name: 'page.status',
                    valueExpression: '"read"'
                  }
                ],
                pageStatus: 'read',
                okText: '关闭',
                hideCancel: true
              },
              propsExpressions: {},
              slots: {},
              slotsExpressions: {},
              children: [],
              actions: [],
              style: {},
              propsWrapper: '',
              i18n: []
            }
          ],
          actions: [],
          style: {}
        }
      }
    ],
    style: {},
    propsWrapper: '',
    i18n: []
  })

  actions.push({
    id: utils.gid('btn'),
    componentName: 'GlButton',
    group: '',
    props: { type: 'text', label: '修改', iconType: '' },
    propsExpressions: {},
    slots: {},
    slotsExpressions: {},
    children: [],
    actions: [
      {
        id: utils.gid('act'),
        eventName: 'click',
        name: 'click',
        title: '点击',
        body: `const content = $gl.fn.loadPage("","${formPageId}",[{"id":"${paramFormId}","name":"form.id","valueExpression":"$gl.ctx.record.id"}],"update");
            $gl.fn.openDrawer({
                title:"修改信息",
                content: content,
                width:"80%",
                okText:"保存",
                onBeforeOk: async ()=>{
                    try{
                        return $gl.fn.invokeComponentMethod("${formInst.id}","submitForm",[]);
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onOpen:async ()=>{
                    try{
                        
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                onClose:async ()=>{
                    try{
                        $gl.fn.invokeComponentMethod("${tableInst.id}","refresh",[]);
                    }catch(e){
                        console.error(e)
                        return false
                    }
                },
                cancelText:"取消",
                hideCancel:true
            })`,
        __commandBlock: {
          componentName: 'GlPage',
          id: utils.gid('blockPage'),
          props: {
            pageType: 'blockPage',
            label: '指令',
            pageMargin: '0',
            pagePadding: '0'
          },
          slots: {},
          children: [
            {
              id: utils.gid('id'),
              title: '',
              componentName: 'GlOpenComponentPageBlock',
              group: 'block_page',
              props: {
                extendId: formPageId,
                title: '修改信息',
                params: [
                  {
                    id: paramFormId,
                    name: 'form.id',
                    valueExpression: '$gl.ctx.record.id'
                  }
                ],
                pageStatus: 'update',
                okText: '保存',
                hideCancel: true,
                invokeBlocks: ['onBeforeOk', 'onClose'],
                width: '80%'
              },
              propsExpressions: {},
              slots: {},
              slotsExpressions: {},
              children: [
                {
                  componentName: 'GlVirtual',
                  id: utils.gid('v'),
                  props: {},
                  slots: {},
                  children: [
                    {
                      id: utils.gid('id'),
                      title: '',
                      componentName: 'GlComponentInvokeBlock',
                      group: 'block_page',
                      props: {
                        extendId: formPageId,
                        componentId: `${formInst.id}`,
                        params: [],
                        methodName: 'submitForm',
                        enableReturn: true
                      },
                      slots: {},
                      children: [],
                      actions: [],
                      style: {},
                      propsWrapper: '',
                      i18n: [],
                      propsExpressions: {},
                      slotsExpressions: {}
                    }
                  ],
                  actions: [],
                  style: {}
                },
                {
                  componentName: 'GlVirtual',
                  id: utils.gid('v'),
                  props: {},
                  slots: {},
                  children: [
                    {
                      id: utils.gid('id'),
                      title: '',
                      componentName: 'GlComponentInvokeBlock',
                      group: 'block_page',
                      props: {
                        extendId: tablePageId,
                        componentId: `${tableInst.id}`,
                        methodName: 'refresh',
                        params: []
                      },
                      slots: {},
                      children: [],
                      actions: [],
                      style: {},
                      propsWrapper: '',
                      i18n: [],
                      propsExpressions: {},
                      slotsExpressions: {}
                    }
                  ],
                  actions: [],
                  style: {}
                }
              ],
              actions: [],
              style: {},
              i18n: []
            }
          ]
        }
      }
    ],
    style: {},
    propsWrapper: '',
    i18n: []
  })

  actions.push({
    id: utils.gid('btn'),
    componentName: 'GlButton',
    group: '',
    props: { type: 'text', label: '删除', status: 'danger', iconType: '' },
    propsExpressions: {},
    slots: {},
    slotsExpressions: {},
    children: [],
    actions: [
      {
        id: utils.gid('act'),
        eventName: 'click',
        name: 'click',
        title: '点击',
        body:
          'let varName = "undefined" || "confirm";\n' +
          'let vars = {};\n' +
          '$gl.fn.confirm({\n' +
          '  width: "15em",\n' +
          '  title: "危险操作",\n' +
          '  content: "是否确定删除？",\n' +
          '  onOk: () => {\n' +
          '    vars[varName] = true;\n' +
          '    $gl.fn.invokeComponentMethod("' +
          tableInst.id +
          '", "deleteRecord", [\n' +
          '      { name: "id", value: undefined, valueExpression: $gl.ctx.record.id },\n' +
          '    ]);\n' +
          '  },\n' +
          '  onCancel: () => {\n' +
          '    vars[varName] = false;\n' +
          '  },\n' +
          '});',
        body2: `$gl.fn.invokeComponentMethod(\\"${tableInst.id}\\",\\"deleteRecordWithConfirm\\",[{name:\\"id\\",value:undefined,valueExpression:$gl.ctx.record.id},]);`,
        __commandBlock: {
          componentName: 'GlPage',
          id: utils.gid('blockPage'),
          props: {
            pageType: 'blockPage',
            label: '指令',
            pageMargin: '0',
            pagePadding: '0'
          },
          slots: {},
          children: [
            {
              id: utils.gid('id'),
              title: '',
              componentName: 'GlComponentInvokeBlock',
              group: 'block_page',
              props: {
                extendId: tablePageId,
                componentId: `${tableInst.id}`,
                methodName: 'deleteRecordWithConfirm',
                params: [
                  {
                    id: utils.gid('p'),
                    name: 'id',
                    valueExpression: '$gl.ctx.record.id'
                  }
                ]
              },
              propsExpressions: {},
              slots: {},
              slotsExpressions: {},
              children: [],
              actions: [],
              i18n: []
            }
          ]
        }
      }
    ],
    i18n: []
  })

  return actions
}

const useEmptyColumnActionsInst = () => {
  return []
}

const useTableInst = (options: PageCreatorOptions): ComponentInstance => {
  const componentStore = useComponentStore()

  return {
    componentName: 'GlEntityTablePlus',
    group: 'dataDisplay',
    style: {},
    id: utils.gid(componentStore.getAlias('GlEntityTablePlus')),
    props: {
      base: {
        entityName: options.entityMeta.entityName,
        showQuery: true,
        showPagination: true,
        showToolbar: true,
        tablePadding: '',
        enableEdit: false,
        tableTitle: options.entityMeta.entityTitle,
        label: options.entityMeta.entityTitle
      },
      query: [],
      toolbar: {},
      columns: []
    },
    slots: {},
    children: [],
    actions: []
  }
}

export class ListPageCreator extends PageCreator {
  buildChildren(page: ComponentInstance, options: PageCreatorOptions): ComponentInstance {
    // 获取字段信息
    const tableInst = useTableInst(options)
    const pageInst: ComponentInstance = options.pageInfo.pageExtendContent
    //
    const findFormInst = (inst: ComponentInstance): ComponentInstance | null => {
      console.log('findFormInst', inst)
      if (inst.componentName && inst.componentName === 'GlEntityForm') {
        return inst
      }
      for (let index in inst.children) {
        const subInst = inst.children[index]
        const foundForm: ComponentInstance | null = findFormInst(subInst)
        if (foundForm) {
          return foundForm
        }
      }
      return null
    }
    const formInst: ComponentInstance | null = findFormInst(pageInst)

    if (formInst) {
      tableInst.props.toolbar = useToolbarInst(options, tableInst, formInst!)
      tableInst.props.columnActions = useColumnActionsInst(options, tableInst, formInst!)
    } else {
      console.log(
        '从引用页面pageInst中找不到表单页面，默认不创建增删除改查操作，pageInst：',
        pageInst
      )
      tableInst.props.toolbar = useEmptyToolbarInst()
      tableInst.props.columnActions = useEmptyColumnActionsInst()
    }
    tableInst.props.columns = useColumnsInst(options)
    tableInst.props.query = useQueryInst(options)
    page.children.push(tableInst)
    return page
  }
}
