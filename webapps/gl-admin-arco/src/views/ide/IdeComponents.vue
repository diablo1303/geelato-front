<script lang="ts">
  export default {
    name: 'IdeComponents',
  };
</script>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { HTML5Backend } from 'react-dnd-html5-backend';
  import {
    schemaArco,
    schemaBlock,
    schemaBpmn,
  } from '@geelato/gl-ui-schema-arco';
  import { DndProvider } from 'vue3-dnd';
  import ComponentBuilderExample from './ComponentBuilderExample.vue';

  const componentId = ref('');
  componentId.value =
    new URL(window.location.href).searchParams.get('componentId') || '';

  const componentMetas = ref(schemaArco.componentMetas);
  const schema = ref('schemaArco');
  const change = () => {
    switch (schema.value) {
      case 'schemaArco':
        componentMetas.value = schemaArco.componentMetas;
        break;
      case 'schemaBlock':
        componentMetas.value = schemaBlock.componentMetas;
        break;
      case 'schemaBpmn':
        componentMetas.value = schemaBpmn.componentMetas;
        break;
      default:
        console.error('不支持的schema类型：', schema.value);
    }
    if (!searchText.value) {
      renderComponentMetas.value = componentMetas.value;
    }
    const searchTextStr = searchText.value.toLowerCase();
    renderComponentMetas.value = componentMetas.value.filter((meta) => {
      return (
        meta.title.indexOf(searchTextStr) !== -1 ||
        meta.componentName.toLowerCase().indexOf(searchTextStr) !== -1
      );
    });
  };

  const searchText = ref('');
  const renderComponentMetas = ref(componentMetas.value);
  watch(searchText, change);
</script>
<template>
  <div class="ide-components">
    <div style="border-bottom: 1px solid black">
      <a-radio-group
        v-model="schema"
        type="button"
        size="large"
        @change="change"
      >
        <a-radio value="schemaArco">UI组件库</a-radio>
        <a-radio value="schemaBlock">脚本组件库</a-radio>
        <a-radio value="schemaBpmn">BPMN组件库</a-radio>
      </a-radio-group>
      <a-input-search v-model="searchText" style="width: 20em; float: right" />
    </div>
    <table class="gl-table" style="width: 100%">
      <tr>
        <th class="gl-table-cell gl-label" style="min-width: 5em">序号</th>
        <th class="gl-table-cell gl-label" style="">组件</th>
        <th class="gl-table-cell gl-label" style="min-width: 6em"
          >是否有属性
        </th>
        <th class="gl-table-cell gl-label" style="min-width: 8em">操作</th>
      </tr>
      <tr
        v-for="(componentMeta, index) in renderComponentMetas"
        :key="index"
        style="margin-bottom: 4px"
      >
        <td class="gl-table-cell">{{ index + 1 }}</td>
        <td class="gl-table-cell"
          ><span style="width: 30em"
            >{{ componentMeta.title }} {{ componentMeta.componentName }}</span
          >
        </td>
        <td class="gl-table-cell">
          <a-tag :color="componentMeta.properties.length ? 'green' : 'red'">
            {{ componentMeta.properties.length ? '是' : '否' }}
          </a-tag>
        </td>
        <td class="gl-table-cell">
          <DndProvider :backend="HTML5Backend">
            <ComponentBuilderExample :componentMeta="componentMeta" />
          </DndProvider>
        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
  .ide-components {
    margin: 2em;
  }

  .ide-components .gl-table-cell {
    text-align: center;
    vertical-align: middle;
  }
</style>
