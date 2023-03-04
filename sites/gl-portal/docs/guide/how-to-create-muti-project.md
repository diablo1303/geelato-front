# 管理多个包



采用Monorepo pnpm模式管理多个包。

### 准备

安装pnpm

`npm install -g pnpm`

[pnpm-workspace.yaml | pnpm](https://pnpm.io/zh/pnpm-workspace_yaml)

安装



### 1. 创建主项目

```bash
X:\geelato-projects>yarn create vue
yarn create v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...

success Installed "create-vue@3.6.0" with binaries:
      - create-vue
[################################] 32/32
Vue.js - The Progressive JavaScript Framework

√ Project name: ... geelato-front
√ Add TypeScript? ... No / Yes
√ Add JSX Support? ... No / Yes
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add Vitest for Unit Testing? ... No / Yes
√ Add an End-to-End Testing Solution? » No
√ Add ESLint for code quality? ... No / Yes

Scaffolding project in D:\ws\geelato\geelato-projects\geelato-front...

Done. Now run:

  cd geelato-front
  yarn
  yarn dev

Done in 83.11s.
```



### 2. 创建子项目 gl-ui

`mkdir ui`

`cd ui`

`yarn create vue` 

```bash
X:\geelato-projects\geelato-front\ui>yarn create vue
yarn create v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Installed "create-vue@3.6.0" with binaries:
      - create-vue
[################################] 32/32
Vue.js - The Progressive JavaScript Framework

√ Project name: ... gl-ui
√ Add TypeScript? ... No / Yes
√ Add JSX Support? ... No / Yes
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add Vitest for Unit Testing? ... No / Yes
√ Add an End-to-End Testing Solution? » No
√ Add ESLint for code quality? ... No / Yes
√ Add Prettier for code formatting? ... No / Yes

Scaffolding project in D:\ws\geelato\geelato-projects\geelato-front\ui\gl-ui...

Done. Now run:

  cd gl-ui
  yarn
  yarn format
  yarn dev

Done in 38.15s.
```



### 2.1. 修改配置

在include中添加`"src/**/*.json"`，以便能import json，否则在build时，会出现这个错误：`Projects must list all files or use an 'include' pattern.`。

```json
// tsconfig.app.json
{
  "extends": "@vue/tsconfig/tsconfig.web.json",
  "include": ["env.d.ts", "src/**/*","src/**/*.json", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```



### 2.2. 安装依赖

```shell
yarn add axios
yarn add mitt
yarn add @ant-design/icons-vue
yarn add -D path
yarn install
```



### 3. 创建子项目 gl-ui-arco

```shell
X:\geelato-projects\geelato-front\ui>yarn create vue
yarn create v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Installed "create-vue@3.6.0" with binaries:
      - create-vue
[################################] 32/32
Vue.js - The Progressive JavaScript Framework

√ Project name: ... gl-ui-arco
√ Add TypeScript? ... No / Yes
√ Add JSX Support? ... No / Yes
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add Vitest for Unit Testing? ... No / Yes
√ Add an End-to-End Testing Solution? » No
√ Add ESLint for code quality? ... No / Yes
√ Add Prettier for code formatting? ... No / Yes

Scaffolding project in D:\ws\geelato\geelato-projects\geelato-front\ui\gl-ui-arco...

Done. Now run:

  cd gl-ui-arco
  yarn
  yarn format
  yarn dev

Done in 28.00s.
```

### 2.2. 安装依赖

```shell
pnpm add @arco-design/web-vue
pnpm add @geelato/gl-ui
pnpm add sortablejs

pnpm add -D path
pnpm install


pnpm add -D @types/sortablejs
pnpm add -D @types/lodash
```



```shell
d:\ws\geelato\geelato-projects\geelato-front\ui>pnpm create vite
../../../../.pnpm-store/v3/tmp/dlx-20440 |   +1 +
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: d:\.pnpm-store\v3
  Virtual store is at:             ../../../../.pnpm-store/v3/tmp/dlx-20440/node_modules/.pnpm
../../../../.pnpm-store/v3/tmp../../../../.pnpm-store/v3/tmp/dlx-20440 | Progress: resolved 1, reused 1, downloaded 0, added 1, doneme: » vite-project
√ Project name: ... gl-ui-schema-acro
√ Select a framework: » Vanilla
√ Select a variant: » TypeScript

Scaffolding project in d:\ws\geelato\geelato-projects\geelato-front\ui\gl-ui-schema-acro...

Done. Now run:

  cd gl-ui-schema-acro
  pnpm install
  pnpm run dev
```





```shell
 D:\ws\geelato\geelato-projects\geelato-front\ui> pnpm create vue
../../../../.pnpm-store/v3/tmp/dlx-22864 |   +1 +                                                                                                                                                     
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: D:\.pnpm-store\v3
  Virtual store is at:             ../../../../.pnpm-store/v3/tmp/dlx-22864/node_modules/.pnpm
../../../../.pnpm-store/v3/tmp/dlx-22864 | Progress: resolved 1, reused 0, downloaded 1, added 0

Vue.js - The Progressive JavaScript Framework
                             ../../../../.pnpm-store/v3/tmp/dlx-22864 | Progress: resolved 1, reused 0, downloaded 1, added 1, done
√ Project name: ... gl-ui-schema-arco
√ Add TypeScript? ... No / Yes
√ Add JSX Support? ... No / Yes
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add Vitest for Unit Testing? ... No / Yes
√ Add an End-to-End Testing Solution? » No
√ Add ESLint for code quality? ... No / Yes
√ Add Prettier for code formatting? ... No / Yes

Scaffolding project in D:\ws\geelato\geelato-projects\geelato-front\ui\gl-ui-schema-arco...

Done. Now run:

  cd gl-ui-schema-arco
  pnpm install
  pnpm format
  pnpm dev

```





`mkdir packages`



[All in one：项目级 monorepo 策略最佳实践 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/348898271)