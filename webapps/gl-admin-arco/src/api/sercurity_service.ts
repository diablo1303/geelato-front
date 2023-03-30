import axios from 'axios';
import qs from 'query-string';


export interface OrgRecord {
    id: string;
    number: number;
    name: string;
    count: number;
    status: 'online' | 'offline';
    createdTime: string;
  }
  
export interface OrgListParams extends Partial<OrgRecord> {
    current: number;
    pageSize: number;
  }
  
  export interface OrgListRes {
    list: OrgRecord[];
    total: number;
  }
  
  export function queryOrgList(params: OrgListParams) {
    return axios.get<OrgListRes>('/api/list/org', {
      params,
      paramsSerializer: (obj) => {
        return qs.stringify(obj);
      },
    });
  }
  