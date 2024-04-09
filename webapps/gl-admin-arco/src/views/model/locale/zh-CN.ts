export default {
  // webapps/gl-admin-arco/src/views/model/connect - list|form
  'model.connect.index.menu.list': '模型管理',
  'model.dataBase.index.menu.list': '数据模型',
  'model.connect.index.menu.list.searchTable': '数据连接',
  // webapps/gl-admin-arco/src/views/model/connect - list|form
  'model.connect.index.form.index': '序号',
  'model.connect.index.form.dbConnectName': '连接名称',
  'model.connect.index.form.dbSchema': '数据库模式',
  'model.connect.index.form.dbType': '数据库类型',
  'model.connect.index.form.dbName': '数据库名',
  'model.connect.index.form.dbHostnameIp': '主机名或IP',
  'model.connect.index.form.dbPort': '连接端口',
  'model.connect.index.form.dbUserName': '用户名',
  'model.connect.index.form.dbPassword': '密码',
  'model.connect.index.form.enableStatus': '状态',
  'model.connect.index.form.enableStatus.0': '禁用',
  'model.connect.index.form.enableStatus.1': '启用',
  'model.connect.index.form.createAt': '创建时间',
  'model.connect.index.form.operations': '操作',
  // webapps/gl-admin-arco/src/views/model/connect - form.operation
  'model.connect.index.model.title.add': '新建数据连接',
  'model.connect.index.model.title.edit': '编辑数据连接',
  'model.connect.index.model.title.view': '查看数据连接',
  'model.connect.index.model.title.delete': '删除数据连接',
  'model.connect.index.model.title.link': '连接测试',
  'model.connect.index.model.title.link.success': '连接成功！',
  'model.connect.index.model.title.link.fail': '连接失败！',
  'model.connect.index.model.sync.copy': '复制模型',
  'model.connect.index.model.sync.model': '从数据库同步至模型',
  'model.connect.index.model.sync.table': '从模型同步至数据库',
  'model.connect.index.model.sync.more': '更多',
  'model.connect.index.model.info.refresh': '刷新成功！',
  'model.connect.index.model.info.swap': '交换成功！',
  'model.connect.index.model.cancel.text': '取消',
  'model.connect.index.model.ok.text': '确认',

  // webapps/gl-admin-arco/src/views/model/table - list|form
  'model.table.index.menu.list': '模型管理',
  'model.table.index.menu.list.searchTable': '数据表格',
  // webapps/gl-admin-arco/src/views/model/table - list|form
  'model.table.index.form.index': '序号',
  'model.table.index.form.title': '名称(中文)',
  'model.table.index.form.tableName': '数据库表名',
  'model.table.index.form.tableName.yes': '已同步',
  'model.table.index.form.tableName.edit': '未同步',
  'model.table.index.form.tableName.no': '未创建',
  'model.table.index.form.entityName': '实体名称',
  'model.table.index.form.linked': '连接状态',
  'model.table.index.form.linked.1': '已连接',
  'model.table.index.form.linked.0': '未连接',
  'model.table.index.form.sourceType': '来源',
  'model.table.index.form.sourceType.platform': '平台内置',
  'model.table.index.form.sourceType.system': '系统内置',
  'model.table.index.form.sourceType.creation': '应用创建',
  'model.table.index.form.tableType': '表格类型',
  'model.table.index.form.tableType.table': '数据库表',
  'model.table.index.form.tableType.entity': '实体',
  'model.table.index.form.tableType.view': '视图',
  'model.table.index.form.appId': '所属应用',
  'model.table.index.form.enableStatus': '状态',
  'model.table.index.form.enableStatus.0': '禁用',
  'model.table.index.form.enableStatus.1': '启用',
  'model.table.index.form.seqNo': '排序',
  'model.table.index.form.viewSql': '视图语句',
  'model.table.index.form.tableComment': '数据库注释',
  'model.table.index.form.description': '补充描述',
  'model.table.index.form.createAt': '创建时间',
  'model.table.index.form.operations': '操作',
  'model.table.index.form.viewSql.edit': '编辑视图语句',
  // webapps/gl-admin-arco/src/views/model/table - form.operation
  'model.table.index.model.title.add': '新建数据表',
  'model.table.index.model.title.edit': '编辑数据表',
  'model.table.index.model.title.view': '查看数据表',
  'model.table.index.model.title.delete': '删除数据表',
  'model.table.index.model.title.sync.data': '更新数据模型',
  'model.table.index.model.title.init.data': '同步应用所有模型至数据库',
  'model.table.index.model.title.init.dataMsg': '是否将应用所有模型同步至数据库？',
  'model.table.index.model.title.sync.model': '更新数据库表单',
  'model.table.index.model.cancel.text': '取消',
  'model.table.index.model.ok.text': '确认',
  'searchTable.tables.operations.alter': '变更',
  'searchTable.tables.operations.copy': '复制',
  'searchTable.tables.operations.sourceType.warning': '系统内置表不可编辑',
  'searchTable.tables.operations.alter.warning': '变更“实体名称”并同步至数据库',
  // eslint-disable-next-line no-template-curly-in-string
  'model.table.index.modal.table.content': '是否将数据库表同步至模型中？',
  'model.table.index.modal.model.content': '是否将模型同步至数据库中？',
  'model.table.index.notice.update.success': '更新成功！',
  'model.table.index.notice.update.fail': '更新失败！',

  // webapps/gl-admin-arco/src/views/model/view - list|form
  'model.view.index.menu.list': '模型管理',
  'model.view.index.menu.list.searchTable': '模型视图',
  // webapps/gl-admin-arco/src/views/model/view - list|form
  'model.view.index.form.index': '序号',
  'model.view.index.form.entityName': '实体名称',
  'model.view.index.form.entityName.valid': '这是’默认视图‘的名称',
  'model.view.index.form.title': '名称(中文)',
  'model.view.index.form.viewName': '名称(英文)',
  'model.view.index.form.viewType': '视图类型',
  'model.view.index.form.viewType.default': '默认视图',
  'model.view.index.form.viewType.custom': '自定义视图',
  'model.view.index.form.linked': '连接状态',
  'model.view.index.form.linked.1': '已连接',
  'model.view.index.form.linked.0': '未连接',
  'model.view.index.form.appId': '所属应用',
  'model.view.index.form.enableStatus': '状态',
  'model.view.index.form.enableStatus.0': '禁用',
  'model.view.index.form.enableStatus.1': '启用',
  'model.view.index.form.seqNo': '排序',
  'model.view.index.form.viewConstruct': '视图语句',
  'model.view.index.model.viewSql.valid.success': '验证成功！',
  'model.view.index.model.viewSql.valid.fail': '验证失败，请检查Sql的正确性。',
  'model.view.index.form.description': '补充描述',
  'model.view.index.form.createAt': '创建时间',
  'model.view.index.form.operations': '操作',
  'model.view.index.form.viewConstruct.edit': '编辑视图语句',
  'model.view.index.form.viewConstruct.validate': '验证',
  'model.view.index.form.viewConstruct.validateMsg': '是否验证视图语句有效性？',
  // webapps/gl-admin-arco/src/views/model/view - form.operation
  'model.view.index.model.title.add': '新建视图',
  'model.view.index.model.title.edit': '编辑视图',
  'model.view.index.model.title.view': '查看视图',
  'model.view.index.model.title.delete': '删除视图',
  'model.view.index.model.cancel.text': '取消',
  'model.view.index.model.ok.text': '确认',
  'searchTable.columns.operations.release': '发布',
  'searchTable.columns.operations.permission': '权限',
  'searchTable.columns.operations.releaseMsg': '是否发布该条视图？',
  'model.view.index.model.info.reset': '重置成功！',
  'model.view.index.model.info.release': '发布成功！',
  'model.view.index.form.operations.noRel': '表格未同步至数据库，不能发布！',
  'model.view.index.form.entity.custom': '自定义字段',
  'model.view.index.form.entity.model': '模型字段',
  'model.view.index.form.entity.tableId': '模型',
  'model.view.index.form.entity.columnIds': '字段',
  // webapps/gl-admin-arco/src/views/model/foreign - list|form
  'model.foreign.index.menu.list': '模型管理',
  'model.foreign.index.menu.list.searchTable': '模型外键',
  'model.foreign.index.menu.list.tab.tip': '仅展示表格之间的关联，不同步至数据表中。',
  // webapps/gl-admin-arco/src/views/model/foreign - list|form
  'model.foreign.index.form.index': '序号',
  'model.foreign.index.form.mainTable': '主表表名',
  'model.foreign.index.form.mainTableCol': '主表字段',
  'model.foreign.index.form.foreignTable': '外表表名',
  'model.foreign.index.form.foreignTableCol': '外表字段',
  'model.foreign.index.form.updateAction': '更新时',
  'model.foreign.index.form.deleteAction': '删除时',
  'model.foreign.index.form.action.tip': 'RESTRICT && NO ACTION：子表有关联记录，父表不能更新或删除；SET NULL：父表在更新或删除时，子表的对应字段被设为‘NULL’；CASCADE：父表在更新或删除时，更新或删除子表对应记录。',
  'model.foreign.index.form.enableStatus': '状态',
  'model.foreign.index.form.enableStatus.0': '禁用',
  'model.foreign.index.form.enableStatus.1': '启用',
  'model.foreign.index.form.seqNo': '排序',
  'model.foreign.index.form.description': '备注',
  'model.foreign.index.form.createAt': '创建时间',
  'model.foreign.index.form.operations': '操作',
  // webapps/gl-admin-arco/src/views/model/foreign - form.operation
  'model.foreign.index.model.title.add': '新建外键',
  'model.foreign.index.model.title.edit': '编辑外键',
  'model.foreign.index.model.title.view': '查看外键',
  'model.foreign.index.model.cancel.text': '取消',
  'model.foreign.index.model.ok.text': '确认',

  // webapps/gl-admin-arco/src/views/model/column - list|form
  'model.column.index.menu.list': '模型管理',
  'model.column.index.menu.list.searchTable': '模型字段',
  // webapps/gl-admin-arco/src/views/model/column - list|form
  'model.column.index.form.index': '序号',
  'model.column.index.form.tableSchema': '数据模式',
  'model.column.index.form.tableName': '表名',
  'model.column.index.form.appId': '所属应用',
  'model.column.index.form.tableCatalog': '表目录',
  'model.column.index.form.title': '名称(中文)',
  'model.column.index.form.fieldName': '名称(英文)',
  'model.column.index.form.fieldName.placeholder': '根据 “字段标识” 生成',
  'model.column.index.form.name': '字段标识',
  'model.column.index.form.comment': '注释(中文)',
  'model.column.index.form.ordinalPosition': '次序',
  'model.column.index.form.defaultValue': '默认值',
  'model.column.index.form.defaultRange': '默认范围',
  'model.column.index.form.defaultMaxValue': '最大值',
  'model.column.index.form.type': '数据约束',
  'model.column.index.form.key': '是否主键',
  'model.column.index.form.key.1': '是',
  'model.column.index.form.key.0': '否',
  'model.column.index.form.key.true': '是',
  'model.column.index.form.key.false': '否',
  'model.column.index.form.nullable': '是否可空',
  'model.column.index.form.nullable.1': '是',
  'model.column.index.form.nullable.0': '否',
  'model.column.index.form.nullable.true': '是',
  'model.column.index.form.nullable.false': '否',
  'model.column.index.form.dataType': '数据类型',
  'model.column.index.form.dataType.BIT': '布尔值',
  'model.column.index.form.dataType.VARCHAR': '文本[0-65535]',
  'model.column.index.form.dataType.TEXT': '富文本|文章',
  'model.column.index.form.dataType.LONGTEXT': '脚本',
  'model.column.index.form.dataType.TINYINT': '小整数[0-127]',
  'model.column.index.form.dataType.INT': '整数[0-2147483647]',
  'model.column.index.form.dataType.BIGINT': '大整数',
  'model.column.index.form.dataType.DECIMAL': '小数',
  'model.column.index.form.dataType.YEAR': '年份[YYYY]',
  'model.column.index.form.dataType.DATE': '日期[YYYY-MM-DD]',
  'model.column.index.form.dataType.TIME': '时间[HH:MM:SS]',
  'model.column.index.form.dataType.DATETIME': '日期时间[YYYY-MM-DD HH:MM:SS]',
  'model.column.index.form.dataType.TIMESTAMP': '时间戳[YYYY-MM-DD HH:MM:SS]',
  'model.column.index.form.extra': '特别',
  'model.column.index.form.autoAdd': '自动添加',
  'model.column.index.form.autoAdd.0': '否',
  'model.column.index.form.autoAdd.1': '是',
  'model.column.index.form.autoAdd.tip': '组织、用户需要一对字段用于存放主键和名称',
  'model.column.index.form.autoAdd.title': '自动添加 ‘id’ 或 ‘name’ 字段。',
  'model.column.index.form.autoName': '添加标识',
  'model.column.index.form.autoName.tip': '字段标识，用于存放对应的主键或名称；配置一致。',
  'model.column.index.form.autoIncrement': '自动递增',
  'model.column.index.form.autoIncrement.1': '是',
  'model.column.index.form.autoIncrement.0': '否',
  'model.column.index.form.uniqued': '唯一约束',
  'model.column.index.form.uniqued.1': '是',
  'model.column.index.form.uniqued.0': '否',
  'model.column.index.form.uniqued.true': '是',
  'model.column.index.form.uniqued.false': '否',
  'model.column.index.form.encrypted': '是否加密',
  'model.column.index.form.encrypted.0': '否',
  'model.column.index.form.encrypted.1': '是',
  'model.column.index.form.encrypted.false': '否',
  'model.column.index.form.encrypted.true': '是',
  'model.column.index.form.charMaxLength': '长度',
  'model.column.index.form.numericPrecision': '整数位',
  'model.column.index.form.numericScale': '小数位',
  'model.column.index.form.numericSigned': '是否有符号',
  'model.column.index.form.numericSigned.1': '是',
  'model.column.index.form.numericSigned.0': '否',
  'model.column.index.form.numericSigned.true': '是',
  'model.column.index.form.numericSigned.false': '否',
  'model.column.index.form.datetimePrecision': '时间类型',
  'model.column.index.form.isRefColumn': '是否是外键',
  'model.column.index.form.refLocalCol': '本表字段',
  'model.column.index.form.refTables': '外表表名',
  'model.column.index.form.refColName': '外表字段',
  'model.column.index.form.linked': '连接状态',
  'model.column.index.form.linked.1': '已连接',
  'model.column.index.form.linked.0': '未连接',
  'model.column.index.form.enableStatus': '状态',
  'model.column.index.form.enableStatus.0': '禁用',
  'model.column.index.form.enableStatus.1': '启用',
  'model.column.index.form.seqNo': '排序',
  'model.column.index.form.description': '注释(英文)',
  'model.column.index.form.createAt': '创建时间',
  'model.column.index.form.operations': '操作',
  'model.column.index.form.operations.disabled': '系统字段不可编辑',
  'model.column.index.form.name.synced': '还未同步至数据库',
  'model.column.index.form.name.key': '主键',
  'searchTable.columns.operations.all': '全选',
  'searchTable.columns.operations.add': '添加',
  'searchTable.columns.operations.add.warning': '请至少选择一项！',
  'searchTable.columns.operations.addCom': '添加常用字段',
  'searchTable.columns.operations.addModel': '添加模型字段',
  'searchTable.columns.operations.alter': '变更',
  'searchTable.columns.operations.alter.warning': '变更“实体名称”，更新后会同步至数据库',
  'searchTable.columns.operations.switch.tip': '隐藏基础字段如’id‘、’creator‘...',
  'model.column.index.form.m.title': '名称',
  'model.column.index.form.m.title.p': '中文，如：‘创建时间’。',
  'model.column.index.form.m.fieldName': '名称',
  'model.column.index.form.m.fieldName.p': '英文，如：‘createTime’的驼峰规则字符串。',
  'model.column.index.form.m.dataType': '类型',
  // webapps/gl-admin-arco/src/views/model/column - form.operation
  'model.column.index.model.title.add': '新建字段',
  'model.column.index.model.title.edit': '编辑字段',
  'model.column.index.model.title.view': '查看字段',
  'model.column.index.model.cancel.text': '取消',
  'model.column.index.model.ok.text': '确认',

  'model.column.index.multi.add.text': '新增',
  'model.column.index.multi.save.text': '保存',
  'model.column.index.multi.edit.text': '编辑',
  'model.column.index.multi.delete.text': '删除',
  'model.column.index.multi.valid.text': '请补全必填数据',

  'model.table.permission.index.menu.list.searchTable': '模型权限',
  'model.table.permission.index.model.role.add': '新增角色',
  'model.table.permission.index.model.permission.add': '查看权限（自定义）',
  'model.table.permission.index.model.permission.reset': '重置默认权限',
  'model.table.permission.index.model.refresh': '刷新',
  'model.table.permission.index.list.role': '角色',

  'model.column.permission.index.menu.list.searchTable': '字段权限',
  'model.column.permission.index.model.role.add': '新增角色',
  'model.column.permission.index.model.column.add': '新增模型字段',
  'model.column.permission.index.model.permission.reset': '重置默认权限',
  'model.column.permission.index.model.refresh': '刷新',
  'model.column.permission.index.list.role': '角色',
  'model.column.permission.columnPermission.0': '可编辑',
  'model.column.permission.columnPermission.1': '不可编辑',
  'model.column.permission.columnPermission.2': '不可查看',
  'model.column.permission.index.form.key': '主键',
  'model.column.permission.index.form.uniqued': '唯一约束',
  'model.column.permission.index.form.numericSigned': '无符号',
  'model.column.permission.index.form.nullable.true': '可为空',
  'model.column.permission.index.form.nullable.false': '不可为空',
  'model.column.permission.index.form.name': '标识',
  'model.column.permission.index.form.dataType': '类型',
  'model.column.permission.index.form.type': '约束',
  'model.column.permission.index.form.comment': '注释',


  /* 是否 */
  'model.column.index.form.yes': '是',
  'model.column.index.form.no': '否',
  'searchTable.actions.swap': '交换',
  /* 验证 */
  'model.form.rules.match.required': '这是必填项',
  'model.form.rules.match.entityName.match': '匹配：‘a-z’、‘A-Z’、‘0-9’、‘_’',
  'model.form.rules.match.columnName.match': '匹配：‘a-z’、‘0-9’、‘_’',
  'model.form.rules.match.viewName.match': '不以‘v_’、‘V_’开头',
  'model.form.rules.match.viewSql.match': '匹配：’select * from table_name ...‘',
  'model.form.rules.match.length.title': '长度',
  'model.form.rules.match.max.title': '最大值',
};