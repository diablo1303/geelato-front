export default {
  // webapps/gl-admin-arco/src/views/model/connect - list|form
  'model.connect.index.menu.list': 'Model',
  'model.dataBase.index.menu.list': 'Data Model',
  'model.connect.index.menu.list.searchTable': 'Data Link',
  // webapps/gl-admin-arco/src/views/model/connect - list|form
  'model.connect.index.form.index': 'index',
  'model.connect.index.form.dbConnectName': 'connectName',
  'model.connect.index.form.dbSchema': 'schema',
  'model.connect.index.form.dbType': 'type',
  'model.connect.index.form.dbName': 'name',
  'model.connect.index.form.dbHostnameIp': 'hostOrIp',
  'model.connect.index.form.dbPort': 'port',
  'model.connect.index.form.dbUserName': 'userName',
  'model.connect.index.form.dbPassword': 'password',
  'model.connect.index.form.apps': 'licenseApps',
  'model.connect.index.form.apps.placeholder': 'Select the application that can use this data link.',
  'model.connect.index.form.apps.extra': 'Select the application that can use this data link. After authorization, the application can create a model under this link. Exercise caution when performing this operation.',
  'model.connect.index.form.enableStatus': 'status',
  'model.connect.index.form.enableStatus.0': 'disabled',
  'model.connect.index.form.enableStatus.1': 'enabled',
  'model.connect.index.form.createAt': 'createTime',
  'model.connect.index.form.operations': 'operation',
  // webapps/gl-admin-arco/src/views/model/connect - form.operation
  'model.connect.index.model.title.add': 'Add Data Link',
  'model.connect.index.model.title.edit': 'Edit Data Link',
  'model.connect.index.model.title.view': 'View Data Link',
  'model.connect.index.model.title.delete': 'Delete Data Link',
  'model.connect.index.model.title.link': 'Link Test',
  'model.connect.index.model.title.link.success': 'The connection is successful！',
  'model.connect.index.model.title.link.fail': 'The connection is failed！',
  'model.connect.index.model.sync.copy': 'Copy Model',
  'model.connect.index.model.sync.model': 'Sync from database to model',
  'model.connect.index.model.sync.table': 'Sync from model to database',
  'model.connect.index.model.sync.more': 'More',
  'model.connect.index.model.info.refresh': 'Refresh Successfully！',
  'model.connect.index.model.info.swap': 'Swap Successfully！',
  'model.connect.index.model.cancel.text': 'Cancel',
  'model.connect.index.model.ok.text': 'Confirm',

  // webapps/gl-admin-arco/src/views/model/table - list|form
  'model.table.index.menu.list': 'Model',
  'model.table.index.menu.list.searchTable': 'Data Table',
  // webapps/gl-admin-arco/src/views/model/table - list|form
  'model.table.index.form.index': 'index',
  'model.table.index.form.title': 'title',
  'model.table.index.form.tableName': 'tableName',
  'model.table.index.form.tableName.yes': 'synchronized',
  'model.table.index.form.tableName.edit': 'unSynchronized',
  'model.table.index.form.tableName.no': 'unCrated',
  'model.table.index.form.entityName': 'entityName',
  'model.table.index.form.linked': 'linked',
  'model.table.index.form.linked.1': 'YES',
  'model.table.index.form.linked.0': 'NO',
  'model.table.index.form.sourceType': 'sourceType',
  'model.table.index.form.sourceType.platform': 'Platform Entity',
  'model.table.index.form.sourceType.system': 'System Entity',
  'model.table.index.form.sourceType.creation': 'Creation Model',
  'model.table.index.form.packBusData': 'packBusData',
  'model.table.index.form.tablePack.yes': 'Pack Business Data',
  'model.table.index.form.packBusData.false': 'NO',
  'model.table.index.form.packBusData.true': 'YES',
  'model.table.index.form.packBusData.extra': 'Whether to package business data. When yes is selected, the business data for the model is packaged together and updated into the business data when deployed.',
  'model.table.index.form.tableType': 'tableType',
  'model.table.index.form.tableType.table': 'TABLE',
  'model.table.index.form.tableType.entity': 'ENTITY',
  'model.table.index.form.tableType.view': 'VIEW',
  'model.table.index.form.appId': 'application',
  'model.table.index.form.enableStatus': 'status',
  'model.table.index.form.enableStatus.0': 'disabled',
  'model.table.index.form.enableStatus.1': 'enabled',
  'model.table.index.form.seqNo': 'sequence',
  'model.table.index.form.viewSql': 'viewSql',
  'model.table.index.form.tableComment': 'tableComment',
  'model.table.index.form.description': 'description',
  'model.table.index.form.createAt': 'createTime',
  'model.table.index.form.operations': 'operation',
  'model.table.index.form.viewSql.edit': 'Edit View Sql',
  // webapps/gl-admin-arco/src/views/model/table - form.operation
  'model.table.index.model.title.add': 'Add Data Table',
  'model.table.index.model.title.view': 'View Data Table',
  'model.table.index.model.title.edit': 'Edit Data Table',
  'model.table.index.model.title.delete': 'Add Data Table',
  'model.table.index.model.title.sync.data': 'Update Data Model',
  'model.table.index.model.title.init.data': 'Sync All Applied Models to Database',
  'model.table.index.model.title.init.dataMsg': 'Whether to synchronize all applied models to the database? ',
  'model.table.index.model.title.sync.model': 'Update Data Table',
  'model.table.index.model.cancel.text': 'Cancel',
  'model.table.index.model.ok.text': 'Confirm',
  'searchTable.tables.operations.alter': 'Alter',
  'searchTable.tables.operations.copy': 'Copy',
  'searchTable.tables.operations.sourceType.warning': 'The system table cannot be modified',
  'searchTable.tables.operations.alter.warning': 'Alter “entityName” and synchronize it to the database',
  // eslint-disable-next-line no-template-curly-in-string
  'model.table.index.modal.table.content': 'Whether the database table synchronization to the model？',
  'model.table.index.modal.model.content': 'Whether to synchronize the model to the database？',
  'model.table.index.notice.update.success': 'Update Successfully！',
  'model.table.index.notice.update.fail': 'Update Failure！',

  // webapps/gl-admin-arco/src/views/model/view - list|form
  'model.view.index.menu.list': 'Model',
  'model.view.index.menu.list.searchTable': 'Table View',
  // webapps/gl-admin-arco/src/views/model/view - list|form
  'model.view.index.form.index': 'index',
  'model.view.index.form.entityName': 'entityName',
  'model.view.index.form.entityName.valid': 'This is the ‘default view’ name',
  'model.view.index.form.title': 'title',
  'model.view.index.form.viewName': 'viewName',
  'model.view.index.form.viewType': 'viewType',
  'model.view.index.form.viewType.default': 'Default',
  'model.view.index.form.viewType.custom': 'Custom',
  'model.view.index.form.linked': 'linked',
  'model.view.index.form.linked.1': 'YES',
  'model.view.index.form.linked.0': 'NO',
  'model.view.index.form.appId': 'application',
  'model.view.index.form.enableStatus': 'status',
  'model.view.index.form.enableStatus.0': 'disabled',
  'model.view.index.form.enableStatus.1': 'enabled',
  'model.view.index.form.seqNo': '排序',
  'model.view.index.form.viewConstruct': 'viewSql',
  'model.view.index.model.viewSql.valid.success': 'Successful verification！',
  'model.view.index.model.viewSql.valid.fail': 'Verification failed, Please check the correctness of the Sql！',
  'model.view.index.form.description': 'description',
  'model.view.index.form.createAt': 'createTime',
  'model.view.index.form.operations': 'operation',
  'model.view.index.form.viewConstruct.edit': 'Edit View Sql',
  'model.view.index.form.viewConstruct.validate': 'Validate',
  'model.view.index.form.viewConstruct.validateMsg': 'Whether to verify the validity of view sql？',
  // webapps/gl-admin-arco/src/views/model/view - form.operation
  'model.view.index.model.title.add': 'Add View',
  'model.view.index.model.title.edit': 'Edit View',
  'model.view.index.model.title.view': 'View View',
  'model.view.index.model.title.delete': 'Delete View',
  'model.view.index.model.cancel.text': 'Cancel',
  'model.view.index.model.ok.text': 'Confirm',
  'searchTable.columns.operations.release': 'Release',
  'searchTable.columns.operations.permission': 'Permission',
  'searchTable.columns.operations.releaseMsg': 'Whether to release the view？',
  'model.view.index.model.info.reset': 'Reset Successfully！',
  'model.view.index.model.info.release': 'Release Successfully！',
  'model.view.index.form.operations.noRel': 'The table is not synchronized to the database and cannot be released！',
  'model.view.index.form.entity.custom': 'Custom Column',
  'model.view.index.form.entity.model': 'Model Column',
  'model.view.index.form.entity.tableId': 'Model',
  'model.view.index.form.entity.columnIds': 'Columns',
  // webapps/gl-admin-arco/src/views/model/foreign - list|form
  'model.foreign.index.menu.list': 'Model',
  'model.foreign.index.menu.list.searchTable': 'Table Foreign',
  'model.foreign.index.menu.list.tab.tip': 'Only the associations between tables are displayed and are not synchronized to the data table.',
  // webapps/gl-admin-arco/src/views/model/foreign - list|form
  'model.foreign.index.form.index': 'index',
  'model.foreign.index.form.mainTable': 'mainTable',
  'model.foreign.index.form.mainTableCol': 'mainTableCol',
  'model.foreign.index.form.foreignTable': 'foreignTable',
  'model.foreign.index.form.foreignTableCol': 'foreignTableCol',
  'model.foreign.index.form.updateAction': 'updateAction',
  'model.foreign.index.form.deleteAction': 'deleteAction',
  'model.foreign.index.form.action.tip': 'RESTRICT && NO ACTION：The child table has associated records, and the parent table cannot be updated or deleted；' +
    'SET NULL：When the parent table is updated or deleted, the corresponding field of the child table is set to ‘NULL’；' +
    'CASCADE：When the parent table is updated or deleted, the records corresponding to the child table are updated or deleted。',
  'model.foreign.index.form.enableStatus': 'status',
  'model.foreign.index.form.enableStatus.0': 'disabled',
  'model.foreign.index.form.enableStatus.1': 'enabled',
  'model.foreign.index.form.seqNo': 'sequence',
  'model.foreign.index.form.description': 'description',
  'model.foreign.index.form.createAt': 'createTime',
  'model.foreign.index.form.operations': 'operation',
  // webapps/gl-admin-arco/src/views/model/foreign - form.operation
  'model.foreign.index.model.title.add': 'Add Table Foreign',
  'model.foreign.index.model.title.view': 'View Table Foreign',
  'model.foreign.index.model.title.edit': 'Edit Table Foreign',
  'model.foreign.index.model.cancel.text': 'Cancel',
  'model.foreign.index.model.ok.text': 'Confirm',

  // webapps/gl-admin-arco/src/views/model/column - list|form
  'model.column.index.menu.list': 'Model',
  'model.column.index.menu.list.searchTable': 'Table Column',
  // webapps/gl-admin-arco/src/views/model/column - list|form
  'model.column.index.form.index': 'index',
  'model.column.index.form.tableSchema': 'tableSchema',
  'model.column.index.form.tableName': 'tableName',
  'model.column.index.form.tableCatalog': 'tableCatalog',
  'model.column.index.form.title': 'title',
  'model.column.index.form.fieldName': 'fieldName',
  'model.column.index.form.fieldName.placeholder': 'Generated based on "name"',
  'model.column.index.form.name': 'name',
  'model.column.index.form.appId': 'application',
  'model.column.index.form.comment': 'comment',
  'model.column.index.form.ordinalPosition': 'order',
  'model.column.index.form.defaultValue': 'defaultValue',
  'model.column.index.form.defaultRange': 'defaultRange',
  'model.column.index.form.defaultRange1': 'defaultEntity',
  'model.column.index.form.defaultRange2': 'defaultColumn',
  'model.column.index.form.defaultMaxValue': 'maxValue',
  'model.column.index.form.type': 'restraint',
  'model.column.index.form.key': 'primaryKey',
  'model.column.index.form.key.1': 'YES',
  'model.column.index.form.key.0': 'NO',
  'model.column.index.form.key.true': 'true',
  'model.column.index.form.key.false': 'false',
  'model.column.index.form.nullable': 'nullable',
  'model.column.index.form.nullable.1': 'YES',
  'model.column.index.form.nullable.0': 'NO',
  'model.column.index.form.nullable.true': 'true',
  'model.column.index.form.nullable.false': 'false',
  'model.column.index.form.dataType': 'dataType',
  'model.column.index.form.dataType.BIT': 'Boolean',
  'model.column.index.form.dataType.VARCHAR': 'String[0-65535]',
  'model.column.index.form.dataType.TEXT': 'RichText',
  'model.column.index.form.dataType.LONGTEXT': 'Script',
  'model.column.index.form.dataType.TINYINT': 'tinyInteger[0-127]',
  'model.column.index.form.dataType.INT': 'Integer[0-2147483647]',
  'model.column.index.form.dataType.BIGINT': 'BigInteger',
  'model.column.index.form.dataType.DECIMAL': 'Decimal',
  'model.column.index.form.dataType.YEAR': 'Year[YYYY]',
  'model.column.index.form.dataType.DATE': 'Date[YYYY-MM-DD]',
  'model.column.index.form.dataType.TIME': 'Time[HH:MM:SS]',
  'model.column.index.form.dataType.DATETIME': 'DateTime[YYYY-MM-DD HH:MM:SS]',
  'model.column.index.form.dataType.TIMESTAMP': 'TimeStamp[YYYY-MM-DD HH:MM:SS]',
  'model.column.index.form.extra': 'extra',
  'model.column.index.form.autoAdd': 'autoAdd',
  'model.column.index.form.autoAdd.0': 'NO',
  'model.column.index.form.autoAdd.1': 'YES',
  'model.column.index.form.autoAdd.tip': 'Organizations and users need a pair of fields to hold the primary key and name',
  'model.column.index.form.autoAdd.title': 'Auto Add ‘id’ or ‘name’ column name.',
  'model.column.index.form.autoName': 'autoName',
  'model.column.index.form.autoName.tip': 'Column name，Store the corresponding primary key or name；The configurations are consistent',
  'model.column.index.form.autoIncrement': 'autoIncrement',
  'model.column.index.form.autoIncrement.1': 'YES',
  'model.column.index.form.autoIncrement.0': 'NO',
  'model.column.index.form.uniqued': 'unique',
  'model.column.index.form.uniqued.1': 'YES',
  'model.column.index.form.uniqued.0': 'NO',
  'model.column.index.form.uniqued.true': 'true',
  'model.column.index.form.uniqued.false': 'false',
  'model.column.index.form.encrypted': 'encrypt',
  'model.column.index.form.encrypted.0': 'NO',
  'model.column.index.form.encrypted.1': 'YES',
  'model.column.index.form.encrypted.false': 'false',
  'model.column.index.form.encrypted.true': 'true',
  'model.column.index.form.charMaxLength': 'charMaxLength',
  'model.column.index.form.numericPrecision': 'numericPrecision',
  'model.column.index.form.numericScale': 'numericScale',
  'model.column.index.form.numericSigned': 'numericSigned',
  'model.column.index.form.numericSigned.1': 'YES',
  'model.column.index.form.numericSigned.0': 'NO',
  'model.column.index.form.numericSigned.true': 'true',
  'model.column.index.form.numericSigned.false': 'false',
  'model.column.index.form.datetimePrecision': 'datetimePrecision',
  'model.column.index.form.isRefColumn': 'isRefColumn',
  'model.column.index.form.refLocalCol': 'refLocalCol',
  'model.column.index.form.refTables': 'refTables',
  'model.column.index.form.refColName': 'refColName',
  'model.column.index.form.linked': 'linked',
  'model.column.index.form.linked.1': 'YES',
  'model.column.index.form.linked.0': 'NO',
  'model.column.index.form.enableStatus': 'status',
  'model.column.index.form.enableStatus.0': 'disabled',
  'model.column.index.form.enableStatus.1': 'enabled',
  'model.column.index.form.seqNo': 'sequence',
  'model.column.index.form.description': 'description',
  'model.column.index.form.marker': 'specialMark',
  'model.column.index.form.marker.id': 'primaryKey',
  'model.column.index.form.marker.title': 'title',
  'model.column.index.form.marker.name': 'name',
  'model.column.index.form.marker.code': 'code',
  'model.column.index.form.marker.type': 'type',
  'model.column.index.form.marker.status': 'status',
  'model.column.index.form.marker.remark': 'remark',
  'model.column.index.form.createAt': 'createTime',
  'model.column.index.form.operations': 'operation',
  'model.column.index.form.name.synced': 'Not synchronized to the database',
  'model.column.index.form.name.key': 'Primary Key',
  'model.column.index.form.operations.disabled': 'System fields cannot be edited',
  'searchTable.columns.operations.all': 'Select All',
  'searchTable.columns.operations.add': 'Add',
  'searchTable.columns.operations.add.warning': 'Please select at least one item! ',
  'searchTable.columns.operations.addCom': 'Add Common Column',
  'searchTable.columns.operations.addModel': 'Add Model Column',
  'searchTable.columns.operations.alter': 'Alter',
  'searchTable.columns.operations.alter.warning': 'Change Entity Name. After the update, the entity name will be synchronized to the database',
  'searchTable.columns.operations.switch.tip': 'Hide basic fields such as ‘id’、‘creator’...',
  'model.column.index.form.m.title': 'title',
  'model.column.index.form.m.title.p': 'Chinese，如：‘创建时间’。',
  'model.column.index.form.m.fieldName': 'name',
  'model.column.index.form.m.fieldName.p': 'English，如：‘createTime’的驼峰规则字符串。',
  'model.column.index.form.m.dataType': 'type',
  // webapps/gl-admin-arco/src/views/model/column - form.operation
  'model.column.index.model.title.add': 'Add Table Column',
  'model.column.index.model.title.edit': 'Edit Table Column',
  'model.column.index.model.title.view': 'View Table Column',
  'model.column.index.model.cancel.text': 'Cancel',
  'model.column.index.model.ok.text': 'Confirm',

  'model.column.index.multi.add.text': 'Add',
  'model.column.index.multi.save.text': 'Save',
  'model.column.index.multi.edit.text': 'Edit',
  'model.column.index.multi.delete.text': 'Delete',
  'model.column.index.multi.valid.text': 'Please complete the required data',

  'model.table.permission.index.menu.list.searchTable': 'Table Permission',
  'model.table.permission.index.model.role.add': 'Add Role',
  'model.table.permission.index.model.permission.add': 'Custom Permission',
  'model.table.permission.index.model.permission.reset': 'Reset Default Permission',
  'model.table.permission.index.model.refresh': 'Refresh',
  'model.table.permission.index.list.role': 'Role',

  'model.column.permission.index.menu.list.searchTable': 'Column Permission',
  'model.column.permission.index.model.role.add': 'Add Role',
  'model.column.permission.index.model.column.add': 'Add Column',
  'model.column.permission.index.model.permission.reset': 'Reset Default Permission',
  'model.column.permission.index.model.refresh': 'Refresh',
  'model.column.permission.index.list.role': 'Role',
  'model.column.permission.columnPermission.0': 'Can be edited',
  'model.column.permission.columnPermission.1': 'Not editable',
  'model.column.permission.columnPermission.2': 'Not viewable',
  'model.column.permission.index.form.key': 'PrimaryKey',
  'model.column.permission.index.form.uniqued': 'Unique',
  'model.column.permission.index.form.numericSigned': 'NumericSigned',
  'model.column.permission.index.form.nullable.true': 'Nullable',
  'model.column.permission.index.form.nullable.false': 'NotNull',
  'model.column.permission.index.form.name': 'name',
  'model.column.permission.index.form.dataType': 'dataType',
  'model.column.permission.index.form.type': 'type',
  'model.column.permission.index.form.comment': 'comment',

  'searchTable.actions.swap': 'swap',
  /* 验证 */
  'model.form.rules.match.required': 'this is required',
  'model.form.rules.match.entityName.match': 'Match：‘a-z’、‘A-Z’、‘0-9’、‘_’',
  'model.form.rules.match.columnName.match': 'Match：‘a-z’、‘0-9’、‘_’',
  'model.form.rules.match.viewName.match': 'Not start width‘v_’、‘V_’',
  'model.form.rules.match.viewSql.match': 'Match：’select * from table_name ...‘',
  'model.form.rules.match.length.title': 'length',
  'model.form.rules.match.max.title': 'maxNumber',

  'model.list.role.permission.tip.1': 'If multiple roles of a user have access to model M:',
  'model.list.role.permission.tip.2': 'Give priority to roles with significant power; If the weight is the same, take the first role.',
  'model.list.role.permission.tip.3': 'In the read permission of the role, select a rule with the following priority to query filtered data:',
  'model.list.role.permission.tip.4': 'Custom > See All > See Company/Division > See Department > See Yourself.',
  'model.list.role.permission.tip.5': 'For example, user Zhang SAN has the following roles and read permissions:',
  'model.list.role.permission.tip.6': 'Role A (Weight 5: <Custom> , <See All>).',
  'model.list.role.permission.tip.7': 'Role B (Weight 10, <See Department> , <See Yourself>).',
  'model.list.role.permission.tip.8': 'Finally, the permission of [ Role B > See Department ] is obtained.',

  'searchTable.columns.operations.refresh': 'Refresh',
  'searchTable.columns.operations.refresh.success': 'Flush cache successfully！',
  'searchTable.columns.operations.refresh.connectMsg': 'Whether to refresh the cache of all models and views under this data link？',
  'searchTable.columns.operations.refresh.table': 'Refresh Meta Redis',
  'searchTable.columns.operations.refresh.tableMsg': 'Whether to refresh the cache of all models and views under this data link？',
};
