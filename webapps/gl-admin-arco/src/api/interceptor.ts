import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios';
import {Message, Modal} from '@arco-design/web-vue';
import {useUserStore} from '@/store';
import globalConfig from '@/config/globalConfig';
import {getToken} from '@/utils/auth';
import {useApiUrl, useMessages} from "@geelato/gl-ui";
import {fetchFileById} from "@/api/attachment";

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

const messageManger = useMessages()
axios.defaults.baseURL = useApiUrl().getApiBaseUrl()

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<any, any>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== globalConfig.interceptorCode && res.code !== 0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if ([50008, 50012, 50014].includes(res.code) && response.config.url !== '/api/user/info') {
        Message.error({content: res.msg || 'Error', duration: 8 * 1000});
        Modal.error({
          title: 'Confirm logout',
          content: 'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();
            await userStore.logout();
            window.location.reload();
          },
        });
      } else if ([1216].includes(res.code)) {
        // @ts-ignore
        const attachmentId = (res.data && res.data.id) ? res.data.id : null;
        if (attachmentId) {
          Modal.error({
            title: `文件错误`,
            content: '[1216]文件内容校验失败：更多内容，请查看错误提示文件。',
            okText: "下载错误提示文件",
            onOk() {
              fetchFileById(attachmentId);
            }
          });
        } else {
          Message.error({content: '[1216]文件内容校验失败。' || 'Error', duration: 10 * 1000});
        }
        // 12.6 File Content Validate Failed Exception：For more information, see the error file.
      } else {
        Message.error({content: messageManger.getMessage(res.msg) || 'Error', duration: 8 * 1000});
      }
      return Promise.reject(new Error(res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    const msg = messageManger.getMessage(error.response.data)
    Message.error({content: msg || error.msg || 'Request Error', duration: 8 * 1000});
    return Promise.reject(error);
  }
);