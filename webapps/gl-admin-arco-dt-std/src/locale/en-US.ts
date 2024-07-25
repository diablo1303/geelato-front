import {localeEnUs} from '@geelato/gl-ui-arco-admin';
import localeApplications from '@/views/application/locale/en-US';
import localeLogins from '@/views/login/locale/en-US';
import localeModels from '@/views/model/locale/en-US';
import localeSecuritys from '@/views/security/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  ...localeApplications,
  ...localeLogins,
  ...localeModels,
  ...localeSecuritys,
  ...localeSettings,
  ...localeEnUs,
};