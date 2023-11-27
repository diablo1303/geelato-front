import axios from "axios";
import {QueryResult} from "@/api/base";

export interface TenantBaseForm {
  tenantCode: string;
  companyName: string;
  corpId: string;
  corpToken: string;
  companyArea: string;
}

export interface TenantIndexForm {
  tenantCode: string;
  logo: string;
  tenantName: string;
  loginTitle: string;
  loginSubTitle: string;
}

export function formDataToFile(data: Record<string, any>, fileName: string) {
  return axios.post<QueryResult>(`/api/upload/json?fileName=${fileName}`, data);
}

export function formDataFromFile(fileName: string) {
  return axios.get<string>(`/api/resources/json?fileName=${fileName}`);
}