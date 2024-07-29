<template>
  <div>
    <div>
      <a-space>
        <a-button type="primary" @click="componentMetaRegisterVisible = true"
        >编辑协议
        </a-button
        >
      </a-space>
    </div>
  </div>
  <div>
    <a-modal
        v-if="componentMetaRegisterVisible"
        v-model:visible="componentMetaRegisterVisible"
        :body-style="{ padding: '0 20px' }"
        :destroyOnClose="true"
        class="gl-component-register-modal"
        draggable
        fullscreen title="注册组件"
    >
      <GlComponentBuilder ref="builder"
                          :action="componentMetaAction"
                          :componentInstance="componentInstance"
                          :componentMeta="componentMeta"
      ></GlComponentBuilder>
      <template #footer>
        <div style="text-align: center">
          <!--          <a-button key="back" type="danger" @click="componentMetaRemove">删除</a-button>-->
          <!--          <a-button key="submit" type="primary" @click="onComponentMetaRegiste">保存</a-button>-->
          <a-space>
            <a-button
                key="submit"
                type="primary"
                @click="copyMetaExport"
            >复制元数据
            </a-button
            >
            <a-button
                key="submit"
                type="primary"
                @click="copyInstJson"
            >复制实例
            </a-button
            >
            <a-button
                key="submit"
                type="primary"
                @click="componentMetaRegisterVisible = false"
            >关闭
            </a-button
            >
          </a-space>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'ComponentBuilderExample',
};
</script>
<script setup>
import {ref} from 'vue';

const props = defineProps({
  componentMeta: Object,
  componentInstance: Object,
});
const componentMetaRegisterVisible = ref(false);
// 本地存储
// ls: localStorage,
// 当前选中的组件元数据
const currentComponentMeta = ref(props.componentMeta);
const currentComponentInstance = ref(props.componentInstance);
// 组件元数据操作，是新增，还是修改
const componentMetaAction = ref('create');
const builder = ref()
const copyMetaJson = () => {
  builder.value.copyMetaJson()
}
const copyMetaExport = () => {
  builder.value.copyMetaExport()
}
const copyInstJson = () => {
  builder.value.copyInstJson()
}

</script>

<style scoped></style>