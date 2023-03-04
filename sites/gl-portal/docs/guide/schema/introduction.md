# 1 概述
## 1.1 版本号
V0.0.1
## 1.2 范围
本协议描述的是低代码搭建平台产物（应用、页面、区块、组件）的 schema 结构，以及实现其数据状态更新（内置 api)、能力扩展、国际化等方面完整，只在低代码搭建场景下可用；
## 1.3 名词术语
- 基础组件（Basic Component）：前端领域通用的基础组件，阿里巴巴前端委员会官方指定的基础组件库是 Fusion Next/AntD。
- 图表组件（Chart Component）：前端领域通用的图表组件，有代表性的图表组件库有 BizCharts。
- 业务组件（Business Component）：业务领域内基于基础组件之上定义的组件，可能会包含特定业务域的交互或者是业务数据，对外仅暴露可配置的属性，且必须发布到公域（如阿里 NPM）；在同一个业务域内可以流通，但不需要确保可以跨业务域复用。
- 低代码业务组件（Low-Code Business Component）：通过低代码编辑器搭建而来，有别于源码开发的业务组件，属于业务组件中的一种类型，遵循业务组件的定义；同时低代码业务组件还可以通过低代码编辑器继续多次编辑。
- 布局组件（Layout Component）：前端领域通用的用于实现基础组件、图表组件、业务组件之间各类布局关系的组件，如三栏布局组件。
- 区块（Block）：通过低代码搭建的方式，将一系列业务组件、布局组件进行嵌套组合而成，不对外提供可配置的属性。可通过 区块容器组的包裹，实现区块内部具备有完整的样式、事件、生命周期管理、状态管理、数据流转机制。能独立存在和运行，可通过复制 schema 实现跨页面、跨应用的快速复用，保障功能和数据的正常。
- 页面（Page）：由组件 + 区块组合而成。由页面容器组件包裹，可描述页面级的状态管理和公共函数。
- 模板（Template）：特定垂直业务领域内的业务组件、区块可组合为单个页面，或者是再配合路由组合为多个页面集，统称为模板。

# 2 协议结构
协议最顶层结构如下，包含5方面的描述内容：
- componentsMap { Array } 组件映射关系
- componentsTree { Array } 描述模版/页面/区块/低代码业务组件的组件树
- utils { Array } 工具类扩展映射关系
- i18n { Object } 国际化语料
- events { Array } 事件动作
## 2.1 组件映射关系

## 2.2 组件树
```json
{
  "componentName": "GlRoot",
  "id": "GlRoot_52crUdOYa",
  "props": {},
  "children": [
    {
      "title": "布局12-12",
      "componentName": "GlRow",
      "group": "layout",
      "props": {},
      "children": [
        {
          "componentName": "GlCol",
          "props": { "span": 12 },
          "children": [
            {
              "title": "标签页",
              "componentName": "GlTabs",
              "group": "layout",
              "props": {},
              "children": [
                {
                  "componentName": "GlTabPane",
                  "props": { "tab": "tab1" },
                  "children": [
                    {
                      "componentName": "AButton",
                      "id": "aBtn_kcyrZTTxBhN",
                      "templateId": "Dfl0TDrcD0itS6iT",
                      "title": "按钮",
                      "group": "form",
                      "props": { "type": "primary" },
                      "slots": {
                        "icon": {
                          "handler": "ComponentHandler",
                          "componentName": "GlIconfont",
                          "props": { "type": "gl-setting", "text": "按钮" }
                        }
                      },
                      "children": []
                    }
                  ],
                  "id": "26LDzXi6D44tBPns"
                },
                {
                  "componentName": "GlTabPane",
                  "props": { "tab": "tab2" },
                  "children": [
                    {
                      "componentName": "AButton",
                      "id": "aBtn_swcqrqSW9Nu",
                      "templateId": "Dfl0TDrcD0itS6iT",
                      "title": "按钮",
                      "group": "form",
                      "props": { "type": "primary" },
                      "slots": {
                        "icon": {
                          "handler": "ComponentHandler",
                          "componentName": "GlIconfont",
                          "props": { "type": "gl-setting", "text": "按钮" }
                        }
                      },
                      "children": []
                    }
                  ],
                  "id": "6wDOyRRAeG1fuyDz"
                }
              ],
              "id": "tabs_Y92yEoAym4u"
            }
          ],
          "id": "col_nJ4RMP7TwndT"
        },
        {
          "componentName": "GlCol",
          "props": { "span": 12 },
          "children": [
            {
              "componentName": "GlDndPlaceholder",
              "id": "pHolder_qQRhA0BU",
              "props": {}
            }
          ],
          "id": "col_iInQmFUKFTe2"
        }
      ],
      "id": "row_2yiXITtHIT2p"
    }
  ]
}
```
## 2.5 国际化多语言支持
```json
{
  "i18n": {
    "zh-CN": {
      "i18n-jwg27yo4": "你好",
      "i18n-jwg27yo3": "中国"
    },
    "en-US": {
      "i18n-jwg27yo4": "Hello",
      "i18n-jwg27yo3": "China"
    }
  }
}
```
