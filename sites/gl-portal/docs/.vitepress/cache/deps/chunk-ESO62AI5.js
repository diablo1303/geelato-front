import {
  init_vue_runtime_esm_bundler
} from "./chunk-5PJZPTXT.js";

// ../../node_modules/.pnpm/vue-demi@0.13.11_vue@3.2.47/node_modules/vue-demi/lib/index.mjs
init_vue_runtime_esm_bundler();
init_vue_runtime_esm_bundler();
var isVue2 = false;
var isVue3 = true;
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}

export {
  isVue2,
  isVue3,
  set,
  del
};
//# sourceMappingURL=chunk-ESO62AI5.js.map
