import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {Message} from '@arco-design/web-vue';
import {setArcoLocale} from "@/utils/auth";

export default function useLocale() {
  const i18 = useI18n();
  const currentLocale = computed(() => {
    return i18.locale.value;
  });
  const changeLocale = (value: string) => {
    if (i18.locale.value === value) {
      return;
    }
    i18.locale.value = value;
    setArcoLocale(value);
    Message.success(i18.t('navbar.action.locale'));
  };
  return {
    currentLocale,
    changeLocale,
  };
}
