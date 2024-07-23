<script lang="ts">
export default {
  name: 'GlManageAccount',
};
</script>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useUserStore} from "../../../store";
import AccountValid from "../components/account-valid.vue";
import AccountMobile from "../components/account-mobile.vue";
import AccountEmail from "../components/account-email.vue";
import AccountPassword from "../components/account-password.vue";
import {stringUtil, authUtil} from "@geelato/gl-ui";
import type {BindAccountData, UserState} from "@geelato/gl-ui";

const {t} = useI18n();
const userStore = useUserStore();
const visibleData = ref({valid: false, mobile: false, email: false, password: false});
const openFormNumber = ref(-1);
const bindAccountForm = ref<BindAccountData[]>([]);

const buildAccountForm = (user: UserState) => {
  bindAccountForm.value = [
    {
      index: 1,
      title: `${t('account.manage.list.mobile.title')}`,
      description: !(user && user.mobilePhone) ? t('account.manage.list.mobile.description') : `${user.mobilePrefix} ${stringUtil.abbreviateValue(user.mobilePhone, '1')}`,
      isNull: !(user && user.mobilePhone)
    }, {
      index: 2,
      title: t('account.manage.list.email.title'),
      description: !(user && user.email) ? t('account.manage.list.email.description') : stringUtil.abbreviateValue(user.email, '2'),
      isNull: !(user && user.email)
    }, {
      index: 3,
      title: t('account.manage.list.password.title'),
      description: t('account.manage.list.password.description'),
      isNull: false
    }
  ];
}

const openUpdateForm = (index: number) => {
  if (index === 1) {
    visibleData.value.mobile = true;
  } else if (index === 2) {
    visibleData.value.email = true;
  } else if (index === 3) {
    visibleData.value.password = true;
  }
  openFormNumber.value = -1;
}

const bindAccountClick = (form: BindAccountData) => {
  if (authUtil.isValidUser()) {
    openUpdateForm(form.index);
  } else {
    openFormNumber.value = form.index;
    visibleData.value.valid = true;
  }
}

const validEvent = () => {
  openUpdateForm(openFormNumber.value);
}
const completeEvent = () => {
  userStore.info(() => {
    buildAccountForm(userStore);
  });
}

onMounted(() => {
  buildAccountForm(userStore);
});
</script>

<template>
  <a-card class="general-card">
    <div style="margin-bottom: 20px;padding-top: 5px;">
      <a-divider class="account-manage-divider" orientation="left">
        {{ $t('account.manage.index.first') }}
      </a-divider>
      <a-list style="width: 620px;">
        <a-list-item v-for="form in bindAccountForm" :key="form.index">
          <a-list-item-meta :description="form.description" :title="form.title">
            <template #avatar>
              <icon-plus v-if="form.isNull" :size="26" style="color: rgb(var(--primary-6));"/>
              <icon-check v-else :size="26" style="color: rgb(var(--success-6));"/>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button class="account-manage-list-button" type="outline" @click="bindAccountClick(form)">
              {{ $t(`${form.isNull ? 'account.manage.index.button.bind' : 'account.manage.index.button.update'}`) }}
            </a-button>
          </template>
        </a-list-item>
      </a-list>
    </div>
    <div style="padding-top: 5px;">
      <a-divider class="account-manage-divider" orientation="left">
        {{ $t('account.manage.index.second') }}
      </a-divider>
      <a-space class="account-manage-two-subTitle">
        {{ $t('account.manage.index.second.subTitle') }}
      </a-space>
    </div>
  </a-card>
  <AccountValid v-model="visibleData.valid" @validEvent="validEvent"/>
  <AccountMobile v-model="visibleData.mobile" @completeEvent="completeEvent"/>
  <AccountEmail v-model="visibleData.email" @completeEvent="completeEvent"/>
  <AccountPassword v-model="visibleData.password" @completeEvent="completeEvent"/>
</template>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.account-manage {
  &-divider {
    font-size: 16px;
    font-weight: bold;
  }

  &-two-subTitle {
    margin-bottom: 10px;
  }

  &-list-button {
    height: 20px;
    font-size: 12px;
    border-radius: 5px;
    line-height: 20px;
    padding: 0 5px;
    margin-left: 20px;
  }

  &-autoCode-button {
    margin-left: 20px;
    border-radius: 8px;
  }
}

</style>
