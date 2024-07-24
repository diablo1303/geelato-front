import {localeZhCn} from '@geelato/gl-ui-arco-admin';
import localeAccounts from '@/views/account/locale/zh-CN';
import localeLogins from '@/views/login/locale/zh-CN';
import localResets from '@/views/reset/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  ...localeSettings,
  ...localeAccounts,
  ...localeLogins,
  ...localResets,
  ...localeZhCn,
};
