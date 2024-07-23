<script lang="tsx">
import {compile, computed, defineComponent, h, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import type {RouteMeta, RouteRecordRaw} from 'vue-router';
import {useRoute, useRouter} from 'vue-router';
import {useAppStore} from "@geelato/gl-ui-arco-admin";
import {authUtil, iconsJson, routeUtil} from '@geelato/gl-ui';
import useMenuTree from './use-menu-tree';

export default defineComponent({
  emit: ['collapse'],
  setup() {
    const {t} = useI18n();
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const {menuTree} = useMenuTree();
    const collapsed = computed({
      get() {
        if (appStore.device === 'desktop') return appStore.menuCollapse;
        return false;
      },
      set(value: boolean) {
        appStore.updateSettings({menuCollapse: value});
      },
    });

    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);

    const goto = (item: RouteRecordRaw) => {
      // Open external link
      if (authUtil.regexUrl.test(item.path)) {
        authUtil.openWindow(item.path);
        selectedKey.value = [item.name as string];
        return;
      }
      // Eliminate external link side effects
      const {hideInMenu, activeMenu} = item.meta as RouteMeta;
      if (route.name === item.name && !hideInMenu && !activeMenu) {
        selectedKey.value = [item.name as string];
        return;
      }
      // @ts-ignore
      router.push({name: item.name, params: item.params});
    };
    const findMenuOpenKeys = (target: string) => {
      const result: string[] = [];
      let isFind = false;
      const backtrack = (item: RouteRecordRaw, keys: string[]) => {
        if (item.name === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        if (item.children?.length) {
          item.children.forEach((el) => {
            backtrack(el, [...keys, el.name as string]);
          });
        }
      };
      menuTree.value.forEach((el: RouteRecordRaw) => {
        if (isFind) return; // Performance optimization
        backtrack(el, [el.name as string]);
      });
      return result;
    };
    routeUtil.listenerRouteChange((newRoute) => {
      const {requiresAuth, activeMenu, hideInMenu} = newRoute.meta;
      if (requiresAuth && (!hideInMenu || activeMenu)) {
        const menuOpenKeys = findMenuOpenKeys(
            (activeMenu || newRoute.name) as string
        );

        const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
        openKeys.value = [...keySet];
        // @ts-ignore
        selectedKey.value = [activeMenu || menuOpenKeys[menuOpenKeys.length - 1],];
      }
    }, true);
    const setCollapse = (val: boolean) => {
      if (appStore.device === 'desktop')
        appStore.updateSettings({menuCollapse: val});
    };

    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            // This is demo, modify nodes as needed
            let icon = null;
            if (element?.meta?.icon) {
              let isAli = false;
              if (iconsJson && iconsJson.glyphs && iconsJson.glyphs.length > 0) {
                // eslint-disable-next-line no-restricted-syntax
                for (const item of iconsJson.glyphs) {
                  if (element?.meta?.icon === iconsJson.css_prefix_text + item.font_class) {
                    isAli = true;
                    break;
                  }
                }
              }
              icon = () => h(compile(isAli ? `<GlIconfont type='${element?.meta?.icon}'/>` : `<${element?.meta?.icon}/>`));
            }
            const node =
                element?.children && element?.children.length !== 0 ? (
                    <a-sub-menu key={element?.name} v-slots={{icon, title: () => h(compile(t(element?.meta?.locale || ''))),}}>
                      {travel(element?.children)}
                    </a-sub-menu>
                ) : (
                    <a-menu-item key={element?.name} v-slots={{icon}} onClick={() => goto(element)}>
                      {t(element?.meta?.locale || '')}
                    </a-menu-item>
                );
            nodes.push(node as never);
          });
        }
        return nodes;
      }

      return travel(menuTree.value);
    };

    return () => (
        <a-menu
            mode={topMenu.value ? 'horizontal' : 'vertical'}
            v-model:collapsed={collapsed.value}
            v-model:open-keys={openKeys.value}
            show-collapse-button={appStore.device !== 'mobile'}
            auto-open={false}
            selected-keys={selectedKey.value}
            auto-open-selected={true}
            level-indent={34}
            style="height: 100%;width:100%;"
            onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
    );
  },
});
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
