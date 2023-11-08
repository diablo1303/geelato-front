import { entityApi, FieldMeta, utils } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { useComponentStore } from '@geelato/gl-ide'
import { PageCreator, PageCreatorOptions } from './PageCreator'
import { useFieldMetaToComponentInst } from './useFieldMetaToComponentInst'

const useToolbarInst = (
  options: PageCreatorOptions,
  tableInst: ComponentInstance,
  formInst: ComponentInstance
) => {
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
                pageTitle: '指令',
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
                            extendId: `${options.pageInfo.pageExtendId}`,
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

const useQueryInst = (options: PageCreatorOptions) => {
  const insts = useFieldMetaToComponentInst(options.entityMeta.entityName, options.queryFields)

  const items: any[] = []
  insts.forEach((inst: ComponentInstance, index: number) => {
    const fieldMeta = options.queryFields[index]

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

const useColumnActionsInst = (options: PageCreatorOptions) => {
  const pageExtendId = options.pageInfo.pageExtendId
  const paramFormId = utils.gid()
  const paramPageStatusId = utils.gid()
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
        body: `const content = $gl.fn.loadPage("","${pageExtendId}",[{"id":"${paramFormId}","name":"form.id","valueExpression":"$gl.ctx.record.id"},{"id":"${paramPageStatusId}","name":"page.status","valueExpression":"\\"read\\""}],"read");
            $gl.fn.openDrawer({
                title:"详细信息",
                content: content,
                width:"1024px",
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
            pageTitle: '指令',
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
                extendId: pageExtendId,
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

  return actions
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
    const formInst: ComponentInstance = options.pageInfo.pageExtendContent
    tableInst.props.toolbar = useToolbarInst(options, tableInst, formInst)
    tableInst.props.columns = useColumnsInst(options)
    tableInst.props.columnActions = useColumnActionsInst(options)
    tableInst.props.query = useQueryInst(options)
    page.children.push(tableInst)
    return page
  }
}
