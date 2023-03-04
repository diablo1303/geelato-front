<template>
  <div>
    <div>
      <a-space>
        <a-button type="primary">查看协议</a-button>
        <a-button type="primary" @click="componentMetaRegisterVisible=true">编辑协议</a-button>
      </a-space>
    </div>
  </div>
  <div>
    <a-modal v-model:visible="componentMetaRegisterVisible" :destroyOnClose="true" v-if="componentMetaRegisterVisible"
             title="注册组件"
             class="gl-component-register-modal" fullscreen>
      <GlComponentBuilder  :componentMeta="componentMeta" :componentInstance="componentInstance" :action="componentMetaAction"></GlComponentBuilder>
      <template #footer>
        <div style="text-align: center">
          <a-button key="back" type="danger" @click="componentMetaRemove">删除</a-button>
          <a-button key="submit" type="primary" @click="onComponentMetaRegiste">保存</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: "ComponentBuilderExample",
  props:{
    componentMeta:Object,
    componentInstance:Object
  },
  data() {
    return {
      componentMetaRegisterVisible: false,
      // 本地存储
      // ls: localStorage,
      // 当前选中的组件元数据
      currentComponentMeta: this.componentMeta,
      currentComponentInstance:this.componentInstance,
      // 组件元数据操作，是新增，还是修改
      componentMetaAction: 'create',
    }
  }
}
</script>

<style scoped>

</style>