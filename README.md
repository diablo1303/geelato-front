# geelato-front

Geelato Projects 是面向企业应用的数字化基座项目，以Geelato Low Code为核心，在其基础上构建了Geelato Admin、Geelato Ones，Geelato Admin是后台应用。Geealto Ones是企业数字化办公入口，内置基础的任务协作等能力，汇聚了所有的Geealto Admin应用，同时还可以集成第三方应用，实现企业数字化应用协同All-in-one。


Geelato Projects 中前端部分在该项目中， 基于Vue3、Vite、Arco Design。

Geelato Admin是基于Arco Pro Vue的扩展，提供企业后台应用中常用到的页面及组合，快速实现CRUD等管理。引入页面组件、卡片式布局、JSON化配置、基于元数据的MQL，结合内置的后台常规API，便于实现灵活的界面设计器，实现轻代码化开发。


## 环境准备
基于pnpm进行多包管理

## 工程结构

├─ packages                               打包成组件库的工程
    ├─ gl-ide                                 IDE的核心框架
    ├─ gl-ide-arco                        采用arco-design库，基于gl-ide扩展
    ├─ gl-ui                                   核心ui库
    ├─ gl-ui-arco                          arco-design版的组件库
    ├─ gl-ui-arco-admin              所有webapps中的gl-admin-arco-xxx工程共用的组件库
    ├─ gl-ui-schema                    对应gl-ui的组件配置器定义
    ├─ gl-ui-schema-arco           对应gl-ui-arco的组件配置器定义

├─ webapps
           //  面向开发者，设计时（design-time）
    ├─ gl-admin-arco-dt-std       standard 标准版，用于开源
    ├─ gl-admin-arco-dt-pro      Professional 专业版
    ├─ gl-admin-arco-dt-ent      enterprise 企业版
           // 面向最终用户，运行时（runtime）
    ├─ gl-admin-arco-rt-std       standard 标准版，用于开源
    ├─ gl-admin-arco-rt-pro      Professional 专业版
    ├─ gl-admin-arco-rt-ent       enterprise 企业版

