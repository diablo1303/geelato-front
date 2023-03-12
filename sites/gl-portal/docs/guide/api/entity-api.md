# 基于实体元数据的增删改查



基于实体元数据，快速实现增删改查，提供多查询条件动态构建能力。

先引入`entityApi`，即Mql的客户端实现，具体参考Mql章节。

```typescript
 import {entityApi} from "packages/gl-ui/src/index";
```

基础的查询示例

```typescript
// platform_tree_node：实体名称
// id key,title,pid,iconType,type nodeType：查询的字段，id key即为将查询结果列id重命名为key
// {pid:'1976169388038462609'} 查询参数
// false：查询结果不同时返回元数据，true时，则需要返回
entityApi.query('platform_tree_node', 'id key,title,pid,iconType,type nodeType', {pid:'1976169388038462609'}, false).then((res) => {
  console.log('platform_tree_node:', res)
})
// 该示例，调用的是后台服务 https://localhost:8080/api/meta/list?withMeta=false
```

 对应后台的`Controller`为：`org.geelato.web.platform.m.base.rest.MetaController`

更多的用法详见：
`@geelato/gl-ui/src/m/datasource/EntityApi.ts`
