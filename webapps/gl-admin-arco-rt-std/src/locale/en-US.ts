import {localeEnUs} from '@geelato/gl-ui-arco-admin';
import localeAccounts from '@/views/account/locale/en-US';
import localeLogins from '@/views/login/locale/en-US';
import localResets from '@/views/reset/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  ...localeSettings,
  ...localeAccounts,
  ...localeLogins,
  ...localResets,
  ...localeEnUs,
};
