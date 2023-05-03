import {
  Fragment,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createVNode,
  init_vue_runtime_esm_bundler,
  normalizeClass,
  normalizeStyle,
  openBlock,
  renderList,
  resolveComponent,
  toDisplayString,
  vModelText,
  vShow,
  withCtx,
  withDirectives,
  withKeys
} from "./chunk-5PJZPTXT.js";
import "./chunk-AC2VUBZ6.js";

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/defaultConfig.js
var prefix = "";
var size = "medium";

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/create.js
function create(params = {}) {
  return (app) => {
    const { components: components2, componentPrefix = prefix, componentSize = size } = params;
    app.config.globalProperties.$VUI = {
      size: componentSize,
      prefix: componentPrefix
    };
    (Array.isArray(components2) ? components2 : Object.values(components2)).forEach((component) => {
      app.component(`${componentPrefix}${component.name}`, component);
    });
  };
}

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/checkboard/index.js
init_vue_runtime_esm_bundler();

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/style-inject.es-746bb8ed.js
function styleInject(css, ref) {
  if (ref === void 0)
    ref = {};
  var insertAt = ref.insertAt;
  if (!css || typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/utils/compoent.js
var install = function(app, options) {
  const { componentPrefix = prefix } = options || {};
  app.component(`${componentPrefix}${this.name}`, this);
};

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/checkboard/index.js
var _checkboardCache = {};
var script = {
  name: "Checkboard",
  props: {
    size: {
      type: [Number, String],
      default: 8
    },
    white: {
      type: String,
      default: "#fff"
    },
    grey: {
      type: String,
      default: "#e6e6e6"
    }
  },
  computed: {
    bgStyle() {
      return {
        "background-image": `url(${getCheckboard(this.white, this.grey, this.size)})`
      };
    }
  }
};
function renderCheckboard(c1, c2, size2) {
  if (typeof document === "undefined")
    return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size2 * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return null;
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, size2, size2);
  ctx.translate(size2, size2);
  ctx.fillRect(0, 0, size2, size2);
  return canvas.toDataURL();
}
function getCheckboard(c1, c2, size2) {
  const key = `${c1},${c2},${size2}`;
  if (_checkboardCache[key])
    return _checkboardCache[key];
  const checkboard = renderCheckboard(c1, c2, size2);
  _checkboardCache[key] = checkboard;
  return checkboard;
}
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: "vc-checkerboard",
      style: normalizeStyle($options.bgStyle)
    },
    null,
    4
    /* STYLE */
  );
}
var css_248z = ".vc-checkerboard{background-size:contain;bottom:0;left:0;position:absolute;right:0;top:0}";
styleInject(css_248z);
script.render = render;
script.__file = "src/components/checkboard/checkboard.vue";
script.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/alpha/index.js
init_vue_runtime_esm_bundler();
var script2 = {
  name: "Alpha",
  components: {
    Checkboard: script
  },
  props: {
    value: Object,
    onChange: Function
  },
  computed: {
    colors() {
      return this.value;
    },
    gradientColor() {
      const { rgba } = this.colors;
      const rgbStr = [rgba.r, rgba.g, rgba.b].join(",");
      return `linear-gradient(to right, rgba(${rgbStr}, 0) 0%, rgba(${rgbStr}, 1) 100%)`;
    }
  },
  methods: {
    handleChange(e, skip) {
      !skip && e.preventDefault();
      const { container } = this.$refs;
      if (!container) {
        return;
      }
      const containerWidth = container.clientWidth;
      const xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      const left = pageX - xOffset;
      let a;
      if (left < 0)
        a = 0;
      else if (left > containerWidth)
        a = 1;
      else
        a = Math.round(left * 100 / containerWidth) / 100;
      if (this.colors.a !== a) {
        this.$emit("change", {
          h: this.colors.hsl.h,
          s: this.colors.hsl.s,
          l: this.colors.hsl.l,
          a,
          source: "rgba"
        });
      }
    },
    handleMouseDown(e) {
      this.handleChange(e, true);
      window.addEventListener("mousemove", this.handleChange);
      window.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseUp() {
      this.unbindEventListeners();
    },
    unbindEventListeners() {
      window.removeEventListener("mousemove", this.handleChange);
      window.removeEventListener("mouseup", this.handleMouseUp);
    }
  }
};
var _hoisted_1 = { class: "vc-alpha" };
var _hoisted_2 = { class: "vc-alpha-checkboard-wrap" };
var _hoisted_3 = createBaseVNode(
  "div",
  { class: "vc-alpha-picker" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_4 = [
  _hoisted_3
];
function render2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Checkboard = resolveComponent("Checkboard");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      createVNode(_component_Checkboard)
    ]),
    createBaseVNode(
      "div",
      {
        class: "vc-alpha-gradient",
        style: normalizeStyle({ background: $options.gradientColor })
      },
      null,
      4
      /* STYLE */
    ),
    createBaseVNode(
      "div",
      {
        ref: "container",
        class: "vc-alpha-container",
        onMousedown: _cache[0] || (_cache[0] = (...args) => $options.handleMouseDown && $options.handleMouseDown(...args)),
        onTouchmove: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
        onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
      },
      [
        createBaseVNode(
          "div",
          {
            class: "vc-alpha-pointer",
            style: normalizeStyle({ left: `${$options.colors.a * 100}%` })
          },
          _hoisted_4,
          4
          /* STYLE */
        )
      ],
      544
      /* HYDRATE_EVENTS, NEED_PATCH */
    )
  ]);
}
var css_248z2 = ".vc-alpha,.vc-alpha-checkboard-wrap{bottom:0;left:0;position:absolute;right:0;top:0}.vc-alpha-checkboard-wrap{overflow:hidden}.vc-alpha-gradient{bottom:0;left:0;position:absolute;right:0;top:0}.vc-alpha-container{cursor:pointer;height:100%;margin:0 3px;position:relative;z-index:2}.vc-alpha-pointer{position:absolute;z-index:2}.vc-alpha-picker{background:#fff;border-radius:1px;box-shadow:0 0 2px rgba(0,0,0,.6);cursor:pointer;height:8px;margin-top:1px;transform:translateX(-2px);width:4px}";
styleInject(css_248z2);
script2.render = render2;
script2.__file = "src/components/alpha/alpha.vue";
script2.install = install;

// ../../node_modules/.pnpm/@ctrl+tinycolor@3.6.0/node_modules/@ctrl/tinycolor/dist/module/util.js
function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = "100%";
  }
  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  if (Math.abs(n - max) < 1e-6) {
    return 1;
  }
  if (max === 360) {
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    n = n % max / parseFloat(String(max));
  }
  return n;
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") !== -1;
}
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
function convertToPercentage(n) {
  if (n <= 1) {
    return "".concat(Number(n) * 100, "%");
  }
  return n;
}
function pad2(c) {
  return c.length === 1 ? "0" + c : String(c);
}

// ../../node_modules/.pnpm/@ctrl+tinycolor@3.6.0/node_modules/@ctrl/tinycolor/dist/module/conversion.js
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}
function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
function hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  if (s === 0) {
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return { h, s, v };
}
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHex(r, g, b, allow3Char) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16))
  ];
  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(convertDecimalToHex(a))
  ];
  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 65280) >> 8,
    b: color & 255
  };
}

// ../../node_modules/.pnpm/@ctrl+tinycolor@3.6.0/node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
var names = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};

// ../../node_modules/.pnpm/@ctrl+tinycolor@3.6.0/node_modules/@ctrl/tinycolor/dist/module/format-input.js
function inputToRGB(color) {
  var rgb = { r: 0, g: 0, b: 0 };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color === "string") {
    color = stringInputToObject(color);
  }
  if (typeof color === "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (Object.prototype.hasOwnProperty.call(color, "a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a
  };
}
var CSS_INTEGER = "[-\\+]?\\d+%?";
var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
  hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === "transparent") {
    return { r: 0, g: 0, b: 0, a: 0, format: "name" };
  }
  var match = matchers.rgb.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3] };
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return { r: match[1], g: match[2], b: match[3], a: match[4] };
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3] };
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return { h: match[1], s: match[2], l: match[3], a: match[4] };
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3] };
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return { h: match[1], s: match[2], v: match[3], a: match[4] };
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

// ../../node_modules/.pnpm/@ctrl+tinycolor@3.6.0/node_modules/@ctrl/tinycolor/dist/module/index.js
var TinyColor = (
  /** @class */
  function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R;
      var G;
      var B;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.isMonochrome = function() {
      var s = this.toHsl().s;
      return s === 0;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h = Math.round(hsv.h * 360);
      var s = Math.round(hsv.s * 100);
      var v = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h = Math.round(hsl.h * 360);
      var s = Math.round(hsl.s * 100);
      var l = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toHexShortString = function(allowShortChar) {
      if (allowShortChar === void 0) {
        allowShortChar = false;
      }
      return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r = Math.round(this.r);
      var g = Math.round(this.g);
      var b = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x) {
        return "".concat(Math.round(bound01(x, 255) * 100), "%");
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x) {
        return Math.round(bound01(x, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (hex === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format) {
      var formatSet = Boolean(format);
      format = format !== null && format !== void 0 ? format : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
      if (needsAlphaFormat) {
        if (format === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }
      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format === "name") {
        formattedString = this.toName();
      }
      if (format === "hsl") {
        formattedString = this.toHslString();
      }
      if (format === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p + rgb1.r,
        g: (rgb2.g - rgb1.g) * p + rgb1.g,
        b: (rgb2.b - rgb1.b) * p + rgb1.b,
        a: (rgb2.a - rgb1.a) * p + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h = hsv.h;
      var s = hsv.s;
      var v = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({ h, s, v }));
        v = (v + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h = hsl.h;
      return [
        this,
        new TinyColor2({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
        new TinyColor2({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
      ];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      var alpha = fg.a + bg.a * (1 - fg.a);
      return new TinyColor2({
        r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
        g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
        b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
        a: alpha
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n) {
      var hsl = this.toHsl();
      var h = hsl.h;
      var result = [this];
      var increment = 360 / n;
      for (var i = 1; i < n; i++) {
        result.push(new TinyColor2({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }()
);

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/mixin/color.js
function tinycolor2(...args) {
  return new TinyColor(...args);
}
function _colorChange(data, oldHue) {
  const alpha = data && data.a;
  let color;
  if (data && data.hsl)
    color = tinycolor2(data.hsl);
  else if (data && data.hex && data.hex.length > 0)
    color = tinycolor2(data.hex);
  else if (data && data.hsv)
    color = tinycolor2(data.hsv);
  else if (data && data.rgba)
    color = tinycolor2(data.rgba);
  else if (data && data.rgb)
    color = tinycolor2(data.rgb);
  else
    color = tinycolor2(data);
  if (color && (color._a === void 0 || color._a === null))
    color.setAlpha(alpha || color.getAlpha());
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  if (hsl.s === 0)
    hsv.h = hsl.h = data.h || data.hsl && data.hsl.h || oldHue || 0;
  return {
    hsl,
    hex: color.toHexString().toUpperCase(),
    hex8: color.toHex8String().toUpperCase(),
    rgba: color.toRgb(),
    hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
    a: color.getAlpha()
  };
}
var colorMixin = {
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: ["modelValue"],
  data() {
    return {
      val: _colorChange(this.modelValue)
    };
  },
  computed: {
    colors: {
      get() {
        return this.val;
      },
      set(newVal) {
        this.val = newVal;
        this.$emit("update:modelValue", newVal);
      }
    }
  },
  watch: {
    modelValue(newVal) {
      this.val = _colorChange(newVal);
    }
  },
  methods: {
    colorChange(data, oldHue) {
      this.oldHue = this.colors.hsl.h;
      this.colors = _colorChange(data, oldHue || this.oldHue);
    },
    isValidHex(hex) {
      return tinycolor2(hex).isValid;
    },
    simpleCheckForValidColor(data) {
      const keysToCheck = ["r", "g", "b", "a", "h", "s", "l", "v"];
      let checked = 0;
      let passed = 0;
      for (let i = 0; i < keysToCheck.length; i++) {
        const letter = keysToCheck[i];
        if (data[letter]) {
          checked++;
          if (!isNaN(data[letter]))
            passed++;
        }
      }
      if (checked === passed)
        return data;
    },
    paletteUpperCase(palette) {
      return palette.map((c) => c.toUpperCase());
    },
    isTransparent(color) {
      return tinycolor2(color).getAlpha() === 0;
    }
  }
};

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/editable-input/index.js
init_vue_runtime_esm_bundler();
var script3 = {
  name: "EditableInput",
  props: {
    label: String,
    labelText: String,
    desc: String,
    value: [String, Number],
    max: Number,
    min: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val: {
      get() {
        return this.value;
      },
      set(v) {
        if (!(this.max === void 0) && +v > this.max)
          this.$refs.input.value = this.max;
        else
          return v;
      }
    },
    labelId() {
      return `input__label__${this.label}__${Math.random().toString().slice(2, 5)}`;
    },
    labelSpanText() {
      return this.labelText || this.label;
    }
  },
  methods: {
    update(e) {
      this.handleChange(e.target.value);
    },
    handleChange(newVal) {
      const data = {};
      data[this.label] = newVal;
      if (data.hex === void 0 && data["#"] === void 0)
        this.$emit("change", data);
      else if (newVal.length > 5)
        this.$emit("change", data);
    },
    // **** unused
    // handleBlur (e) {
    //   console.log(e)
    // },
    handleKeyDown(e) {
      let { val } = this;
      const number = Number(val);
      if (number) {
        const amount = this.arrowOffset || 1;
        if (e.keyCode === 38) {
          val = number + amount;
          this.handleChange(val);
          e.preventDefault();
        }
        if (e.keyCode === 40) {
          val = number - amount;
          this.handleChange(val);
          e.preventDefault();
        }
      }
    }
    // **** unused
    // handleDrag (e) {
    //   console.log(e)
    // },
    // handleMouseDown (e) {
    //   console.log(e)
    // }
  }
};
var _hoisted_12 = { class: "vc-editable-input" };
var _hoisted_22 = ["aria-labelledby"];
var _hoisted_32 = ["id", "for"];
var _hoisted_42 = { class: "vc-input__desc" };
function render3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_12, [
    withDirectives(createBaseVNode("input", {
      ref: "input",
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.val = $event),
      "aria-labelledby": $options.labelId,
      class: "vc-input__input",
      onKeydown: _cache[1] || (_cache[1] = (...args) => $options.handleKeyDown && $options.handleKeyDown(...args)),
      onInput: _cache[2] || (_cache[2] = (...args) => $options.update && $options.update(...args))
    }, null, 40, _hoisted_22), [
      [vModelText, $options.val]
    ]),
    createBaseVNode("span", {
      id: $options.labelId,
      for: $props.label,
      class: "vc-input__label"
    }, toDisplayString($options.labelSpanText), 9, _hoisted_32),
    createBaseVNode(
      "span",
      _hoisted_42,
      toDisplayString($props.desc),
      1
      /* TEXT */
    )
  ]);
}
var css_248z3 = ".vc-editable-input{position:relative}.vc-input__input{border:0;outline:none;padding:0}.vc-input__label{text-transform:capitalize}";
styleInject(css_248z3);
script3.render = render3;
script3.__file = "src/components/editable-input/editable-input.vue";
script3.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/utils/utils.js
function clamp(value, min, max) {
  return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
}

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/saturation/index.js
init_vue_runtime_esm_bundler();
var script4 = {
  name: "Saturation",
  props: {
    value: Object
  },
  computed: {
    colors() {
      return this.value;
    },
    bgColor() {
      return `hsl(${this.colors.hsv.h}, 100%, 50%)`;
    },
    pointerTop() {
      return `${-(this.colors.hsv.v * 100) + 1 + 100}%`;
    },
    pointerLeft() {
      return `${this.colors.hsv.s * 100}%`;
    }
  },
  methods: {
    handleChange(e, skip) {
      !skip && e.preventDefault();
      const { container } = this.$refs;
      if (!container) {
        return;
      }
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      const yOffset = container.getBoundingClientRect().top + window.pageYOffset;
      const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      const pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
      const left = clamp(pageX - xOffset, 0, containerWidth);
      const top = clamp(pageY - yOffset, 0, containerHeight);
      const saturation = left / containerWidth;
      const bright = clamp(-(top / containerHeight) + 1, 0, 1);
      this.onChange({
        h: this.colors.hsv.h,
        s: saturation,
        v: bright,
        a: this.colors.hsv.a,
        source: "hsva"
      });
    },
    onChange(param) {
      this.$emit("change", param);
    },
    handleMouseDown(e) {
      window.addEventListener("mousemove", this.handleChange);
      window.addEventListener("mouseup", this.handleChange);
      window.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseUp(e) {
      this.unbindEventListeners();
    },
    unbindEventListeners() {
      window.removeEventListener("mousemove", this.handleChange);
      window.removeEventListener("mouseup", this.handleChange);
      window.removeEventListener("mouseup", this.handleMouseUp);
    }
  }
};
var _hoisted_13 = createBaseVNode(
  "div",
  { class: "vc-saturation--white" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_23 = createBaseVNode(
  "div",
  { class: "vc-saturation--black" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_33 = createBaseVNode(
  "div",
  { class: "vc-saturation-circle" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_43 = [
  _hoisted_33
];
function render4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      ref: "container",
      class: "vc-saturation",
      style: normalizeStyle({ background: $options.bgColor }),
      onMousedown: _cache[0] || (_cache[0] = (...args) => $options.handleMouseDown && $options.handleMouseDown(...args)),
      onTouchmove: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
      onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
    },
    [
      _hoisted_13,
      _hoisted_23,
      createBaseVNode(
        "div",
        {
          class: "vc-saturation-pointer",
          style: normalizeStyle({ top: $options.pointerTop, left: $options.pointerLeft })
        },
        _hoisted_43,
        4
        /* STYLE */
      )
    ],
    36
    /* STYLE, HYDRATE_EVENTS */
  );
}
var css_248z4 = ".vc-saturation,.vc-saturation--black,.vc-saturation--white{bottom:0;cursor:pointer;left:0;position:absolute;right:0;top:0}.vc-saturation--white{background:linear-gradient(90deg,#fff,hsla(0,0%,100%,0))}.vc-saturation--black{background:linear-gradient(0deg,#000,transparent)}.vc-saturation-pointer{cursor:pointer;position:absolute}.vc-saturation-circle{border-radius:50%;box-shadow:0 0 0 1.5px #fff,inset 0 0 1px 1px rgba(0,0,0,.3),0 0 1px 2px rgba(0,0,0,.4);cursor:head;height:4px;transform:translate(-2px,-2px);width:4px}";
styleInject(css_248z4);
script4.render = render4;
script4.__file = "src/components/saturation/saturation.vue";
script4.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/hue/index.js
init_vue_runtime_esm_bundler();
var script5 = {
  name: "Hue",
  props: {
    value: Object,
    direction: {
      type: String,
      // [horizontal | vertical]
      default: "horizontal"
    }
  },
  data() {
    return {
      oldHue: 0,
      pullDirection: ""
    };
  },
  computed: {
    colors() {
      return this.value;
    },
    directionClass() {
      return {
        "vc-hue--horizontal": this.direction === "horizontal",
        "vc-hue--vertical": this.direction === "vertical"
      };
    },
    pointerTop() {
      if (this.direction === "vertical") {
        if (this.colors.hsl.h === 0 && this.pullDirection === "right")
          return 0;
        return `${-(this.colors.hsl.h * 100 / 360) + 100}%`;
      }
      return 0;
    },
    pointerLeft() {
      if (this.direction === "vertical")
        return 0;
      if (this.colors.hsl.h === 0 && this.pullDirection === "right")
        return "100%";
      return `${this.colors.hsl.h * 100 / 360}%`;
    }
  },
  watch: {
    value: {
      handler(value, oldVal) {
        const { h } = value.hsl;
        if (h !== 0 && h - this.oldHue > 0)
          this.pullDirection = "right";
        if (h !== 0 && h - this.oldHue < 0)
          this.pullDirection = "left";
        this.oldHue = h;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleChange(e, skip) {
      !skip && e.preventDefault();
      const { container } = this.$refs;
      if (!container) {
        return;
      }
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      const yOffset = container.getBoundingClientRect().top + window.pageYOffset;
      const pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      const pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
      const left = pageX - xOffset;
      const top = pageY - yOffset;
      let h;
      let percent;
      if (this.direction === "vertical") {
        if (top < 0) {
          h = 360;
        } else if (top > containerHeight) {
          h = 0;
        } else {
          percent = -(top * 100 / containerHeight) + 100;
          h = 360 * percent / 100;
        }
        if (this.colors.hsl.h !== h) {
          this.$emit("change", {
            h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: "hsl"
          });
        }
      } else {
        if (left < 0) {
          h = 0;
        } else if (left > containerWidth) {
          h = 360;
        } else {
          percent = left * 100 / containerWidth;
          h = 360 * percent / 100;
        }
        if (this.colors.hsl.h !== h) {
          this.$emit("change", {
            h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: "hsl"
          });
        }
      }
    },
    handleMouseDown(e) {
      this.handleChange(e, true);
      window.addEventListener("mousemove", this.handleChange);
      window.addEventListener("mouseup", this.handleChange);
      window.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseUp(e) {
      this.unbindEventListeners();
    },
    unbindEventListeners() {
      window.removeEventListener("mousemove", this.handleChange);
      window.removeEventListener("mouseup", this.handleChange);
      window.removeEventListener("mouseup", this.handleMouseUp);
    }
  }
};
var _hoisted_14 = ["aria-valuenow"];
var _hoisted_24 = createBaseVNode(
  "div",
  { class: "vc-hue-picker" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_34 = [
  _hoisted_24
];
function render5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["vc-hue", [$options.directionClass]])
    },
    [
      createBaseVNode("div", {
        ref: "container",
        class: "vc-hue-container",
        role: "slider",
        "aria-valuenow": $options.colors.hsl.h,
        "aria-valuemin": "0",
        "aria-valuemax": "360",
        onMousedown: _cache[0] || (_cache[0] = (...args) => $options.handleMouseDown && $options.handleMouseDown(...args)),
        onTouchmove: _cache[1] || (_cache[1] = (...args) => $options.handleChange && $options.handleChange(...args)),
        onTouchstart: _cache[2] || (_cache[2] = (...args) => $options.handleChange && $options.handleChange(...args))
      }, [
        createBaseVNode(
          "div",
          {
            class: "vc-hue-pointer",
            style: normalizeStyle({ top: $options.pointerTop, left: $options.pointerLeft }),
            role: "presentation"
          },
          _hoisted_34,
          4
          /* STYLE */
        )
      ], 40, _hoisted_14)
    ],
    2
    /* CLASS */
  );
}
var css_248z5 = ".vc-hue{border-radius:2px;bottom:0;left:0;position:absolute;right:0;top:0}.vc-hue--horizontal{background:linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)}.vc-hue--vertical{background:linear-gradient(0deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)}.vc-hue-container{cursor:pointer;height:100%;margin:0 2px;position:relative}.vc-hue-pointer{position:absolute;z-index:2}.vc-hue-picker{background:#fff;border-radius:1px;box-shadow:0 0 2px rgba(0,0,0,.6);cursor:pointer;height:8px;margin-top:1px;transform:translateX(-2px);width:4px}";
styleInject(css_248z5);
script5.render = render5;
script5.__file = "src/components/hue/hue.vue";
script5.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/chrome/index.js
init_vue_runtime_esm_bundler();
var script6 = {
  name: "Chrome",
  components: {
    Saturation: script4,
    Hue: script5,
    Alpha: script2,
    EdIn: script3,
    Checkboard: script
  },
  mixins: [colorMixin],
  props: {
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldsIndex: 0,
      highlight: false
    };
  },
  computed: {
    hsl() {
      const { h, s, l } = this.colors.hsl;
      return {
        h: h.toFixed(),
        s: `${(s * 100).toFixed()}%`,
        l: `${(l * 100).toFixed()}%`
      };
    },
    activeColor() {
      const { rgba } = this.colors;
      return `rgba(${[rgba.r, rgba.g, rgba.b, rgba.a].join(",")})`;
    },
    hasAlpha() {
      return this.colors.a < 1;
    }
  },
  methods: {
    childChange(data) {
      this.colorChange(data);
    },
    inputChange(data) {
      if (!data)
        return;
      if (data.hex) {
        this.isValidHex(data.hex) && this.colorChange({
          hex: data.hex,
          source: "hex"
        });
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: "rgba"
        });
      } else if (data.h || data.s || data.l) {
        const s = data.s ? data.s.replace("%", "") / 100 : this.colors.hsl.s;
        const l = data.l ? data.l.replace("%", "") / 100 : this.colors.hsl.l;
        this.colorChange({
          h: data.h || this.colors.hsl.h,
          s,
          l,
          source: "hsl"
        });
      }
    },
    toggleViews() {
      if (this.fieldsIndex >= 2) {
        this.fieldsIndex = 0;
        return;
      }
      this.fieldsIndex++;
    },
    showHighlight() {
      this.highlight = true;
    },
    hideHighlight() {
      this.highlight = false;
    }
  }
};
var _hoisted_15 = { class: "vc-chrome-saturation-wrap" };
var _hoisted_25 = { class: "vc-chrome-body" };
var _hoisted_35 = { class: "vc-chrome-controls" };
var _hoisted_44 = { class: "vc-chrome-color-wrap" };
var _hoisted_5 = ["aria-label"];
var _hoisted_6 = { class: "vc-chrome-sliders" };
var _hoisted_7 = { class: "vc-chrome-hue-wrap" };
var _hoisted_8 = {
  key: 0,
  class: "vc-chrome-alpha-wrap"
};
var _hoisted_9 = {
  key: 0,
  class: "vc-chrome-fields-wrap"
};
var _hoisted_10 = { class: "vc-chrome-fields" };
var _hoisted_11 = { class: "vc-chrome-field" };
var _hoisted_122 = { class: "vc-chrome-fields" };
var _hoisted_132 = { class: "vc-chrome-field" };
var _hoisted_142 = { class: "vc-chrome-field" };
var _hoisted_152 = { class: "vc-chrome-field" };
var _hoisted_16 = {
  key: 0,
  class: "vc-chrome-field"
};
var _hoisted_17 = { class: "vc-chrome-fields" };
var _hoisted_18 = { class: "vc-chrome-field" };
var _hoisted_19 = { class: "vc-chrome-field" };
var _hoisted_20 = { class: "vc-chrome-field" };
var _hoisted_21 = {
  key: 0,
  class: "vc-chrome-field"
};
var _hoisted_222 = { class: "vc-chrome-toggle-icon" };
var _hoisted_232 = createBaseVNode(
  "path",
  {
    fill: "#333",
    d: "M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"
  },
  null,
  -1
  /* HOISTED */
);
var _hoisted_242 = [
  _hoisted_232
];
var _hoisted_252 = { class: "vc-chrome-toggle-icon-highlight" };
function render6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Saturation = resolveComponent("Saturation");
  const _component_Checkboard = resolveComponent("Checkboard");
  const _component_Hue = resolveComponent("Hue");
  const _component_Alpha = resolveComponent("Alpha");
  const _component_EdIn = resolveComponent("EdIn");
  return openBlock(), createElementBlock(
    "div",
    {
      role: "application",
      "aria-label": "Chrome color picker",
      class: normalizeClass(["vc-chrome", [$props.disableAlpha ? "vc-chrome__disable-alpha" : ""]])
    },
    [
      createBaseVNode("div", _hoisted_15, [
        createVNode(_component_Saturation, {
          value: _ctx.colors,
          onChange: $options.childChange
        }, null, 8, ["value", "onChange"])
      ]),
      createBaseVNode("div", _hoisted_25, [
        createBaseVNode("div", _hoisted_35, [
          createBaseVNode("div", _hoisted_44, [
            createBaseVNode("div", {
              "aria-label": `current color is ${_ctx.colors.hex}`,
              class: "vc-chrome-active-color",
              style: normalizeStyle({ background: $options.activeColor })
            }, null, 12, _hoisted_5),
            !$props.disableAlpha ? (openBlock(), createBlock(_component_Checkboard, { key: 0 })) : createCommentVNode("v-if", true)
          ]),
          createBaseVNode("div", _hoisted_6, [
            createBaseVNode("div", _hoisted_7, [
              createVNode(_component_Hue, {
                value: _ctx.colors,
                onChange: $options.childChange
              }, null, 8, ["value", "onChange"])
            ]),
            !$props.disableAlpha ? (openBlock(), createElementBlock("div", _hoisted_8, [
              createVNode(_component_Alpha, {
                value: _ctx.colors,
                onChange: $options.childChange
              }, null, 8, ["value", "onChange"])
            ])) : createCommentVNode("v-if", true)
          ])
        ]),
        !$props.disableFields ? (openBlock(), createElementBlock("div", _hoisted_9, [
          withDirectives(createBaseVNode(
            "div",
            _hoisted_10,
            [
              createCommentVNode(" hex "),
              createBaseVNode("div", _hoisted_11, [
                !$options.hasAlpha ? (openBlock(), createBlock(_component_EdIn, {
                  key: 0,
                  label: "hex",
                  value: _ctx.colors.hex,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])) : createCommentVNode("v-if", true),
                $options.hasAlpha ? (openBlock(), createBlock(_component_EdIn, {
                  key: 1,
                  label: "hex",
                  value: _ctx.colors.hex8,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])) : createCommentVNode("v-if", true)
              ])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vShow, $data.fieldsIndex === 0]
          ]),
          withDirectives(createBaseVNode(
            "div",
            _hoisted_122,
            [
              createCommentVNode(" rgba "),
              createBaseVNode("div", _hoisted_132, [
                createVNode(_component_EdIn, {
                  label: "r",
                  value: _ctx.colors.rgba.r,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              createBaseVNode("div", _hoisted_142, [
                createVNode(_component_EdIn, {
                  label: "g",
                  value: _ctx.colors.rgba.g,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              createBaseVNode("div", _hoisted_152, [
                createVNode(_component_EdIn, {
                  label: "b",
                  value: _ctx.colors.rgba.b,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              !$props.disableAlpha ? (openBlock(), createElementBlock("div", _hoisted_16, [
                createVNode(_component_EdIn, {
                  label: "a",
                  value: _ctx.colors.a,
                  "arrow-offset": 0.01,
                  max: 1,
                  onChange: $options.inputChange
                }, null, 8, ["value", "arrow-offset", "onChange"])
              ])) : createCommentVNode("v-if", true)
            ],
            512
            /* NEED_PATCH */
          ), [
            [vShow, $data.fieldsIndex === 1]
          ]),
          withDirectives(createBaseVNode(
            "div",
            _hoisted_17,
            [
              createCommentVNode(" hsla "),
              createBaseVNode("div", _hoisted_18, [
                createVNode(_component_EdIn, {
                  label: "h",
                  value: $options.hsl.h,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              createBaseVNode("div", _hoisted_19, [
                createVNode(_component_EdIn, {
                  label: "s",
                  value: $options.hsl.s,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              createBaseVNode("div", _hoisted_20, [
                createVNode(_component_EdIn, {
                  label: "l",
                  value: $options.hsl.l,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              !$props.disableAlpha ? (openBlock(), createElementBlock("div", _hoisted_21, [
                createVNode(_component_EdIn, {
                  label: "a",
                  value: _ctx.colors.a,
                  "arrow-offset": 0.01,
                  max: 1,
                  onChange: $options.inputChange
                }, null, 8, ["value", "arrow-offset", "onChange"])
              ])) : createCommentVNode("v-if", true)
            ],
            512
            /* NEED_PATCH */
          ), [
            [vShow, $data.fieldsIndex === 2]
          ]),
          createCommentVNode(" btn "),
          createBaseVNode("div", {
            class: "vc-chrome-toggle-btn",
            role: "button",
            "aria-label": "Change another color definition",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.toggleViews && $options.toggleViews(...args))
          }, [
            createBaseVNode("div", _hoisted_222, [
              (openBlock(), createElementBlock(
                "svg",
                {
                  style: { "width": "24px", "height": "24px" },
                  viewBox: "0 0 24 24",
                  onMouseover: _cache[0] || (_cache[0] = (...args) => $options.showHighlight && $options.showHighlight(...args)),
                  onMouseenter: _cache[1] || (_cache[1] = (...args) => $options.showHighlight && $options.showHighlight(...args)),
                  onMouseout: _cache[2] || (_cache[2] = (...args) => $options.hideHighlight && $options.hideHighlight(...args))
                },
                _hoisted_242,
                32
                /* HYDRATE_EVENTS */
              ))
            ]),
            withDirectives(createBaseVNode(
              "div",
              _hoisted_252,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, $data.highlight]
            ])
          ]),
          createCommentVNode(" btn ")
        ])) : createCommentVNode("v-if", true)
      ])
    ],
    2
    /* CLASS */
  );
}
var css_248z6 = ".vc-chrome{background:#fff;background-color:#fff;border-radius:2px;box-shadow:0 0 2px rgba(0,0,0,.3),0 4px 8px rgba(0,0,0,.3);box-sizing:initial;font-family:Menlo;width:225px}.vc-chrome-controls{display:flex}.vc-chrome-color-wrap{position:relative;width:36px}.vc-chrome-active-color{border-radius:15px;height:30px;overflow:hidden;position:relative;width:30px;z-index:1}.vc-chrome-color-wrap .vc-checkerboard{background-size:auto;border-radius:15px;height:30px;width:30px}.vc-chrome-sliders{flex:1}.vc-chrome-fields-wrap{display:flex;padding-top:16px}.vc-chrome-fields{display:flex;flex:1;margin-left:-6px}.vc-chrome-field{padding-left:6px;width:100%}.vc-chrome-toggle-btn{position:relative;text-align:right;width:32px}.vc-chrome-toggle-icon{cursor:pointer;margin-right:-4px;margin-top:12px;position:relative;z-index:2}.vc-chrome-toggle-icon-highlight{background:#eee;border-radius:4px;height:28px;left:12px;position:absolute;top:10px;width:24px}.vc-chrome-hue-wrap{margin-bottom:8px}.vc-chrome-alpha-wrap,.vc-chrome-hue-wrap{height:10px;position:relative}.vc-chrome-alpha-wrap .vc-alpha-gradient,.vc-chrome-hue-wrap .vc-hue{border-radius:2px}.vc-chrome-alpha-wrap .vc-alpha-picker,.vc-chrome-hue-wrap .vc-hue-picker{background-color:#f8f8f8;border-radius:6px;box-shadow:0 1px 4px 0 rgba(0,0,0,.37);height:12px;transform:translate(-6px,-2px);width:12px}.vc-chrome-body{background-color:#fff;padding:16px 16px 12px}.vc-chrome-saturation-wrap{border-radius:2px 2px 0 0;overflow:hidden;padding-bottom:55%;position:relative;width:100%}.vc-chrome-saturation-wrap .vc-saturation-circle{height:12px;width:12px}.vc-chrome-fields .vc-input__input{border:none;border-radius:2px;box-shadow:inset 0 0 0 1px #dadada;color:#333;font-size:11px;height:21px;text-align:center;width:100%}.vc-chrome-fields .vc-input__label{color:#969696;display:block;font-size:11px;line-height:11px;margin-top:12px;text-align:center;text-transform:uppercase}.vc-chrome__disable-alpha .vc-chrome-active-color{height:18px;width:18px}.vc-chrome__disable-alpha .vc-chrome-color-wrap{width:30px}.vc-chrome__disable-alpha .vc-chrome-hue-wrap{margin-bottom:4px;margin-top:4px}";
styleInject(css_248z6);
script6.render = render6;
script6.__file = "src/components/chrome/chrome.vue";
script6.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/compact/index.js
init_vue_runtime_esm_bundler();
var defaultColors = [
  "#4D4D4D",
  "#999999",
  "#FFFFFF",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
  "#A4DD00",
  "#68CCCA",
  "#73D8FF",
  "#AEA1FF",
  "#FDA1FF",
  "#333333",
  "#808080",
  "#CCCCCC",
  "#D33115",
  "#E27300",
  "#FCC400",
  "#B0BC00",
  "#68BC00",
  "#16A5A5",
  "#009CE0",
  "#7B64FF",
  "#FA28FF",
  "#000000",
  "#666666",
  "#B3B3B3",
  "#9F0500",
  "#C45100",
  "#FB9E00",
  "#808900",
  "#194D33",
  "#0C797D",
  "#0062B1",
  "#653294",
  "#AB149E"
];
var script7 = {
  name: "Compact",
  mixins: [colorMixin],
  props: {
    palette: {
      type: Array,
      default() {
        return defaultColors;
      }
    }
  },
  computed: {
    pick() {
      return this.colors.hex.toUpperCase();
    }
  },
  methods: {
    handlerClick(c) {
      this.colorChange({
        hex: c,
        source: "hex"
      });
    }
  }
};
var _hoisted_110 = {
  role: "application",
  "aria-label": "Compact color picker",
  class: "vc-compact"
};
var _hoisted_26 = {
  class: "vc-compact-colors",
  role: "listbox"
};
var _hoisted_36 = ["aria-label", "aria-selected", "onClick"];
var _hoisted_45 = { class: "vc-compact-dot" };
function render7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_110, [
    createBaseVNode("ul", _hoisted_26, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(_ctx.paletteUpperCase($props.palette), (c) => {
          return openBlock(), createElementBlock("li", {
            key: c,
            role: "option",
            "aria-label": `color:${c}`,
            "aria-selected": c === $options.pick,
            class: normalizeClass(["vc-compact-color-item", { "vc-compact-color-item--white": c === "#FFFFFF" }]),
            style: normalizeStyle({ background: c }),
            onClick: ($event) => $options.handlerClick(c)
          }, [
            withDirectives(createBaseVNode(
              "div",
              _hoisted_45,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, c === $options.pick]
            ])
          ], 14, _hoisted_36);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
var css_248z7 = ".vc-compact{background-color:#fff;border-radius:2px;box-shadow:0 2px 10px rgba(0,0,0,.12),0 2px 5px rgba(0,0,0,.16);box-sizing:border-box;padding-left:5px;padding-top:5px;width:245px}.vc-compact-colors{margin:0;overflow:hidden;padding:0}.vc-compact-color-item{cursor:pointer;float:left;height:15px;list-style:none;margin-bottom:5px;margin-right:5px;position:relative;width:15px}.vc-compact-color-item--white{box-shadow:inset 0 0 0 1px #ddd}.vc-compact-color-item--white .vc-compact-dot{background:#000}.vc-compact-dot{background:#fff;border-radius:50%;bottom:5px;left:5px;opacity:1;position:absolute;right:5px;top:5px}";
styleInject(css_248z7);
script7.render = render7;
script7.__file = "src/components/compact/compact.vue";
script7.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/grayscale/index.js
init_vue_runtime_esm_bundler();
var defaultColors2 = [
  "#FFFFFF",
  "#F2F2F2",
  "#E6E6E6",
  "#D9D9D9",
  "#CCCCCC",
  "#BFBFBF",
  "#B3B3B3",
  "#A6A6A6",
  "#999999",
  "#8C8C8C",
  "#808080",
  "#737373",
  "#666666",
  "#595959",
  "#4D4D4D",
  "#404040",
  "#333333",
  "#262626",
  "#0D0D0D",
  "#000000"
];
var script8 = {
  name: "Grayscale",
  components: {},
  mixins: [colorMixin],
  props: {
    palette: {
      type: Array,
      default() {
        return defaultColors2;
      }
    }
  },
  computed: {
    pick() {
      return this.colors.hex.toUpperCase();
    }
  },
  methods: {
    handlerClick(c) {
      this.colorChange({
        hex: c,
        source: "hex"
      });
    }
  }
};
var _hoisted_111 = {
  role: "application",
  "aria-label": "Grayscale color picker",
  class: "vc-grayscale"
};
var _hoisted_27 = {
  class: "vc-grayscale-colors",
  role: "listbox"
};
var _hoisted_37 = ["aria-label", "aria-selected", "onClick"];
var _hoisted_46 = { class: "vc-grayscale-dot" };
function render8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_111, [
    createBaseVNode("ul", _hoisted_27, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList(_ctx.paletteUpperCase($props.palette), (c) => {
          return openBlock(), createElementBlock("li", {
            key: c,
            role: "option",
            "aria-label": `Color:${c}`,
            "aria-selected": c === $options.pick,
            class: normalizeClass(["vc-grayscale-color-item", { "vc-grayscale-color-item--white": c === "#FFFFFF" }]),
            style: normalizeStyle({ background: c }),
            onClick: ($event) => $options.handlerClick(c)
          }, [
            withDirectives(createBaseVNode(
              "div",
              _hoisted_46,
              null,
              512
              /* NEED_PATCH */
            ), [
              [vShow, c === $options.pick]
            ])
          ], 14, _hoisted_37);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
var css_248z8 = ".vc-grayscale{background-color:#fff;border-radius:2px;box-shadow:0 2px 15px rgba(0,0,0,.12),0 2px 10px rgba(0,0,0,.16);width:125px}.vc-grayscale-colors{border-radius:2px;margin:0;overflow:hidden;padding:0}.vc-grayscale-color-item{cursor:pointer;float:left;height:25px;list-style:none;position:relative;width:25px}.vc-grayscale-color-item--white .vc-grayscale-dot{background:#000}.vc-grayscale-dot{background:#fff;border-radius:50%;height:6px;left:50%;margin:-3px 0 0 -2px;opacity:1;position:absolute;top:50%;width:6px}";
styleInject(css_248z8);
script8.render = render8;
script8.__file = "src/components/grayscale/grayscale.vue";
script8.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/material/index.js
init_vue_runtime_esm_bundler();
var script9 = {
  name: "Material",
  components: {
    EdIn: script3
  },
  mixins: [colorMixin],
  methods: {
    onChange(data) {
      if (!data)
        return;
      if (data.hex) {
        this.isValidHex(data.hex) && this.colorChange({
          hex: data.hex,
          source: "hex"
        });
      } else if (data.r || data.g || data.b) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: "rgba"
        });
      }
    }
  }
};
var _hoisted_112 = {
  role: "application",
  "aria-label": "Material color picker",
  class: "vc-material"
};
var _hoisted_28 = { class: "vc-material-split" };
var _hoisted_38 = { class: "vc-material-third" };
var _hoisted_47 = { class: "vc-material-third" };
var _hoisted_52 = { class: "vc-material-third" };
function render9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_EdIn = resolveComponent("EdIn");
  return openBlock(), createElementBlock("div", _hoisted_112, [
    createVNode(_component_EdIn, {
      class: "vc-material-hex",
      label: "hex",
      value: _ctx.colors.hex,
      style: normalizeStyle({ borderColor: _ctx.colors.hex }),
      onChange: $options.onChange
    }, null, 8, ["value", "style", "onChange"]),
    createBaseVNode("div", _hoisted_28, [
      createBaseVNode("div", _hoisted_38, [
        createVNode(_component_EdIn, {
          label: "r",
          value: _ctx.colors.rgba.r,
          onChange: $options.onChange
        }, null, 8, ["value", "onChange"])
      ]),
      createBaseVNode("div", _hoisted_47, [
        createVNode(_component_EdIn, {
          label: "g",
          value: _ctx.colors.rgba.g,
          onChange: $options.onChange
        }, null, 8, ["value", "onChange"])
      ]),
      createBaseVNode("div", _hoisted_52, [
        createVNode(_component_EdIn, {
          label: "b",
          value: _ctx.colors.rgba.b,
          onChange: $options.onChange
        }, null, 8, ["value", "onChange"])
      ])
    ])
  ]);
}
var css_248z9 = ".vc-material{background-color:#fff;border-radius:2px;box-shadow:0 2px 10px rgba(0,0,0,.12),0 2px 5px rgba(0,0,0,.16);font-family:Roboto;height:98px;padding:16px;position:relative;width:98px}.vc-material .vc-input__input{color:#333;font-size:15px;height:30px;margin-top:12px;width:100%}.vc-material .vc-input__label{color:#999;font-size:11px;left:0;position:absolute;text-transform:capitalize;top:0}.vc-material-hex{border-bottom-style:solid;border-bottom-width:2px}.vc-material-split{display:flex;margin-right:-10px;padding-top:11px}.vc-material-third{flex:1;padding-right:10px}";
styleInject(css_248z9);
script9.render = render9;
script9.__file = "src/components/material/material.vue";
script9.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/photoshop/index.js
init_vue_runtime_esm_bundler();
var script10 = {
  name: "Photoshop",
  components: {
    Saturation: script4,
    Hue: script5,
    EdIn: script3
  },
  mixins: [colorMixin],
  props: {
    head: {
      type: String,
      default: "Color Picker"
    },
    disableFields: {
      type: Boolean,
      default: false
    },
    hasResetButton: {
      type: Boolean,
      default: false
    },
    acceptLabel: {
      type: String,
      default: "OK"
    },
    cancelLabel: {
      type: String,
      default: "Cancel"
    },
    resetLabel: {
      type: String,
      default: "Reset"
    },
    newLabel: {
      type: String,
      default: "new"
    },
    currentLabel: {
      type: String,
      default: "current"
    }
  },
  data() {
    return {
      currentColor: "#FFF"
    };
  },
  computed: {
    hsv() {
      const { hsv } = this.colors;
      return {
        h: hsv.h.toFixed(),
        s: (hsv.s * 100).toFixed(),
        v: (hsv.v * 100).toFixed()
      };
    },
    hex() {
      const { hex } = this.colors;
      return hex && hex.replace("#", "");
    }
  },
  created() {
    this.currentColor = this.colors.hex;
  },
  methods: {
    childChange(data) {
      this.colorChange(data);
    },
    inputChange(data) {
      if (!data)
        return;
      if (data["#"]) {
        this.isValidHex(data["#"]) && this.colorChange({
          hex: data["#"],
          source: "hex"
        });
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: "rgba"
        });
      } else if (data.h || data.s || data.v) {
        this.colorChange({
          h: data.h || this.colors.hsv.h,
          s: data.s / 100 || this.colors.hsv.s,
          v: data.v / 100 || this.colors.hsv.v,
          source: "hsv"
        });
      }
    },
    clickCurrentColor() {
      this.colorChange({
        hex: this.currentColor,
        source: "hex"
      });
    },
    handleAccept() {
      this.$emit("ok");
    },
    handleCancel() {
      this.$emit("cancel");
    },
    handleReset() {
      this.$emit("reset");
    }
  }
};
var _hoisted_113 = {
  role: "heading",
  class: "vc-ps-head"
};
var _hoisted_29 = { class: "vc-ps-body" };
var _hoisted_39 = { class: "vc-ps-saturation-wrap" };
var _hoisted_48 = { class: "vc-ps-hue-wrap" };
var _hoisted_53 = createBaseVNode(
  "div",
  { class: "vc-ps-hue-pointer" },
  [
    createBaseVNode("i", { class: "vc-ps-hue-pointer--left" }),
    createBaseVNode("i", { class: "vc-ps-hue-pointer--right" })
  ],
  -1
  /* HOISTED */
);
var _hoisted_62 = { class: "vc-ps-previews" };
var _hoisted_72 = { class: "vc-ps-previews__label" };
var _hoisted_82 = { class: "vc-ps-previews__swatches" };
var _hoisted_92 = ["aria-label"];
var _hoisted_102 = ["aria-label"];
var _hoisted_114 = { class: "vc-ps-previews__label" };
var _hoisted_123 = {
  key: 0,
  class: "vc-ps-actions"
};
var _hoisted_133 = ["aria-label"];
var _hoisted_143 = ["aria-label"];
var _hoisted_153 = { class: "vc-ps-fields" };
var _hoisted_162 = createBaseVNode(
  "div",
  { class: "vc-ps-fields__divider" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_172 = createBaseVNode(
  "div",
  { class: "vc-ps-fields__divider" },
  null,
  -1
  /* HOISTED */
);
function render10(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Saturation = resolveComponent("Saturation");
  const _component_Hue = resolveComponent("Hue");
  const _component_EdIn = resolveComponent("EdIn");
  return openBlock(), createElementBlock(
    "div",
    {
      role: "application",
      "aria-label": "PhotoShop color picker",
      class: normalizeClass(["vc-photoshop", [$props.disableFields ? "vc-photoshop__disable-fields" : ""]])
    },
    [
      createBaseVNode(
        "div",
        _hoisted_113,
        toDisplayString($props.head),
        1
        /* TEXT */
      ),
      createBaseVNode("div", _hoisted_29, [
        createBaseVNode("div", _hoisted_39, [
          createVNode(_component_Saturation, {
            value: _ctx.colors,
            onChange: $options.childChange
          }, null, 8, ["value", "onChange"])
        ]),
        createBaseVNode("div", _hoisted_48, [
          createVNode(_component_Hue, {
            value: _ctx.colors,
            direction: "vertical",
            onChange: $options.childChange
          }, {
            default: withCtx(() => [
              _hoisted_53
            ]),
            _: 1
            /* STABLE */
          }, 8, ["value", "onChange"])
        ]),
        createBaseVNode(
          "div",
          {
            class: normalizeClass(["vc-ps-controls", [$props.disableFields ? "vc-ps-controls__disable-fields" : ""]])
          },
          [
            createBaseVNode("div", _hoisted_62, [
              createBaseVNode(
                "div",
                _hoisted_72,
                toDisplayString($props.newLabel),
                1
                /* TEXT */
              ),
              createBaseVNode("div", _hoisted_82, [
                createBaseVNode("div", {
                  class: "vc-ps-previews__pr-color",
                  "aria-label": `New color is ${_ctx.colors.hex}`,
                  style: normalizeStyle({ background: _ctx.colors.hex })
                }, null, 12, _hoisted_92),
                createBaseVNode("div", {
                  class: "vc-ps-previews__pr-color",
                  "aria-label": `Current color is ${$data.currentColor}`,
                  style: normalizeStyle({ background: $data.currentColor }),
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.clickCurrentColor && $options.clickCurrentColor(...args))
                }, null, 12, _hoisted_102)
              ]),
              createBaseVNode(
                "div",
                _hoisted_114,
                toDisplayString($props.currentLabel),
                1
                /* TEXT */
              )
            ]),
            !$props.disableFields ? (openBlock(), createElementBlock("div", _hoisted_123, [
              createBaseVNode("div", {
                class: "vc-ps-ac-btn",
                role: "button",
                "aria-label": $props.acceptLabel,
                onClick: _cache[1] || (_cache[1] = (...args) => $options.handleAccept && $options.handleAccept(...args))
              }, toDisplayString($props.acceptLabel), 9, _hoisted_133),
              createBaseVNode("div", {
                class: "vc-ps-ac-btn",
                role: "button",
                "aria-label": $props.cancelLabel,
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleCancel && $options.handleCancel(...args))
              }, toDisplayString($props.cancelLabel), 9, _hoisted_143),
              createBaseVNode("div", _hoisted_153, [
                createCommentVNode(" hsla "),
                createVNode(_component_EdIn, {
                  label: "h",
                  desc: "°",
                  value: $options.hsv.h,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"]),
                createVNode(_component_EdIn, {
                  label: "s",
                  desc: "%",
                  value: $options.hsv.s,
                  max: 100,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"]),
                createVNode(_component_EdIn, {
                  label: "v",
                  desc: "%",
                  value: $options.hsv.v,
                  max: 100,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"]),
                _hoisted_162,
                createCommentVNode(" rgba "),
                createVNode(_component_EdIn, {
                  label: "r",
                  value: _ctx.colors.rgba.r,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"]),
                createVNode(_component_EdIn, {
                  label: "g",
                  value: _ctx.colors.rgba.g,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"]),
                createVNode(_component_EdIn, {
                  label: "b",
                  value: _ctx.colors.rgba.b,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"]),
                _hoisted_172,
                createCommentVNode(" hex "),
                createVNode(_component_EdIn, {
                  label: "#",
                  class: "vc-ps-fields__hex",
                  value: $options.hex,
                  onChange: $options.inputChange
                }, null, 8, ["value", "onChange"])
              ]),
              $props.hasResetButton ? (openBlock(), createElementBlock(
                "div",
                {
                  key: 0,
                  class: "vc-ps-ac-btn",
                  "aria-label": "reset",
                  onClick: _cache[3] || (_cache[3] = (...args) => $options.handleReset && $options.handleReset(...args))
                },
                toDisplayString($props.resetLabel),
                1
                /* TEXT */
              )) : createCommentVNode("v-if", true)
            ])) : createCommentVNode("v-if", true)
          ],
          2
          /* CLASS */
        )
      ])
    ],
    2
    /* CLASS */
  );
}
var css_248z10 = '.vc-photoshop{background:#dcdcdc;border-radius:4px;box-shadow:0 0 0 1px rgba(0,0,0,.25),0 8px 16px rgba(0,0,0,.15);box-sizing:initial;font-family:Roboto;width:513px}.vc-photoshop__disable-fields{width:390px}.vc-ps-head{background-image:linear-gradient(-180deg,#f0f0f0,#d4d4d4);border-bottom:1px solid #b1b1b1;border-radius:4px 4px 0 0;box-shadow:inset 0 1px 0 0 hsla(0,0%,100%,.2),inset 0 -1px 0 0 rgba(0,0,0,.02);color:#4d4d4d;font-size:13px;height:23px;line-height:24px;text-align:center}.vc-ps-body{display:flex;padding:15px}.vc-ps-saturation-wrap{border:2px solid #b3b3b3;border-bottom-color:#f0f0f0;height:256px;overflow:hidden;position:relative;width:256px}.vc-ps-saturation-wrap .vc-saturation-circle{height:12px;width:12px}.vc-ps-hue-wrap{border:2px solid #b3b3b3;border-bottom-color:#f0f0f0;height:256px;margin-left:10px;width:19px}.vc-ps-hue-pointer,.vc-ps-hue-wrap{position:relative}.vc-ps-hue-pointer--left,.vc-ps-hue-pointer--right{border-color:transparent transparent transparent #555;border-style:solid;border-width:5px 0 5px 8px;height:0;position:absolute;width:0}.vc-ps-hue-pointer--left:after,.vc-ps-hue-pointer--right:after{border-color:transparent transparent transparent #fff;border-style:solid;border-width:4px 0 4px 6px;content:"";height:0;left:1px;position:absolute;top:1px;transform:translate(-8px,-5px);width:0}.vc-ps-hue-pointer--left{transform:translate(-13px,-4px)}.vc-ps-hue-pointer--right{transform:translate(20px,-4px) rotate(180deg)}.vc-ps-controls{display:flex;margin-left:10px;width:180px}.vc-ps-controls__disable-fields{width:auto}.vc-ps-actions{flex:1;margin-left:20px}.vc-ps-ac-btn{background-image:linear-gradient(-180deg,#fff,#e6e6e6);border:1px solid #878787;border-radius:2px;box-shadow:0 1px 0 0 #eaeaea;color:#000;cursor:pointer;font-size:14px;height:20px;line-height:20px;margin-bottom:10px;text-align:center}.vc-ps-previews{width:60px}.vc-ps-previews__swatches{border:1px solid #b3b3b3;border-bottom-color:#f0f0f0;margin-bottom:2px;margin-top:1px}.vc-ps-previews__pr-color{box-shadow:inset 1px 0 0 #000,inset -1px 0 0 #000,inset 0 1px 0 #000;height:34px}.vc-ps-previews__label{color:#000;font-size:14px;text-align:center}.vc-ps-fields{padding-bottom:9px;padding-top:5px;position:relative;width:80px}.vc-ps-fields .vc-input__input{border:1px solid #888;box-shadow:inset 0 1px 1px rgba(0,0,0,.1),0 1px 0 0 #ececec;font-size:13px;height:18px;margin-bottom:5px;margin-left:40%;margin-right:10px;padding-left:3px;width:40%}.vc-ps-fields .vc-input__desc,.vc-ps-fields .vc-input__label{font-size:13px;height:18px;line-height:22px;position:absolute;text-transform:uppercase;top:0}.vc-ps-fields .vc-input__label{left:0;width:34px}.vc-ps-fields .vc-input__desc{right:0;width:0}.vc-ps-fields__divider{height:5px}.vc-ps-fields__hex .vc-input__input{border:1px solid #888;box-shadow:inset 0 1px 1px rgba(0,0,0,.1),0 1px 0 0 #ececec;font-size:13px;height:18px;margin-bottom:6px;margin-left:20%;padding-left:3px;width:80%}.vc-ps-fields__hex .vc-input__label{font-size:13px;height:18px;left:0;line-height:22px;position:absolute;text-transform:uppercase;top:0;width:14px}';
styleInject(css_248z10);
script10.render = render10;
script10.__file = "src/components/photoshop/photoshop.vue";
script10.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/sketch/index.js
init_vue_runtime_esm_bundler();
var presetColors = [
  "#D0021B",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#50E3C2",
  "#B8E986",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
  "#FFFFFF",
  "rgba(0,0,0,0)"
];
var script11 = {
  name: "Sketch",
  components: {
    Saturation: script4,
    Hue: script5,
    Alpha: script2,
    EdIn: script3,
    Checkboard: script
  },
  mixins: [colorMixin],
  props: {
    presetColors: {
      type: Array,
      default() {
        return presetColors;
      }
    },
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hex() {
      let hex;
      if (this.colors.a < 1)
        hex = this.colors.hex8;
      else
        hex = this.colors.hex;
      return hex.replace("#", "");
    },
    activeColor() {
      const { rgba } = this.colors;
      return `rgba(${[rgba.r, rgba.g, rgba.b, rgba.a].join(",")})`;
    }
  },
  methods: {
    handlePreset(c) {
      this.colorChange(c);
    },
    childChange(data) {
      this.colorChange(data);
    },
    inputChange(data) {
      if (!data)
        return;
      if (data.hex) {
        this.isValidHex(data.hex) && this.colorChange({
          hex: data.hex,
          source: "hex"
        });
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: "rgba"
        });
      }
    }
  }
};
var _hoisted_115 = { class: "vc-sketch-saturation-wrap" };
var _hoisted_210 = { class: "vc-sketch-controls" };
var _hoisted_310 = { class: "vc-sketch-sliders" };
var _hoisted_49 = { class: "vc-sketch-hue-wrap" };
var _hoisted_54 = {
  key: 0,
  class: "vc-sketch-alpha-wrap"
};
var _hoisted_63 = { class: "vc-sketch-color-wrap" };
var _hoisted_73 = ["aria-label"];
var _hoisted_83 = {
  key: 0,
  class: "vc-sketch-field"
};
var _hoisted_93 = { class: "vc-sketch-field--double" };
var _hoisted_103 = { class: "vc-sketch-field--single" };
var _hoisted_116 = { class: "vc-sketch-field--single" };
var _hoisted_124 = { class: "vc-sketch-field--single" };
var _hoisted_134 = {
  key: 0,
  class: "vc-sketch-field--single"
};
var _hoisted_144 = {
  class: "vc-sketch-presets",
  role: "group",
  "aria-label": "A color preset, pick one to set as current color"
};
var _hoisted_154 = ["aria-label", "onClick"];
var _hoisted_163 = ["aria-label", "onClick"];
function render11(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Saturation = resolveComponent("Saturation");
  const _component_Hue = resolveComponent("Hue");
  const _component_Alpha = resolveComponent("Alpha");
  const _component_Checkboard = resolveComponent("Checkboard");
  const _component_EdIn = resolveComponent("EdIn");
  return openBlock(), createElementBlock(
    "div",
    {
      role: "application",
      "aria-label": "Sketch color picker",
      class: normalizeClass(["vc-sketch", [$props.disableAlpha ? "vc-sketch__disable-alpha" : ""]])
    },
    [
      createBaseVNode("div", _hoisted_115, [
        createVNode(_component_Saturation, {
          value: _ctx.colors,
          onChange: $options.childChange
        }, null, 8, ["value", "onChange"])
      ]),
      createBaseVNode("div", _hoisted_210, [
        createBaseVNode("div", _hoisted_310, [
          createBaseVNode("div", _hoisted_49, [
            createVNode(_component_Hue, {
              value: _ctx.colors,
              onChange: $options.childChange
            }, null, 8, ["value", "onChange"])
          ]),
          !$props.disableAlpha ? (openBlock(), createElementBlock("div", _hoisted_54, [
            createVNode(_component_Alpha, {
              value: _ctx.colors,
              onChange: $options.childChange
            }, null, 8, ["value", "onChange"])
          ])) : createCommentVNode("v-if", true)
        ]),
        createBaseVNode("div", _hoisted_63, [
          createBaseVNode("div", {
            "aria-label": `Current color is ${$options.activeColor}`,
            class: "vc-sketch-active-color",
            style: normalizeStyle({ background: $options.activeColor })
          }, null, 12, _hoisted_73),
          createVNode(_component_Checkboard)
        ])
      ]),
      !$props.disableFields ? (openBlock(), createElementBlock("div", _hoisted_83, [
        createCommentVNode(" rgba "),
        createBaseVNode("div", _hoisted_93, [
          createVNode(_component_EdIn, {
            label: "hex",
            value: $options.hex,
            onChange: $options.inputChange
          }, null, 8, ["value", "onChange"])
        ]),
        createBaseVNode("div", _hoisted_103, [
          createVNode(_component_EdIn, {
            label: "r",
            value: _ctx.colors.rgba.r,
            onChange: $options.inputChange
          }, null, 8, ["value", "onChange"])
        ]),
        createBaseVNode("div", _hoisted_116, [
          createVNode(_component_EdIn, {
            label: "g",
            value: _ctx.colors.rgba.g,
            onChange: $options.inputChange
          }, null, 8, ["value", "onChange"])
        ]),
        createBaseVNode("div", _hoisted_124, [
          createVNode(_component_EdIn, {
            label: "b",
            value: _ctx.colors.rgba.b,
            onChange: $options.inputChange
          }, null, 8, ["value", "onChange"])
        ]),
        !$props.disableAlpha ? (openBlock(), createElementBlock("div", _hoisted_134, [
          createVNode(_component_EdIn, {
            label: "a",
            value: _ctx.colors.a,
            "arrow-offset": 0.01,
            max: 1,
            onChange: $options.inputChange
          }, null, 8, ["value", "arrow-offset", "onChange"])
        ])) : createCommentVNode("v-if", true)
      ])) : createCommentVNode("v-if", true),
      createBaseVNode("div", _hoisted_144, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.presetColors, (c) => {
            return openBlock(), createElementBlock(
              Fragment,
              null,
              [
                !_ctx.isTransparent(c) ? (openBlock(), createElementBlock("div", {
                  key: `!${c}`,
                  class: "vc-sketch-presets-color",
                  "aria-label": `Color:${c}`,
                  style: normalizeStyle({ background: c }),
                  onClick: ($event) => $options.handlePreset(c)
                }, null, 12, _hoisted_154)) : (openBlock(), createElementBlock("div", {
                  key: c,
                  "aria-label": `Color:${c}`,
                  class: "vc-sketch-presets-color",
                  onClick: ($event) => $options.handlePreset(c)
                }, [
                  createVNode(_component_Checkboard)
                ], 8, _hoisted_163))
              ],
              64
              /* STABLE_FRAGMENT */
            );
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ])
    ],
    2
    /* CLASS */
  );
}
var css_248z11 = ".vc-sketch{background:#fff;border-radius:4px;box-shadow:0 0 0 1px rgba(0,0,0,.15),0 8px 16px rgba(0,0,0,.15);box-sizing:initial;padding:10px 10px 0;position:relative;width:200px}.vc-sketch-saturation-wrap{overflow:hidden;padding-bottom:75%;position:relative;width:100%}.vc-sketch-controls{display:flex}.vc-sketch-sliders{flex:1;padding:4px 0}.vc-sketch-sliders .vc-alpha-gradient,.vc-sketch-sliders .vc-hue{border-radius:2px}.vc-sketch-alpha-wrap,.vc-sketch-hue-wrap{height:10px;position:relative}.vc-sketch-alpha-wrap{margin-top:4px;overflow:hidden}.vc-sketch-color-wrap{border-radius:3px;height:24px;margin-left:4px;margin-top:4px;position:relative;width:24px}.vc-sketch-active-color{border-radius:2px;bottom:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15),inset 0 0 4px rgba(0,0,0,.25);left:0;position:absolute;right:0;top:0;z-index:2}.vc-sketch-color-wrap .vc-checkerboard{background-size:auto}.vc-sketch-field{display:flex;padding-top:4px}.vc-sketch-field .vc-input__input{border:none;box-shadow:inset 0 0 0 1px #ccc;font-size:10px;padding:4px 0 3px 10%;width:90%}.vc-sketch-field .vc-input__label{color:#222;display:block;font-size:11px;padding-bottom:4px;padding-top:3px;text-align:center;text-transform:capitalize}.vc-sketch-field--single{flex:1;padding-left:6px}.vc-sketch-field--double{flex:2}.vc-sketch-presets{border-top:1px solid #eee;margin-left:-10px;margin-right:-10px;padding-left:10px;padding-top:10px}.vc-sketch-presets-color{cursor:pointer;display:inline-block;height:16px;margin:0 10px 10px 0;overflow:hidden;position:relative;vertical-align:top;width:16px}.vc-sketch-presets-color,.vc-sketch-presets-color .vc-checkerboard{border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}.vc-sketch__disable-alpha .vc-sketch-color-wrap{height:10px}";
styleInject(css_248z11);
script11.render = render11;
script11.__file = "src/components/sketch/sketch.vue";
script11.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/slider/index.js
init_vue_runtime_esm_bundler();
var DEFAULT_SATURATION = 0.5;
var script12 = {
  name: "Slider",
  components: {
    Hue: script5
  },
  mixins: [colorMixin],
  props: {
    swatches: {
      type: Array,
      default() {
        return [
          { s: DEFAULT_SATURATION, l: 0.8 },
          { s: DEFAULT_SATURATION, l: 0.65 },
          { s: DEFAULT_SATURATION, l: 0.5 },
          { s: DEFAULT_SATURATION, l: 0.35 },
          { s: DEFAULT_SATURATION, l: 0.2 }
        ];
      }
    }
  },
  computed: {
    normalizedSwatches() {
      const { swatches } = this;
      return swatches.map((swatch) => {
        if (typeof swatch !== "object") {
          return {
            s: DEFAULT_SATURATION,
            l: swatch
          };
        }
        return swatch;
      });
    }
  },
  methods: {
    isActive(swatch, index) {
      const { hsl } = this.colors;
      if (hsl.l === 1 && swatch.l === 1)
        return true;
      if (hsl.l === 0 && swatch.l === 0)
        return true;
      return Math.abs(hsl.l - swatch.l) < 0.01 && Math.abs(hsl.s - swatch.s) < 0.01;
    },
    hueChange(data) {
      this.colorChange(data);
    },
    handleSwClick(index, swatch) {
      this.colorChange({
        h: this.colors.hsl.h,
        s: swatch.s,
        l: swatch.l,
        source: "hsl"
      });
    }
  }
};
var _hoisted_117 = {
  role: "application",
  "aria-label": "Slider color picker",
  class: "vc-slider"
};
var _hoisted_211 = { class: "vc-slider-hue-warp" };
var _hoisted_311 = {
  class: "vc-slider-swatches",
  role: "group"
};
var _hoisted_410 = ["data-index", "aria-label", "onClick"];
function render12(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Hue = resolveComponent("Hue");
  return openBlock(), createElementBlock("div", _hoisted_117, [
    createBaseVNode("div", _hoisted_211, [
      createVNode(_component_Hue, {
        value: _ctx.colors,
        onChange: $options.hueChange
      }, null, 8, ["value", "onChange"])
    ]),
    createBaseVNode("div", _hoisted_311, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($options.normalizedSwatches, (swatch, index) => {
          return openBlock(), createElementBlock("div", {
            key: index,
            class: "vc-slider-swatch",
            "data-index": index,
            "aria-label": `color:${_ctx.colors.hex}`,
            role: "button",
            onClick: ($event) => $options.handleSwClick(index, swatch)
          }, [
            createBaseVNode(
              "div",
              {
                class: normalizeClass(["vc-slider-swatch-picker", { "vc-slider-swatch-picker--active": $options.isActive(swatch, index), "vc-slider-swatch-picker--white": swatch.l === 1 }]),
                style: normalizeStyle({ background: `hsl(${_ctx.colors.hsl.h}, ${swatch.s * 100}%, ${swatch.l * 100}%)` })
              },
              null,
              6
              /* CLASS, STYLE */
            )
          ], 8, _hoisted_410);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
var css_248z12 = ".vc-slider{position:relative;width:410px}.vc-slider-hue-warp{height:12px;position:relative}.vc-slider-hue-warp .vc-hue-picker{background-color:#f8f8f8;border-radius:6px;box-shadow:0 1px 4px 0 rgba(0,0,0,.37);height:14px;transform:translate(-7px,-2px);width:14px}.vc-slider-swatches{display:flex;margin-top:20px}.vc-slider-swatch{flex:1;margin-right:1px;width:20%}.vc-slider-swatch:first-child{margin-right:1px}.vc-slider-swatch:first-child .vc-slider-swatch-picker{border-radius:2px 0 0 2px}.vc-slider-swatch:last-child{margin-right:0}.vc-slider-swatch:last-child .vc-slider-swatch-picker{border-radius:0 2px 2px 0}.vc-slider-swatch-picker{cursor:pointer;height:12px}.vc-slider-swatch:nth-child(n) .vc-slider-swatch-picker.vc-slider-swatch-picker--active{border-radius:3.6px/2px;transform:scaleY(1.8)}.vc-slider-swatch-picker--white{box-shadow:inset 0 0 0 1px #ddd}.vc-slider-swatch-picker--active.vc-slider-swatch-picker--white{box-shadow:inset 0 0 0 .6px #ddd}";
styleInject(css_248z12);
script12.render = render12;
script12.__file = "src/components/slider/slider.vue";
script12.install = install;

// ../../node_modules/.pnpm/material-colors@1.2.6/node_modules/material-colors/dist/colors.es2015.js
var red = { "50": "#ffebee", "100": "#ffcdd2", "200": "#ef9a9a", "300": "#e57373", "400": "#ef5350", "500": "#f44336", "600": "#e53935", "700": "#d32f2f", "800": "#c62828", "900": "#b71c1c", "a100": "#ff8a80", "a200": "#ff5252", "a400": "#ff1744", "a700": "#d50000" };
var pink = { "50": "#fce4ec", "100": "#f8bbd0", "200": "#f48fb1", "300": "#f06292", "400": "#ec407a", "500": "#e91e63", "600": "#d81b60", "700": "#c2185b", "800": "#ad1457", "900": "#880e4f", "a100": "#ff80ab", "a200": "#ff4081", "a400": "#f50057", "a700": "#c51162" };
var purple = { "50": "#f3e5f5", "100": "#e1bee7", "200": "#ce93d8", "300": "#ba68c8", "400": "#ab47bc", "500": "#9c27b0", "600": "#8e24aa", "700": "#7b1fa2", "800": "#6a1b9a", "900": "#4a148c", "a100": "#ea80fc", "a200": "#e040fb", "a400": "#d500f9", "a700": "#aa00ff" };
var deepPurple = { "50": "#ede7f6", "100": "#d1c4e9", "200": "#b39ddb", "300": "#9575cd", "400": "#7e57c2", "500": "#673ab7", "600": "#5e35b1", "700": "#512da8", "800": "#4527a0", "900": "#311b92", "a100": "#b388ff", "a200": "#7c4dff", "a400": "#651fff", "a700": "#6200ea" };
var indigo = { "50": "#e8eaf6", "100": "#c5cae9", "200": "#9fa8da", "300": "#7986cb", "400": "#5c6bc0", "500": "#3f51b5", "600": "#3949ab", "700": "#303f9f", "800": "#283593", "900": "#1a237e", "a100": "#8c9eff", "a200": "#536dfe", "a400": "#3d5afe", "a700": "#304ffe" };
var blue = { "50": "#e3f2fd", "100": "#bbdefb", "200": "#90caf9", "300": "#64b5f6", "400": "#42a5f5", "500": "#2196f3", "600": "#1e88e5", "700": "#1976d2", "800": "#1565c0", "900": "#0d47a1", "a100": "#82b1ff", "a200": "#448aff", "a400": "#2979ff", "a700": "#2962ff" };
var lightBlue = { "50": "#e1f5fe", "100": "#b3e5fc", "200": "#81d4fa", "300": "#4fc3f7", "400": "#29b6f6", "500": "#03a9f4", "600": "#039be5", "700": "#0288d1", "800": "#0277bd", "900": "#01579b", "a100": "#80d8ff", "a200": "#40c4ff", "a400": "#00b0ff", "a700": "#0091ea" };
var cyan = { "50": "#e0f7fa", "100": "#b2ebf2", "200": "#80deea", "300": "#4dd0e1", "400": "#26c6da", "500": "#00bcd4", "600": "#00acc1", "700": "#0097a7", "800": "#00838f", "900": "#006064", "a100": "#84ffff", "a200": "#18ffff", "a400": "#00e5ff", "a700": "#00b8d4" };
var teal = { "50": "#e0f2f1", "100": "#b2dfdb", "200": "#80cbc4", "300": "#4db6ac", "400": "#26a69a", "500": "#009688", "600": "#00897b", "700": "#00796b", "800": "#00695c", "900": "#004d40", "a100": "#a7ffeb", "a200": "#64ffda", "a400": "#1de9b6", "a700": "#00bfa5" };
var green = { "50": "#e8f5e9", "100": "#c8e6c9", "200": "#a5d6a7", "300": "#81c784", "400": "#66bb6a", "500": "#4caf50", "600": "#43a047", "700": "#388e3c", "800": "#2e7d32", "900": "#1b5e20", "a100": "#b9f6ca", "a200": "#69f0ae", "a400": "#00e676", "a700": "#00c853" };
var lightGreen = { "50": "#f1f8e9", "100": "#dcedc8", "200": "#c5e1a5", "300": "#aed581", "400": "#9ccc65", "500": "#8bc34a", "600": "#7cb342", "700": "#689f38", "800": "#558b2f", "900": "#33691e", "a100": "#ccff90", "a200": "#b2ff59", "a400": "#76ff03", "a700": "#64dd17" };
var lime = { "50": "#f9fbe7", "100": "#f0f4c3", "200": "#e6ee9c", "300": "#dce775", "400": "#d4e157", "500": "#cddc39", "600": "#c0ca33", "700": "#afb42b", "800": "#9e9d24", "900": "#827717", "a100": "#f4ff81", "a200": "#eeff41", "a400": "#c6ff00", "a700": "#aeea00" };
var yellow = { "50": "#fffde7", "100": "#fff9c4", "200": "#fff59d", "300": "#fff176", "400": "#ffee58", "500": "#ffeb3b", "600": "#fdd835", "700": "#fbc02d", "800": "#f9a825", "900": "#f57f17", "a100": "#ffff8d", "a200": "#ffff00", "a400": "#ffea00", "a700": "#ffd600" };
var amber = { "50": "#fff8e1", "100": "#ffecb3", "200": "#ffe082", "300": "#ffd54f", "400": "#ffca28", "500": "#ffc107", "600": "#ffb300", "700": "#ffa000", "800": "#ff8f00", "900": "#ff6f00", "a100": "#ffe57f", "a200": "#ffd740", "a400": "#ffc400", "a700": "#ffab00" };
var orange = { "50": "#fff3e0", "100": "#ffe0b2", "200": "#ffcc80", "300": "#ffb74d", "400": "#ffa726", "500": "#ff9800", "600": "#fb8c00", "700": "#f57c00", "800": "#ef6c00", "900": "#e65100", "a100": "#ffd180", "a200": "#ffab40", "a400": "#ff9100", "a700": "#ff6d00" };
var deepOrange = { "50": "#fbe9e7", "100": "#ffccbc", "200": "#ffab91", "300": "#ff8a65", "400": "#ff7043", "500": "#ff5722", "600": "#f4511e", "700": "#e64a19", "800": "#d84315", "900": "#bf360c", "a100": "#ff9e80", "a200": "#ff6e40", "a400": "#ff3d00", "a700": "#dd2c00" };
var brown = { "50": "#efebe9", "100": "#d7ccc8", "200": "#bcaaa4", "300": "#a1887f", "400": "#8d6e63", "500": "#795548", "600": "#6d4c41", "700": "#5d4037", "800": "#4e342e", "900": "#3e2723" };
var grey = { "50": "#fafafa", "100": "#f5f5f5", "200": "#eeeeee", "300": "#e0e0e0", "400": "#bdbdbd", "500": "#9e9e9e", "600": "#757575", "700": "#616161", "800": "#424242", "900": "#212121" };
var blueGrey = { "50": "#eceff1", "100": "#cfd8dc", "200": "#b0bec5", "300": "#90a4ae", "400": "#78909c", "500": "#607d8b", "600": "#546e7a", "700": "#455a64", "800": "#37474f", "900": "#263238" };
var darkText = { "primary": "rgba(0, 0, 0, 0.87)", "secondary": "rgba(0, 0, 0, 0.54)", "disabled": "rgba(0, 0, 0, 0.38)", "dividers": "rgba(0, 0, 0, 0.12)" };
var lightText = { "primary": "rgba(255, 255, 255, 1)", "secondary": "rgba(255, 255, 255, 0.7)", "disabled": "rgba(255, 255, 255, 0.5)", "dividers": "rgba(255, 255, 255, 0.12)" };
var darkIcons = { "active": "rgba(0, 0, 0, 0.54)", "inactive": "rgba(0, 0, 0, 0.38)" };
var lightIcons = { "active": "rgba(255, 255, 255, 1)", "inactive": "rgba(255, 255, 255, 0.5)" };
var white = "#ffffff";
var black = "#000000";
var colors_es2015_default = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey,
  darkText,
  lightText,
  darkIcons,
  lightIcons,
  white,
  black
};

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/swatches/index.js
init_vue_runtime_esm_bundler();
var colorMap = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "blueGrey",
  "black"
];
var colorLevel = ["900", "700", "500", "300", "100"];
var defaultColors3 = (() => {
  const colors = [];
  colorMap.forEach((type) => {
    let typeColor = [];
    if (type.toLowerCase() === "black" || type.toLowerCase() === "white") {
      typeColor = typeColor.concat(["#000000", "#FFFFFF"]);
    } else {
      colorLevel.forEach((level) => {
        const color = colors_es2015_default[type][level];
        typeColor.push(color.toUpperCase());
      });
    }
    colors.push(typeColor);
  });
  return colors;
})();
var script13 = {
  name: "Swatches",
  mixins: [colorMixin],
  props: {
    palette: {
      type: Array,
      default() {
        return defaultColors3;
      }
    }
  },
  computed: {
    pick() {
      return this.colors.hex;
    }
  },
  methods: {
    equal(color) {
      return color.toLowerCase() === this.colors.hex.toLowerCase();
    },
    handlerClick(c) {
      this.colorChange({
        hex: c,
        source: "hex"
      });
    }
  }
};
var _hoisted_118 = ["data-pick"];
var _hoisted_212 = {
  class: "vc-swatches-box",
  role: "listbox"
};
var _hoisted_312 = ["aria-label", "aria-selected", "data-color", "onKeyup", "onClick"];
var _hoisted_411 = { class: "vc-swatches-pick" };
var _hoisted_55 = {
  style: { "width": "24px", "height": "24px" },
  viewBox: "0 0 24 24"
};
var _hoisted_64 = createBaseVNode(
  "path",
  { d: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_74 = [
  _hoisted_64
];
function render13(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    role: "application",
    "aria-label": "Swatches color picker",
    class: "vc-swatches",
    "data-pick": $options.pick
  }, [
    createBaseVNode("div", _hoisted_212, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.palette, (group, $idx) => {
          return openBlock(), createElementBlock("div", {
            key: $idx,
            class: "vc-swatches-color-group"
          }, [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList(group, (c) => {
                return openBlock(), createElementBlock("div", {
                  key: c,
                  class: normalizeClass(["vc-swatches-color-it", [{ "vc-swatches-color--white": c === "#FFFFFF" }]]),
                  role: "option",
                  "aria-label": `Color:${c}`,
                  "aria-selected": $options.equal(c),
                  "data-color": c,
                  style: normalizeStyle({ background: c }),
                  tabindex: "0",
                  onKeyup: withKeys(($event) => $options.handlerClick(c), ["enter"]),
                  onClick: ($event) => $options.handlerClick(c)
                }, [
                  withDirectives(createBaseVNode(
                    "div",
                    _hoisted_411,
                    [
                      (openBlock(), createElementBlock("svg", _hoisted_55, _hoisted_74))
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $options.equal(c)]
                  ])
                ], 46, _hoisted_312);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ], 8, _hoisted_118);
}
var css_248z13 = ".vc-swatches{background-color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.12),0 2px 5px rgba(0,0,0,.16);height:240px;overflow-y:scroll;width:320px}.vc-swatches-box{overflow:hidden;padding:16px 0 6px 16px}.vc-swatches-color-group{float:left;margin-right:10px;padding-bottom:10px;width:40px}.vc-swatches-color-it{background:#880e4f;-ms-border-radius:2px 2px 0 0;-moz-border-radius:2px 2px 0 0;-o-border-radius:2px 2px 0 0;-webkit-border-radius:2px 2px 0 0;border-radius:2px 2px 0 0;box-sizing:border-box;cursor:pointer;height:24px;margin-bottom:1px;overflow:hidden;width:40px}.vc-swatches-color--white{border:1px solid #ddd}.vc-swatches-pick{fill:#fff;display:block;margin-left:8px}.vc-swatches-color--white .vc-swatches-pick{fill:#333}";
styleInject(css_248z13);
script13.render = render13;
script13.__file = "src/components/swatches/swatches.vue";
script13.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components/twitter/index.js
init_vue_runtime_esm_bundler();
var defaultColors4 = [
  "#FF6900",
  "#FCB900",
  "#7BDCB5",
  "#00D084",
  "#8ED1FC",
  "#0693E3",
  "#ABB8C3",
  "#EB144C",
  "#F78DA7",
  "#9900EF"
];
var script14 = {
  name: "Twitter",
  components: {
    EditableInput: script3
  },
  mixins: [colorMixin],
  props: {
    width: {
      type: [String, Number],
      default: 276
    },
    defaultColors: {
      type: Array,
      default() {
        return defaultColors4;
      }
    },
    triangle: {
      default: "top-left",
      validator(value) {
        return ["hide", "top-left", "top-right"].includes(value);
      }
    }
  },
  computed: {
    hsv() {
      const { hsv } = this.colors;
      return {
        h: hsv.h.toFixed(),
        s: (hsv.s * 100).toFixed(),
        v: (hsv.v * 100).toFixed()
      };
    },
    hex() {
      const { hex } = this.colors;
      return hex && hex.replace("#", "");
    }
  },
  methods: {
    equal(color) {
      return color.toLowerCase() === this.colors.hex.toLowerCase();
    },
    handlerClick(color) {
      this.colorChange({
        hex: color,
        source: "hex"
      });
    },
    inputChange(data) {
      if (!data)
        return;
      if (data["#"]) {
        this.isValidHex(data["#"]) && this.colorChange({
          hex: data["#"],
          source: "hex"
        });
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: "rgba"
        });
      } else if (data.h || data.s || data.v) {
        this.colorChange({
          h: data.h || this.colors.hsv.h,
          s: data.s / 100 || this.colors.hsv.s,
          v: data.v / 100 || this.colors.hsv.v,
          source: "hsv"
        });
      }
    }
  }
};
var _hoisted_119 = createBaseVNode(
  "div",
  { class: "vc-twitter-triangle-shadow" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_213 = createBaseVNode(
  "div",
  { class: "vc-twitter-triangle" },
  null,
  -1
  /* HOISTED */
);
var _hoisted_313 = { class: "vc-twitter-body" };
var _hoisted_412 = ["onKeyup", "onClick"];
var _hoisted_56 = createBaseVNode(
  "div",
  { class: "vc-twitter-hash" },
  " # ",
  -1
  /* HOISTED */
);
var _hoisted_65 = createBaseVNode(
  "div",
  { class: "vc-twitter-clear" },
  null,
  -1
  /* HOISTED */
);
function render14(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_EditableInput = resolveComponent("EditableInput");
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["vc-twitter", {
        "vc-twitter-hide-triangle ": $props.triangle === "hide",
        "vc-twitter-top-left-triangle ": $props.triangle === "top-left",
        "vc-twitter-top-right-triangle ": $props.triangle === "top-right"
      }]),
      style: normalizeStyle({
        width: typeof $props.width === "number" ? `${$props.width}px` : $props.width
      })
    },
    [
      _hoisted_119,
      _hoisted_213,
      createBaseVNode("div", _hoisted_313, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.defaultColors, (color, index) => {
            return openBlock(), createElementBlock("span", {
              key: index,
              class: "vc-twitter-swatch",
              style: normalizeStyle({
                background: color,
                boxShadow: `0 0 4px ${$options.equal(color) ? color : "transparent"}`
              }),
              role: "button",
              tabindex: "0",
              onKeyup: withKeys(($event) => $options.handlerClick(color), ["enter"]),
              onClick: ($event) => $options.handlerClick(color)
            }, null, 44, _hoisted_412);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        _hoisted_56,
        createVNode(_component_EditableInput, {
          label: "#",
          value: $options.hex,
          onChange: $options.inputChange
        }, null, 8, ["value", "onChange"]),
        _hoisted_65
      ])
    ],
    6
    /* CLASS, STYLE */
  );
}
var css_248z14 = ".vc-twitter{background:#fff;border:0 solid rgba(0,0,0,.25);border-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.25);position:relative}.vc-twitter-triangle{border-color:transparent transparent #fff}.vc-twitter-triangle,.vc-twitter-triangle-shadow{border-style:solid;border-width:0 9px 10px;height:0;position:absolute;width:0}.vc-twitter-triangle-shadow{border-color:transparent transparent rgba(0,0,0,.1)}.vc-twitter-body{padding:15px 9px 9px 15px}.vc-twitter .vc-editable-input{position:relative}.vc-twitter .vc-editable-input input{border:0;border-radius:0 4px 4px 0;box-shadow:inset 0 0 0 1px #f0f0f0;box-sizing:content-box;color:#666;float:left;font-size:14px;height:28px;outline:none;padding:1px 1px 1px 8px;width:100px}.vc-twitter .vc-editable-input span{display:none}.vc-twitter-hash{align-items:center;background:#f0f0f0;border-radius:4px 0 0 4px;color:#98a1a4;display:flex;float:left;height:30px;justify-content:center;width:30px}.vc-twitter-swatch{border-radius:4px;cursor:pointer;float:left;height:30px;margin:0 6px 6px 0;position:relative;width:30px}.vc-twitter-clear{clear:both}.vc-twitter-hide-triangle .vc-twitter-triangle,.vc-twitter-hide-triangle .vc-twitter-triangle-shadow{display:none}.vc-twitter-top-left-triangle .vc-twitter-triangle{left:12px;top:-10px}.vc-twitter-top-left-triangle .vc-twitter-triangle-shadow{left:12px;top:-11px}.vc-twitter-top-right-triangle .vc-twitter-triangle{right:12px;top:-10px}.vc-twitter-top-right-triangle .vc-twitter-triangle-shadow{right:12px;top:-11px}";
styleInject(css_248z14);
script14.render = render14;
script14.__file = "src/components/twitter/twitter.vue";
script14.install = install;

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/components.js
init_vue_runtime_esm_bundler();
var components = [
  script2,
  script,
  script6,
  script7,
  script3,
  script8,
  script5,
  script9,
  script10,
  script4,
  script11,
  script12,
  script13,
  script14
];

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/preset.js
init_vue_runtime_esm_bundler();
var preset = create({
  components
});

// ../../node_modules/.pnpm/@ckpack+vue-color@1.4.1_vue@3.2.47/node_modules/@ckpack/vue-color/libs/index.js
init_vue_runtime_esm_bundler();
export {
  script2 as Alpha,
  script as Checkboard,
  script6 as Chrome,
  script7 as Compact,
  script3 as EditableInput,
  script8 as Grayscale,
  script5 as Hue,
  script9 as Material,
  script10 as Photoshop,
  script4 as Saturation,
  script11 as Sketch,
  script12 as Slider,
  script13 as Swatches,
  script14 as Twitter,
  components,
  create,
  preset as default,
  preset as install
};
//# sourceMappingURL=@ckpack_vue-color.js.map
