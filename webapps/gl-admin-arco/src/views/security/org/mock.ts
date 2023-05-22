import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, {successResponseWrap} from '@/utils/setup-mock';
import {GetParams} from '@/types/global';

const {Random} = Mock;

const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'name|2-3': /[0-9]/,
      'code|4-8': /[A-Z]/,
      'type|1': ['inside', 'outside'],
      'seqNo|1': /[0-9]/,
      'status|1': ['enabled', 'disabled'],
      'createAt': Random.datetime(),
    },
  ],
});

setupMock({
  mock: false,
  setup() {
    Mock.mock(new RegExp('/api/list/org'), (params: GetParams) => {
      const {current = 1, pageSize = 10} = qs.parseUrl(params.url).query;
      const p = current as number;
      const ps = pageSize as number;
      return successResponseWrap({
        items: data.list.slice((p - 1) * ps, p * ps),
        total: 55,
      });
    });
  },
});
