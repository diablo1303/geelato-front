import localeMessageBox from '@/components/message-box/locale/en-US';

import localeApplication from '@/views/application/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';
import localeModel from '@/views/model/locale/en-US';
import localePage from '@/views/page/locale/en-US';
import localReset from '@/views/reset/locale/en-US';
import localeSecurity from '@/views/security/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  ...localeMessageBox,

  ...localeApplication,
  ...localeLogin,
  ...localeModel,
  ...localePage,
  ...localReset,
  ...localeSecurity,

  ...localeSettings,
};
