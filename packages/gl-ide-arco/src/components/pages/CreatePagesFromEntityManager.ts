/**
 *  从模型中创建页面
 *  选择一个模型，创建列表、创建表单，并创建两者的关联事件
 */
export default class CreatePagesFromEntityManager {


    createPageSource(options: CreatePageOptions) {
        // 获取实体元数据


        // 获取列表模板


        // 获取表单模板

    }
}

export class CreatePageOptions {
    entityName: string = ''
    listPageId:string = ''
    listTitle: string = ''
    listId:string = ''
    formPageId:string = ''
    formTitle: string = ''
    formId: string = ''
}