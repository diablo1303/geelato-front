import {useGlobal, userApi} from "@geelato/gl-ui";
import {useUserStore} from "@geelato/gl-ui-arco-admin";

/**
 * 获取url参数
 */
export const handleUrlParams = () => {
  const urlParams: Record<string, string> = {};
  const {searchParams} = new URL(window.location.href);
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of searchParams.entries()) {
    urlParams[key] = value;
  }
  return urlParams;
};

/**
 * 验证用户租户
 * @param urlParams
 * @param userStore
 */
export const validateUserTenantCode = (urlParams: Record<string, string>, userStore: Record<string, any>) => {
  let result = {valid: 1, message: ''};
  if (!userStore || !userStore.id) {
    result = {valid: 0, message: '用户不存在，请检查url地址。'};
    console.log(result);
  }
  if (urlParams.tenantCode !== userStore.tenantCode) {
    result = {valid: 0, message: '用户所属租户与url中的租户不一致，请检查url地址。'};
    console.log(result, urlParams.tenantCode, userStore.tenantCode);
  }
  return result;
}

/**
 * 验证应用是否存在、应用名称、应用所属租户
 * @param urlParams
 * @param appStore
 */
export const validateAppTenantCode = (urlParams: Record<string, string>, appStore: Record<string, any>) => {
  let result = {valid: 1, message: ''};
  if (!appStore || !appStore.id) {
    result = {valid: 0, message: '应用不存在，请检查url地址。'};
    console.log(result);
  }
  if (urlParams.tenantCode !== appStore.tenantCode) {
    result = {valid: 0, message: '应用所属租户与url中的租户不一致，请检查url地址。'};
    console.log(result, urlParams.tenantCode, appStore.tenantCode);
  }
  if (!urlParams.appName) {
    urlParams.appName = appStore.name;
  } else if (urlParams.appName !== appStore.name) {
    result = {valid: 0, message: '应用名称与url中的不一致，请检查url地址。'};
    console.log(result, urlParams.appName, appStore.name);
  }
  return result;
}

/**
 * 数据校验
 * @param urlParams
 */
export const validateIde = async (urlParams: Record<string, string>): Promise<Record<string, any>> => {
  const userStore = useUserStore();
  const global = useGlobal();
  // 页面显示状态
  let showPage: Record<string, any> = {valid: 2, message: '验证中'};
  // 加载用户信息
  if (!userStore.id) await userStore.info();
  // 用户验证
  showPage = validateUserTenantCode(urlParams, userStore);
  if (showPage.valid !== 1) return showPage;
  // 加载系统配置
  await userApi.getSysConfig(global, userStore, {appId: urlParams.appId || '', tenantCode: urlParams.tenantCode || '',});
  // 应用验证
  showPage = validateAppTenantCode(urlParams, global.$gl.app);
  if (showPage.valid !== 1) return showPage;

  return {valid: 1, message: '验证通过'};
}

/**
 * 验证url参数, 设计页面
 * @param urlParams
 */
export const validateIdeUrl = (urlParams: Record<string, string>, urlName: string) => {
  let result = {valid: 1, message: ''};
  if (!urlParams.appId || !urlParams.tenantCode) {
    result = {valid: 0, message: `请在url中传入 tenantCode、appId 参数，如：https://域名:端口/${urlName}.html?tenantCode=?&appId=?&appName=?`};
    console.log(result, urlParams);
  }
  return result;
}

/**
 * 验证url参数, 预览页面
 * @param urlParams
 */
export const validateIdePagePreviewUrl = (urlParams: Record<string, string>) => {
  let result = {valid: 1, message: ''};
  if (!urlParams.appId || !urlParams.tenantCode || !urlParams.pageId) {
    result = {valid: 0, message: '请在url中传入 tenantCode、appId、pageId 参数，如：https://域名:端口/idePagePreview.html?tenantCode=?&appId=?&pageId=?'};
    console.log(result, urlParams);
  }
  return result;
}