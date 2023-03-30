<template>
  <div class="gl-entity-form">
    <a-form ref="formRef" layout="vertical" :model="formData" :title="title">
      <a-space direction="vertical" :size="0">
        <GlX :glComponentInst="glComponentInst"></GlX>
      </a-space>
      <div class="gl-entity-form-actions">
        <a-space>
          <a-button>
            {{ $t('groupForm.reset') }}
          </a-button>
          <a-button type="primary" :loading="loading" @click="onSubmitClick">
            {{ $t('groupForm.submit') }}
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlEntityForm"
}
</script>
<script lang="ts" setup>
import {ref} from 'vue';
import {FormInstance} from '@arco-design/web-vue/es/form';
import useLoading from '../../hooks/loading';
import {mixins} from "@geelato/gl-ui";


const props = defineProps({
  title: String,
  ...mixins.props
})

const formData = ref({});
const formRef = ref<FormInstance>();
const {loading, setLoading} = useLoading();
const onSubmitClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    setLoading(true);
  }
  setTimeout(() => {
    setLoading(false);
  }, 1000);
};
</script>

<style scoped lang="less">
.gl-entity-form {
  //padding: 0 20px 40px 20px;
  //overflow: hidden;
}

.gl-entity-form-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  padding: 14px 20px 14px 0;
  background: var(--color-bg-2);
  text-align: right;
}
</style>
