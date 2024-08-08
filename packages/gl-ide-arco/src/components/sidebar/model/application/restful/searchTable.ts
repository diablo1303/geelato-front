import {computed} from 'vue';
import type {SelectOptionData} from "@arco-design/web-vue";

const jsString: string = "function createOneTableJs(params) {\n" +
  "  let sql = new Array();\n" +
  "  sql.push(\"CREATE TABLE IF NOT EXISTS \" + params.tableName + \" (id bigint(20) NOT NULL AUTO_INCREMENT,PRIMARY KEY (id)) ENGINE=InnoDB\");\n" +
  "  sql.push(\"DEFAULT CHARSET=utf8;\");\n" +
  "  sql.push(\"ALTER TABLE \" + params.tableName);\n" +
  "  for (let i in params.addlist) {\n" +
  "    sql.push(\"ADD COLUMN \");\n" +
  "    sql.push(params.addlist[i].name);\n" +
  "    sql.push(\" \")\n" +
  "    sql.push(params.addlist[i].type)\n" +
  "    if (!params.addlist[i].nullable) sql.push(\"not null\");\n" +
  "    if (params.addlist[i].defaultValue != null) sql.push(\"DEFAULT \" + params.addlist[i].defaultValue);\n" +
  "  }\n" +
  "  for (let i in params.uniqueList) {\n" +
  "    sql.push(\"alter base \" + params.tableName + \" add unique key(`\" + params.uniqueList[i].name + \"`)\");\n" +
  "  }\n" +
  "  return sql.join(\"\\r\\n\");\n" +
  "}";

const sqlString: string = "CREATE TABLE IF NOT EXISTS $.tableName (id bigint(20) NOT NULL AUTO_INCREMENT,PRIMARY KEY (id)) ENGINE=InnoDB\n" +
  "DEFAULT CHARSET=utf8;\n" +
  "ALTER TABLE $.tableName\n" +
  "@for i in $.addList\n" +
  "  ADD COLUMN $.addList[i].name $.addList[i].type\n" +
  "  @if $.addList[i].nullable\n" +
  "    not null\n" +
  "  @/if\n" +
  "  @if $.addList[i].defaultValue!='' && $.addList[i].defaultValue!=null\n" +
  "    DEFAULT $.addList[i].defaultValue\n" +
  "  @/if\n" +
  "  @if i<$.addList.length-1\n" +
  "    ,\n" +
  "  @/if\n" +
  "@/for\n" +
  "@for i in $.uniqueList\n" +
  "  alter table $.tableName add unique key(`$.uniqueList[i].name`);\n" +
  "@/for";

const configTypeOptions = computed<SelectOptionData[]>(() => [
  {label: 'Sql', value: 'sql', other: sqlString},
  {label: 'JavaScript', value: 'javascript', other: jsString},
]);

const getConfigTypeOther = (value: string) => {
  const items = configTypeOptions.value.filter(item => item.value === value);
  return items.length > 0 ? items[0].other : '';
};

export {configTypeOptions, getConfigTypeOther};