import {ref} from "vue";

export const ROUTER_WHITE_LIST = ref([
  {name: 'notFound', children: []},
  {name: 'login', children: []},
]);

export const ROUTER_NOT_FOUND = ref({name: 'notFound'});

export const ROUTER_REDIRECT_ROUTE_NAME = ref('Redirect');

export const ROUTER_DEFAULT_ROUTE = ref({title: '默认页面', name: '', fullPath: '', params: {}});

export const ROUTER_ACCOUNT_ROUTE_PATH = ref('/account/user');

export const ROUTER_DEFAULT_ROUTE_ACCOUNT = ref({
  title: 'model.application.index.menu.list',
  name: 'userAccount',
  fullPath: ROUTER_ACCOUNT_ROUTE_PATH,
  params: {}
});

export const ROUTER_IS_ACCOUNT = ref<boolean>(false);