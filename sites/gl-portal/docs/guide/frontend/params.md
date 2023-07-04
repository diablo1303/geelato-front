# 参数





## 页面参数



页面参数有：

pageStatus：read | edit | undefined

```javascript
// 在各组件中可以获取该参数值
const isRead = pageProvideProxy.getParamValue('pageStatus') === 'read'
```