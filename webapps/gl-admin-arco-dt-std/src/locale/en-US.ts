import {localeEnUs} from '@geelato/gl-ui-arco-admin';
import localeAccounts from '@/views/account/locale/en-US';
import localeApplications from '@/views/application/locale/en-US';
import localeExports from '@/views/export/locale/en-US';
import localeLogins from '@/views/login/locale/en-US';
import localeModels from '@/views/model/locale/en-US';
import localePages from '@/views/page/locale/en-US';
import localResets from '@/views/reset/locale/en-US';
import localeSecuritys from '@/views/security/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  ...localeAccounts,
  ...localeApplications,
  ...localeExports,
  ...localeLogins,
  ...localeModels,
  ...localePages,
  ...localResets,
  ...localeSecuritys,
  ...localeSettings,
  ...localeEnUs,
};
