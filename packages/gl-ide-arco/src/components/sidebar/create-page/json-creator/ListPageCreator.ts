import { FieldMeta, utils } from '@geelato/gl-ui'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import { useComponentStore } from '@geelato/gl-ide'
import { PageCreator, PageCreatorOptions } from './PageCreator'
import {useFieldMetaToComponentInst} from "./useFieldMetaToComponentInst";

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
                title:"${formInst.props.label}",
                content: content,
                width:"1024px",
                okText:"保存",
                onBeforeOk: async ()=>{
                    try{
                        return   $gl.fn.invokeComponentMethod("${formInst.id}","submitForm",[]);
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
                    title: `${formInst.props.label}`,
                    params: [],
                    okText: '保存',
                    hideCancel: true,
                    invokeBlocks: ['onBeforeOk', 'onClose'],
                    width: '1024px',
                    pageStatus: 'create'
                  },
                  propsExpress: {},
                  slots: {},
                  slotsExpress: {},
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
                          propsExpress: {},
                          slots: {},
                          slotsExpress: {},
                          children: [],
                          actions: [],
                          style: {},
                          propsWrapper: '',
                          i18n: [],
                          valueExpress: '',
                          __validateError: null,
                          __dragFlag: utils.gid('dragFlag'),
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
                          propsExpress: {},
                          slots: {},
                          slotsExpress: {},
                          children: [],
                          actions: [],
                          style: {},
                          propsWrapper: '',
                          i18n: [],
                          valueExpress: '',
                          __validateError: null,
                          __dragFlag: utils.gid('dragFlag'),
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
                  valueExpress: '',
                  __validateError: null,
                  __dragFlag: utils.gid('dragFlag'),
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
        valueExpress: '',
        __validateError: null,
        __dragFlag: '',
        propsExpressions: {},
        slotsExpressions: {}
      }
    ],
    centerItems: [],
    rightItems: []
  }
}

const useQueryInst = (options: PageCreatorOptions) => {

  const insts = useFieldMetaToComponentInst(options.entityMeta.entityName,options.queryFields)

  const items: any[] = []
  insts.forEach((inst: ComponentInstance,index:number) => {
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
    const formInst: ComponentInstance = new ComponentInstance()
    tableInst.props.toolbar = useToolbarInst(options, tableInst, formInst)
    tableInst.props.columns = useColumnsInst(options)
    tableInst.props.query = useQueryInst(options)
    page.children.push(tableInst)
    return page
  }
}
