import {
  set
} from "./chunk-ESO62AI5.js";
import {
  computed,
  defineComponent,
  inject,
  isRef,
  onUnmounted,
  provide,
  reactive,
  ref,
  unref,
  watchEffect
} from "./chunk-5PJZPTXT.js";
import {
  __commonJS,
  __toESM
} from "./chunk-AC2VUBZ6.js";

// ../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../../node_modules/.pnpm/fast-deep-equal@3.1.3/node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal3(a, b) {
      if (a === b)
        return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor)
          return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length)
            return false;
          for (i = length; i-- !== 0; )
            if (!equal3(a[i], b[i]))
              return false;
          return true;
        }
        if (a.constructor === RegExp)
          return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
          return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
          return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
          return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
            return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal3(a[key], b[key]))
            return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/core/DndContext.js
var DndContextSymbol = Symbol("DndContextType");
function useDndContextProvider(dndContext) {
  provide(DndContextSymbol, dndContext);
}
function useDndContextInjector() {
  return inject(DndContextSymbol);
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/interfaces.mjs
var HandlerRole;
(function(HandlerRole2) {
  HandlerRole2["SOURCE"] = "SOURCE";
  HandlerRole2["TARGET"] = "TARGET";
})(HandlerRole || (HandlerRole = {}));

// ../../node_modules/.pnpm/@react-dnd+invariant@3.0.1/node_modules/@react-dnd/invariant/dist/esm/index.mjs
function invariant(condition, format, ...args) {
  if (isProduction()) {
    if (format === void 0) {
      throw new Error("invariant requires an error message argument");
    }
  }
  if (!condition) {
    let error;
    if (format === void 0) {
      error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
    } else {
      let argIndex = 0;
      error = new Error(format.replace(/%s/g, function() {
        return args[argIndex++];
      }));
      error.name = "Invariant Violation";
    }
    error.framesToPop = 1;
    throw error;
  }
}
function isProduction() {
  return typeof process !== "undefined" && false;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/types.mjs
var INIT_COORDS = "dnd-core/INIT_COORDS";
var BEGIN_DRAG = "dnd-core/BEGIN_DRAG";
var PUBLISH_DRAG_SOURCE = "dnd-core/PUBLISH_DRAG_SOURCE";
var HOVER = "dnd-core/HOVER";
var DROP = "dnd-core/DROP";
var END_DRAG = "dnd-core/END_DRAG";

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/local/setClientOffset.mjs
function setClientOffset(clientOffset, sourceClientOffset) {
  return {
    type: INIT_COORDS,
    payload: {
      sourceClientOffset: sourceClientOffset || null,
      clientOffset: clientOffset || null
    }
  };
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/utils/js_utils.mjs
function get(obj, path, defaultValue) {
  return path.split(".").reduce(
    (a, c) => a && a[c] ? a[c] : defaultValue || null,
    obj
  );
}
function without(items, item) {
  return items.filter(
    (i) => i !== item
  );
}
function isObject(input) {
  return typeof input === "object";
}
function xor(itemsA, itemsB) {
  const map = /* @__PURE__ */ new Map();
  const insertItem = (item) => {
    map.set(item, map.has(item) ? map.get(item) + 1 : 1);
  };
  itemsA.forEach(insertItem);
  itemsB.forEach(insertItem);
  const result = [];
  map.forEach((count, key) => {
    if (count === 1) {
      result.push(key);
    }
  });
  return result;
}
function intersection(itemsA, itemsB) {
  return itemsA.filter(
    (t) => itemsB.indexOf(t) > -1
  );
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/beginDrag.mjs
var ResetCoordinatesAction = {
  type: INIT_COORDS,
  payload: {
    clientOffset: null,
    sourceClientOffset: null
  }
};
function createBeginDrag(manager) {
  return function beginDrag(sourceIds = [], options = {
    publishSource: true
  }) {
    const { publishSource = true, clientOffset, getSourceClientOffset: getSourceClientOffset2 } = options;
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    manager.dispatch(setClientOffset(clientOffset));
    verifyInvariants(sourceIds, monitor, registry);
    const sourceId = getDraggableSource(sourceIds, monitor);
    if (sourceId == null) {
      manager.dispatch(ResetCoordinatesAction);
      return;
    }
    let sourceClientOffset = null;
    if (clientOffset) {
      if (!getSourceClientOffset2) {
        throw new Error("getSourceClientOffset must be defined");
      }
      verifyGetSourceClientOffsetIsFunction(getSourceClientOffset2);
      sourceClientOffset = getSourceClientOffset2(sourceId);
    }
    manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));
    const source = registry.getSource(sourceId);
    const item = source.beginDrag(monitor, sourceId);
    if (item == null) {
      return void 0;
    }
    verifyItemIsObject(item);
    registry.pinSource(sourceId);
    const itemType = registry.getSourceType(sourceId);
    return {
      type: BEGIN_DRAG,
      payload: {
        itemType,
        item,
        sourceId,
        clientOffset: clientOffset || null,
        sourceClientOffset: sourceClientOffset || null,
        isSourcePublic: !!publishSource
      }
    };
  };
}
function verifyInvariants(sourceIds, monitor, registry) {
  invariant(!monitor.isDragging(), "Cannot call beginDrag while dragging.");
  sourceIds.forEach(function(sourceId) {
    invariant(registry.getSource(sourceId), "Expected sourceIds to be registered.");
  });
}
function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset2) {
  invariant(typeof getSourceClientOffset2 === "function", "When clientOffset is provided, getSourceClientOffset must be a function.");
}
function verifyItemIsObject(item) {
  invariant(isObject(item), "Item must be an object.");
}
function getDraggableSource(sourceIds, monitor) {
  let sourceId = null;
  for (let i = sourceIds.length - 1; i >= 0; i--) {
    if (monitor.canDragSource(sourceIds[i])) {
      sourceId = sourceIds[i];
      break;
    }
  }
  return sourceId;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/publishDragSource.mjs
function createPublishDragSource(manager) {
  return function publishDragSource() {
    const monitor = manager.getMonitor();
    if (monitor.isDragging()) {
      return {
        type: PUBLISH_DRAG_SOURCE
      };
    }
    return;
  };
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/utils/matchesType.mjs
function matchesType(targetType, draggedItemType) {
  if (draggedItemType === null) {
    return targetType === null;
  }
  return Array.isArray(targetType) ? targetType.some(
    (t) => t === draggedItemType
  ) : targetType === draggedItemType;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/hover.mjs
function createHover(manager) {
  return function hover(targetIdsArg, { clientOffset } = {}) {
    verifyTargetIdsIsArray(targetIdsArg);
    const targetIds = targetIdsArg.slice(0);
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    checkInvariants(targetIds, monitor, registry);
    const draggedItemType = monitor.getItemType();
    removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
    hoverAllTargets(targetIds, monitor, registry);
    return {
      type: HOVER,
      payload: {
        targetIds,
        clientOffset: clientOffset || null
      }
    };
  };
}
function verifyTargetIdsIsArray(targetIdsArg) {
  invariant(Array.isArray(targetIdsArg), "Expected targetIds to be an array.");
}
function checkInvariants(targetIds, monitor, registry) {
  invariant(monitor.isDragging(), "Cannot call hover while not dragging.");
  invariant(!monitor.didDrop(), "Cannot call hover after drop.");
  for (let i = 0; i < targetIds.length; i++) {
    const targetId = targetIds[i];
    invariant(targetIds.lastIndexOf(targetId) === i, "Expected targetIds to be unique in the passed array.");
    const target = registry.getTarget(targetId);
    invariant(target, "Expected targetIds to be registered.");
  }
}
function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
  for (let i = targetIds.length - 1; i >= 0; i--) {
    const targetId = targetIds[i];
    const targetType = registry.getTargetType(targetId);
    if (!matchesType(targetType, draggedItemType)) {
      targetIds.splice(i, 1);
    }
  }
}
function hoverAllTargets(targetIds, monitor, registry) {
  targetIds.forEach(function(targetId) {
    const target = registry.getTarget(targetId);
    target.hover(monitor, targetId);
  });
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/drop.mjs
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}
function createDrop(manager) {
  return function drop(options = {}) {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyInvariants2(monitor);
    const targetIds = getDroppableTargets(monitor);
    targetIds.forEach((targetId, index) => {
      const dropResult = determineDropResult(targetId, index, registry, monitor);
      const action = {
        type: DROP,
        payload: {
          dropResult: _objectSpread({}, options, dropResult)
        }
      };
      manager.dispatch(action);
    });
  };
}
function verifyInvariants2(monitor) {
  invariant(monitor.isDragging(), "Cannot call drop while not dragging.");
  invariant(!monitor.didDrop(), "Cannot call drop twice during one drag operation.");
}
function determineDropResult(targetId, index, registry, monitor) {
  const target = registry.getTarget(targetId);
  let dropResult = target ? target.drop(monitor, targetId) : void 0;
  verifyDropResultType(dropResult);
  if (typeof dropResult === "undefined") {
    dropResult = index === 0 ? {} : monitor.getDropResult();
  }
  return dropResult;
}
function verifyDropResultType(dropResult) {
  invariant(typeof dropResult === "undefined" || isObject(dropResult), "Drop result must either be an object or undefined.");
}
function getDroppableTargets(monitor) {
  const targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
  targetIds.reverse();
  return targetIds;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/endDrag.mjs
function createEndDrag(manager) {
  return function endDrag() {
    const monitor = manager.getMonitor();
    const registry = manager.getRegistry();
    verifyIsDragging(monitor);
    const sourceId = monitor.getSourceId();
    if (sourceId != null) {
      const source = registry.getSource(sourceId, true);
      source.endDrag(monitor, sourceId);
      registry.unpinSource();
    }
    return {
      type: END_DRAG
    };
  };
}
function verifyIsDragging(monitor) {
  invariant(monitor.isDragging(), "Cannot call endDrag while not dragging.");
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/dragDrop/index.mjs
function createDragDropActions(manager) {
  return {
    beginDrag: createBeginDrag(manager),
    publishDragSource: createPublishDragSource(manager),
    hover: createHover(manager),
    drop: createDrop(manager),
    endDrag: createEndDrag(manager)
  };
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/classes/DragDropManagerImpl.mjs
var DragDropManagerImpl = class {
  receiveBackend(backend) {
    this.backend = backend;
  }
  getMonitor() {
    return this.monitor;
  }
  getBackend() {
    return this.backend;
  }
  getRegistry() {
    return this.monitor.registry;
  }
  getActions() {
    const manager = this;
    const { dispatch } = this.store;
    function bindActionCreator(actionCreator) {
      return (...args) => {
        const action = actionCreator.apply(manager, args);
        if (typeof action !== "undefined") {
          dispatch(action);
        }
      };
    }
    const actions = createDragDropActions(this);
    return Object.keys(actions).reduce((boundActions, key) => {
      const action = actions[key];
      boundActions[key] = bindActionCreator(action);
      return boundActions;
    }, {});
  }
  dispatch(action) {
    this.store.dispatch(action);
  }
  constructor(store, monitor) {
    this.isSetUp = false;
    this.handleRefCountChange = () => {
      const shouldSetUp = this.store.getState().refCount > 0;
      if (this.backend) {
        if (shouldSetUp && !this.isSetUp) {
          this.backend.setup();
          this.isSetUp = true;
        } else if (!shouldSetUp && this.isSetUp) {
          this.backend.teardown();
          this.isSetUp = false;
        }
      }
    };
    this.store = store;
    this.monitor = monitor;
    store.subscribe(this.handleRefCountChange);
  }
};

// ../../node_modules/.pnpm/redux@4.2.1/node_modules/redux/es/redux.js
var $$observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
var randomString = function randomString2() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function miniKindOf(val) {
  if (val === void 0)
    return "undefined";
  if (val === null)
    return "null";
  var type = typeof val;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "symbol":
    case "function": {
      return type;
    }
  }
  if (Array.isArray(val))
    return "array";
  if (isDate(val))
    return "date";
  if (isError(val))
    return "error";
  var constructorName = ctorName(val);
  switch (constructorName) {
    case "Symbol":
    case "Promise":
    case "WeakMap":
    case "WeakSet":
    case "Map":
    case "Set":
      return constructorName;
  }
  return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
}
function ctorName(val) {
  return typeof val.constructor === "function" ? val.constructor.name : null;
}
function isError(val) {
  return val instanceof Error || typeof val.message === "string" && val.constructor && typeof val.constructor.stackTraceLimit === "number";
}
function isDate(val) {
  if (val instanceof Date)
    return true;
  return typeof val.toDateString === "function" && typeof val.getDate === "function" && typeof val.setDate === "function";
}
function kindOf(val) {
  var typeOfVal = typeof val;
  if (true) {
    typeOfVal = miniKindOf(val);
  }
  return typeOfVal;
}
function createStore(reducer, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(false ? formatProdErrorMessage(0) : "It looks like you are passing several store enhancers to createStore(). This is not supported. Instead, compose them together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.");
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(false ? formatProdErrorMessage(1) : "Expected the enhancer to be a function. Instead, received: '" + kindOf(enhancer) + "'");
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  if (typeof reducer !== "function") {
    throw new Error(false ? formatProdErrorMessage(2) : "Expected the root reducer to be a function. Instead, received: '" + kindOf(reducer) + "'");
  }
  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(3) : "You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.");
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(false ? formatProdErrorMessage(4) : "Expected the listener to be a function. Instead, received: '" + kindOf(listener) + "'");
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(5) : "You may not call store.subscribe() while the reducer is executing. If you would like to be notified after the store has been updated, subscribe from a component and invoke store.getState() in the callback to access the latest state. See https://redux.js.org/api/store#subscribelistener for more details.");
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(false ? formatProdErrorMessage(6) : "You may not unsubscribe from a store listener while the reducer is executing. See https://redux.js.org/api/store#subscribelistener for more details.");
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(false ? formatProdErrorMessage(7) : "Actions must be plain objects. Instead, the actual type was: '" + kindOf(action) + "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples.");
    }
    if (typeof action.type === "undefined") {
      throw new Error(false ? formatProdErrorMessage(8) : 'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.');
    }
    if (isDispatching) {
      throw new Error(false ? formatProdErrorMessage(9) : "Reducers may not dispatch actions.");
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(false ? formatProdErrorMessage(10) : "Expected the nextReducer to be a function. Instead, received: '" + kindOf(nextReducer));
    }
    currentReducer = nextReducer;
    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe2(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(false ? formatProdErrorMessage(11) : "Expected the observer to be an object. Instead, received: '" + kindOf(observer) + "'");
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      }
    }, _ref[$$observable] = function() {
      return this;
    }, _ref;
  }
  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/utils/equality.mjs
var strictEquality = (a, b) => a === b;
function areCoordsEqual(offsetA, offsetB) {
  if (!offsetA && !offsetB) {
    return true;
  } else if (!offsetA || !offsetB) {
    return false;
  } else {
    return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
  }
}
function areArraysEqual(a, b, isEqual = strictEquality) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (!isEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/reducers/dragOffset.mjs
function _defineProperty3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread3(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty3(target, key, source[key]);
    });
  }
  return target;
}
var initialState = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};
function reduce(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case INIT_COORDS:
    case BEGIN_DRAG:
      return {
        initialSourceClientOffset: payload.sourceClientOffset,
        initialClientOffset: payload.clientOffset,
        clientOffset: payload.clientOffset
      };
    case HOVER:
      if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
        return state;
      }
      return _objectSpread3({}, state, {
        clientOffset: payload.clientOffset
      });
    case END_DRAG:
    case DROP:
      return initialState;
    default:
      return state;
  }
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/actions/registry.mjs
var ADD_SOURCE = "dnd-core/ADD_SOURCE";
var ADD_TARGET = "dnd-core/ADD_TARGET";
var REMOVE_SOURCE = "dnd-core/REMOVE_SOURCE";
var REMOVE_TARGET = "dnd-core/REMOVE_TARGET";
function addSource(sourceId) {
  return {
    type: ADD_SOURCE,
    payload: {
      sourceId
    }
  };
}
function addTarget(targetId) {
  return {
    type: ADD_TARGET,
    payload: {
      targetId
    }
  };
}
function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId
    }
  };
}
function removeTarget(targetId) {
  return {
    type: REMOVE_TARGET,
    payload: {
      targetId
    }
  };
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/reducers/dragOperation.mjs
function _defineProperty4(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread4(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty4(target, key, source[key]);
    });
  }
  return target;
}
var initialState2 = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: false,
  isSourcePublic: null
};
function reduce2(state = initialState2, action) {
  const { payload } = action;
  switch (action.type) {
    case BEGIN_DRAG:
      return _objectSpread4({}, state, {
        itemType: payload.itemType,
        item: payload.item,
        sourceId: payload.sourceId,
        isSourcePublic: payload.isSourcePublic,
        dropResult: null,
        didDrop: false
      });
    case PUBLISH_DRAG_SOURCE:
      return _objectSpread4({}, state, {
        isSourcePublic: true
      });
    case HOVER:
      return _objectSpread4({}, state, {
        targetIds: payload.targetIds
      });
    case REMOVE_TARGET:
      if (state.targetIds.indexOf(payload.targetId) === -1) {
        return state;
      }
      return _objectSpread4({}, state, {
        targetIds: without(state.targetIds, payload.targetId)
      });
    case DROP:
      return _objectSpread4({}, state, {
        dropResult: payload.dropResult,
        didDrop: true,
        targetIds: []
      });
    case END_DRAG:
      return _objectSpread4({}, state, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: false,
        isSourcePublic: null,
        targetIds: []
      });
    default:
      return state;
  }
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/reducers/refCount.mjs
function reduce3(state = 0, action) {
  switch (action.type) {
    case ADD_SOURCE:
    case ADD_TARGET:
      return state + 1;
    case REMOVE_SOURCE:
    case REMOVE_TARGET:
      return state - 1;
    default:
      return state;
  }
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/utils/dirtiness.mjs
var NONE = [];
var ALL = [];
NONE.__IS_NONE__ = true;
ALL.__IS_ALL__ = true;
function areDirty(dirtyIds, handlerIds) {
  if (dirtyIds === NONE) {
    return false;
  }
  if (dirtyIds === ALL || typeof handlerIds === "undefined") {
    return true;
  }
  const commonIds = intersection(handlerIds, dirtyIds);
  return commonIds.length > 0;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/reducers/dirtyHandlerIds.mjs
function reduce4(_state = NONE, action) {
  switch (action.type) {
    case HOVER:
      break;
    case ADD_SOURCE:
    case ADD_TARGET:
    case REMOVE_TARGET:
    case REMOVE_SOURCE:
      return NONE;
    case BEGIN_DRAG:
    case PUBLISH_DRAG_SOURCE:
    case END_DRAG:
    case DROP:
    default:
      return ALL;
  }
  const { targetIds = [], prevTargetIds = [] } = action.payload;
  const result = xor(targetIds, prevTargetIds);
  const didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds);
  if (!didChange) {
    return NONE;
  }
  const prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
  const innermostTargetId = targetIds[targetIds.length - 1];
  if (prevInnermostTargetId !== innermostTargetId) {
    if (prevInnermostTargetId) {
      result.push(prevInnermostTargetId);
    }
    if (innermostTargetId) {
      result.push(innermostTargetId);
    }
  }
  return result;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/reducers/stateId.mjs
function reduce5(state = 0) {
  return state + 1;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/reducers/index.mjs
function _defineProperty5(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectSpread5(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function(key) {
      _defineProperty5(target, key, source[key]);
    });
  }
  return target;
}
function reduce6(state = {}, action) {
  return {
    dirtyHandlerIds: reduce4(state.dirtyHandlerIds, {
      type: action.type,
      payload: _objectSpread5({}, action.payload, {
        prevTargetIds: get(state, "dragOperation.targetIds", [])
      })
    }),
    dragOffset: reduce(state.dragOffset, action),
    refCount: reduce3(state.refCount, action),
    dragOperation: reduce2(state.dragOperation, action),
    stateId: reduce5(state.stateId)
  };
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/utils/coords.mjs
function add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}
function subtract(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
function getSourceClientOffset(state) {
  const { clientOffset, initialClientOffset, initialSourceClientOffset } = state;
  if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
    return null;
  }
  return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
}
function getDifferenceFromInitialOffset(state) {
  const { clientOffset, initialClientOffset } = state;
  if (!clientOffset || !initialClientOffset) {
    return null;
  }
  return subtract(clientOffset, initialClientOffset);
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/classes/DragDropMonitorImpl.mjs
var DragDropMonitorImpl = class {
  subscribeToStateChange(listener, options = {}) {
    const { handlerIds } = options;
    invariant(typeof listener === "function", "listener must be a function.");
    invariant(typeof handlerIds === "undefined" || Array.isArray(handlerIds), "handlerIds, when specified, must be an array of strings.");
    let prevStateId = this.store.getState().stateId;
    const handleChange = () => {
      const state = this.store.getState();
      const currentStateId = state.stateId;
      try {
        const canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);
        if (!canSkipListener) {
          listener();
        }
      } finally {
        prevStateId = currentStateId;
      }
    };
    return this.store.subscribe(handleChange);
  }
  subscribeToOffsetChange(listener) {
    invariant(typeof listener === "function", "listener must be a function.");
    let previousState = this.store.getState().dragOffset;
    const handleChange = () => {
      const nextState = this.store.getState().dragOffset;
      if (nextState === previousState) {
        return;
      }
      previousState = nextState;
      listener();
    };
    return this.store.subscribe(handleChange);
  }
  canDragSource(sourceId) {
    if (!sourceId) {
      return false;
    }
    const source = this.registry.getSource(sourceId);
    invariant(source, `Expected to find a valid source. sourceId=${sourceId}`);
    if (this.isDragging()) {
      return false;
    }
    return source.canDrag(this, sourceId);
  }
  canDropOnTarget(targetId) {
    if (!targetId) {
      return false;
    }
    const target = this.registry.getTarget(targetId);
    invariant(target, `Expected to find a valid target. targetId=${targetId}`);
    if (!this.isDragging() || this.didDrop()) {
      return false;
    }
    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
  }
  isDragging() {
    return Boolean(this.getItemType());
  }
  isDraggingSource(sourceId) {
    if (!sourceId) {
      return false;
    }
    const source = this.registry.getSource(sourceId, true);
    invariant(source, `Expected to find a valid source. sourceId=${sourceId}`);
    if (!this.isDragging() || !this.isSourcePublic()) {
      return false;
    }
    const sourceType = this.registry.getSourceType(sourceId);
    const draggedItemType = this.getItemType();
    if (sourceType !== draggedItemType) {
      return false;
    }
    return source.isDragging(this, sourceId);
  }
  isOverTarget(targetId, options = {
    shallow: false
  }) {
    if (!targetId) {
      return false;
    }
    const { shallow } = options;
    if (!this.isDragging()) {
      return false;
    }
    const targetType = this.registry.getTargetType(targetId);
    const draggedItemType = this.getItemType();
    if (draggedItemType && !matchesType(targetType, draggedItemType)) {
      return false;
    }
    const targetIds = this.getTargetIds();
    if (!targetIds.length) {
      return false;
    }
    const index = targetIds.indexOf(targetId);
    if (shallow) {
      return index === targetIds.length - 1;
    } else {
      return index > -1;
    }
  }
  getItemType() {
    return this.store.getState().dragOperation.itemType;
  }
  getItem() {
    return this.store.getState().dragOperation.item;
  }
  getSourceId() {
    return this.store.getState().dragOperation.sourceId;
  }
  getTargetIds() {
    return this.store.getState().dragOperation.targetIds;
  }
  getDropResult() {
    return this.store.getState().dragOperation.dropResult;
  }
  didDrop() {
    return this.store.getState().dragOperation.didDrop;
  }
  isSourcePublic() {
    return Boolean(this.store.getState().dragOperation.isSourcePublic);
  }
  getInitialClientOffset() {
    return this.store.getState().dragOffset.initialClientOffset;
  }
  getInitialSourceClientOffset() {
    return this.store.getState().dragOffset.initialSourceClientOffset;
  }
  getClientOffset() {
    return this.store.getState().dragOffset.clientOffset;
  }
  getSourceClientOffset() {
    return getSourceClientOffset(this.store.getState().dragOffset);
  }
  getDifferenceFromInitialOffset() {
    return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
  }
  constructor(store, registry) {
    this.store = store;
    this.registry = registry;
  }
};

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/utils/getNextUniqueId.mjs
var nextUniqueId = 0;
function getNextUniqueId() {
  return nextUniqueId++;
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/contracts.mjs
function validateSourceContract(source) {
  invariant(typeof source.canDrag === "function", "Expected canDrag to be a function.");
  invariant(typeof source.beginDrag === "function", "Expected beginDrag to be a function.");
  invariant(typeof source.endDrag === "function", "Expected endDrag to be a function.");
}
function validateTargetContract(target) {
  invariant(typeof target.canDrop === "function", "Expected canDrop to be a function.");
  invariant(typeof target.hover === "function", "Expected hover to be a function.");
  invariant(typeof target.drop === "function", "Expected beginDrag to be a function.");
}
function validateType(type, allowArray) {
  if (allowArray && Array.isArray(type)) {
    type.forEach(
      (t) => validateType(t, false)
    );
    return;
  }
  invariant(typeof type === "string" || typeof type === "symbol", allowArray ? "Type can only be a string, a symbol, or an array of either." : "Type can only be a string or a symbol.");
}

// ../../node_modules/.pnpm/@react-dnd+asap@4.0.1/node_modules/@react-dnd/asap/dist/esm/makeRequestCall.mjs
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
function makeRequestCallFromTimer(callback) {
  return function requestCall() {
    const timeoutHandle = setTimeout(handleTimer, 0);
    const intervalHandle = setInterval(handleTimer, 50);
    function handleTimer() {
      clearTimeout(timeoutHandle);
      clearInterval(intervalHandle);
      callback();
    }
  };
}
function makeRequestCallFromMutationObserver(callback) {
  let toggle = 1;
  const observer = new BrowserMutationObserver(callback);
  const node = document.createTextNode("");
  observer.observe(node, {
    characterData: true
  });
  return function requestCall() {
    toggle = -toggle;
    node.data = toggle;
  };
}
var makeRequestCall = typeof BrowserMutationObserver === "function" ? (
  // reliably everywhere they are implemented.
  // They are implemented in all modern browsers.
  //
  // - Android 4-4.3
  // - Chrome 26-34
  // - Firefox 14-29
  // - Internet Explorer 11
  // - iPad Safari 6-7.1
  // - iPhone Safari 7-7.1
  // - Safari 6-7
  makeRequestCallFromMutationObserver
) : (
  // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
  // 11-12, and in web workers in many engines.
  // Although message channels yield to any queued rendering and IO tasks, they
  // would be better than imposing the 4ms delay of timers.
  // However, they do not work reliably in Internet Explorer or Safari.
  // Internet Explorer 10 is the only browser that has setImmediate but does
  // not have MutationObservers.
  // Although setImmediate yields to the browser's renderer, it would be
  // preferrable to falling back to setTimeout since it does not have
  // the minimum 4ms penalty.
  // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
  // Desktop to a lesser extent) that renders both setImmediate and
  // MessageChannel useless for the purposes of ASAP.
  // https://github.com/kriskowal/q/issues/396
  // Timers are implemented universally.
  // We fall back to timers in workers in most engines, and in foreground
  // contexts in the following browsers.
  // However, note that even this simple case requires nuances to operate in a
  // broad spectrum of browsers.
  //
  // - Firefox 3-13
  // - Internet Explorer 6-9
  // - iPad Safari 4.3
  // - Lynx 2.8.7
  makeRequestCallFromTimer
);

// ../../node_modules/.pnpm/@react-dnd+asap@4.0.1/node_modules/@react-dnd/asap/dist/esm/AsapQueue.mjs
var AsapQueue = class {
  // Use the fastest means possible to execute a task in its own turn, with
  // priority over other events including IO, animation, reflow, and redraw
  // events in browsers.
  //
  // An exception thrown by a task will permanently interrupt the processing of
  // subsequent tasks. The higher level `asap` function ensures that if an
  // exception is thrown by a task, that the task queue will continue flushing as
  // soon as possible, but if you use `rawAsap` directly, you are responsible to
  // either ensure that no exceptions are thrown from your task, or to manually
  // call `rawAsap.requestFlush` if an exception is thrown.
  enqueueTask(task) {
    const { queue: q, requestFlush } = this;
    if (!q.length) {
      requestFlush();
      this.flushing = true;
    }
    q[q.length] = task;
  }
  constructor() {
    this.queue = [];
    this.pendingErrors = [];
    this.flushing = false;
    this.index = 0;
    this.capacity = 1024;
    this.flush = () => {
      const { queue: q } = this;
      while (this.index < q.length) {
        const currentIndex = this.index;
        this.index++;
        q[currentIndex].call();
        if (this.index > this.capacity) {
          for (let scan = 0, newLength = q.length - this.index; scan < newLength; scan++) {
            q[scan] = q[scan + this.index];
          }
          q.length -= this.index;
          this.index = 0;
        }
      }
      q.length = 0;
      this.index = 0;
      this.flushing = false;
    };
    this.registerPendingError = (err) => {
      this.pendingErrors.push(err);
      this.requestErrorThrow();
    };
    this.requestFlush = makeRequestCall(this.flush);
    this.requestErrorThrow = makeRequestCallFromTimer(() => {
      if (this.pendingErrors.length) {
        throw this.pendingErrors.shift();
      }
    });
  }
};

// ../../node_modules/.pnpm/@react-dnd+asap@4.0.1/node_modules/@react-dnd/asap/dist/esm/RawTask.mjs
var RawTask = class {
  call() {
    try {
      this.task && this.task();
    } catch (error) {
      this.onError(error);
    } finally {
      this.task = null;
      this.release(this);
    }
  }
  constructor(onError, release) {
    this.onError = onError;
    this.release = release;
    this.task = null;
  }
};

// ../../node_modules/.pnpm/@react-dnd+asap@4.0.1/node_modules/@react-dnd/asap/dist/esm/TaskFactory.mjs
var TaskFactory = class {
  create(task) {
    const tasks = this.freeTasks;
    const t1 = tasks.length ? tasks.pop() : new RawTask(
      this.onError,
      (t) => tasks[tasks.length] = t
    );
    t1.task = task;
    return t1;
  }
  constructor(onError) {
    this.onError = onError;
    this.freeTasks = [];
  }
};

// ../../node_modules/.pnpm/@react-dnd+asap@4.0.1/node_modules/@react-dnd/asap/dist/esm/asap.mjs
var asapQueue = new AsapQueue();
var taskFactory = new TaskFactory(asapQueue.registerPendingError);
function asap(task) {
  asapQueue.enqueueTask(taskFactory.create(task));
}

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/classes/HandlerRegistryImpl.mjs
function getNextHandlerId(role) {
  const id = getNextUniqueId().toString();
  switch (role) {
    case HandlerRole.SOURCE:
      return `S${id}`;
    case HandlerRole.TARGET:
      return `T${id}`;
    default:
      throw new Error(`Unknown Handler Role: ${role}`);
  }
}
function parseRoleFromHandlerId(handlerId) {
  switch (handlerId[0]) {
    case "S":
      return HandlerRole.SOURCE;
    case "T":
      return HandlerRole.TARGET;
    default:
      throw new Error(`Cannot parse handler ID: ${handlerId}`);
  }
}
function mapContainsValue(map, searchValue) {
  const entries = map.entries();
  let isDone = false;
  do {
    const { done, value: [, value] } = entries.next();
    if (value === searchValue) {
      return true;
    }
    isDone = !!done;
  } while (!isDone);
  return false;
}
var HandlerRegistryImpl = class {
  addSource(type, source) {
    validateType(type);
    validateSourceContract(source);
    const sourceId = this.addHandler(HandlerRole.SOURCE, type, source);
    this.store.dispatch(addSource(sourceId));
    return sourceId;
  }
  addTarget(type, target) {
    validateType(type, true);
    validateTargetContract(target);
    const targetId = this.addHandler(HandlerRole.TARGET, type, target);
    this.store.dispatch(addTarget(targetId));
    return targetId;
  }
  containsHandler(handler) {
    return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
  }
  getSource(sourceId, includePinned = false) {
    invariant(this.isSourceId(sourceId), "Expected a valid source ID.");
    const isPinned = includePinned && sourceId === this.pinnedSourceId;
    const source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
    return source;
  }
  getTarget(targetId) {
    invariant(this.isTargetId(targetId), "Expected a valid target ID.");
    return this.dropTargets.get(targetId);
  }
  getSourceType(sourceId) {
    invariant(this.isSourceId(sourceId), "Expected a valid source ID.");
    return this.types.get(sourceId);
  }
  getTargetType(targetId) {
    invariant(this.isTargetId(targetId), "Expected a valid target ID.");
    return this.types.get(targetId);
  }
  isSourceId(handlerId) {
    const role = parseRoleFromHandlerId(handlerId);
    return role === HandlerRole.SOURCE;
  }
  isTargetId(handlerId) {
    const role = parseRoleFromHandlerId(handlerId);
    return role === HandlerRole.TARGET;
  }
  removeSource(sourceId) {
    invariant(this.getSource(sourceId), "Expected an existing source.");
    this.store.dispatch(removeSource(sourceId));
    asap(() => {
      this.dragSources.delete(sourceId);
      this.types.delete(sourceId);
    });
  }
  removeTarget(targetId) {
    invariant(this.getTarget(targetId), "Expected an existing target.");
    this.store.dispatch(removeTarget(targetId));
    this.dropTargets.delete(targetId);
    this.types.delete(targetId);
  }
  pinSource(sourceId) {
    const source = this.getSource(sourceId);
    invariant(source, "Expected an existing source.");
    this.pinnedSourceId = sourceId;
    this.pinnedSource = source;
  }
  unpinSource() {
    invariant(this.pinnedSource, "No source is pinned at the time.");
    this.pinnedSourceId = null;
    this.pinnedSource = null;
  }
  addHandler(role, type, handler) {
    const id = getNextHandlerId(role);
    this.types.set(id, type);
    if (role === HandlerRole.SOURCE) {
      this.dragSources.set(id, handler);
    } else if (role === HandlerRole.TARGET) {
      this.dropTargets.set(id, handler);
    }
    return id;
  }
  constructor(store) {
    this.types = /* @__PURE__ */ new Map();
    this.dragSources = /* @__PURE__ */ new Map();
    this.dropTargets = /* @__PURE__ */ new Map();
    this.pinnedSourceId = null;
    this.pinnedSource = null;
    this.store = store;
  }
};

// ../../node_modules/.pnpm/dnd-core@15.1.2/node_modules/dnd-core/dist/esm/createDragDropManager.mjs
function createDragDropManager(backendFactory, globalContext = void 0, backendOptions = {}, debugMode = false) {
  const store = makeStoreInstance(debugMode);
  const monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
  const manager = new DragDropManagerImpl(store, monitor);
  const backend = backendFactory(manager, globalContext, backendOptions);
  manager.receiveBackend(backend);
  return manager;
}
function makeStoreInstance(debugMode) {
  const reduxDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__;
  return createStore(reduce6, debugMode && reduxDevTools && reduxDevTools({
    name: "dnd-core",
    instanceId: "dnd-core"
  }));
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/core/DndProvider.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
var refCount = 0;
var INSTANCE_SYM = Symbol.for("__VUE_DND_CONTEXT_INSTANCE__");
function isManagerProps(props) {
  return "manager" in props && props.manager;
}
function getDndContextValue(props) {
  if (isManagerProps(props)) {
    var manager = props.manager;
    return [
      manager,
      false
    ];
  }
  var manager1 = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
  var isGlobalInstance = !props.context;
  return [
    manager1,
    isGlobalInstance
  ];
}
function createSingletonDndContext(backend) {
  var context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getGlobalContext(), options = arguments.length > 2 ? arguments[2] : void 0, debugMode = arguments.length > 3 ? arguments[3] : void 0;
  var ctx = context;
  if (!ctx[INSTANCE_SYM]) {
    ctx[INSTANCE_SYM] = createDragDropManager(backend, context, options, debugMode);
  }
  return ctx[INSTANCE_SYM];
}
function getGlobalContext() {
  return typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : window;
}
var DndProvider_default = defineComponent({
  name: "DndProvider",
  props: {
    manager: {
      type: Object
    },
    backend: {
      type: Function
    },
    context: {
      type: Object
    },
    options: {
      type: Object
    },
    debugMode: {
      type: Boolean
    }
  },
  setup: function setup(props, param) {
    var slots = param.slots;
    var ref2 = _slicedToArray(getDndContextValue(props), 2), manager = ref2[0], isGlobalInstance = ref2[1];
    if (isGlobalInstance) {
      ++refCount;
    }
    onUnmounted(function() {
      if (isGlobalInstance) {
        var context = getGlobalContext();
        if (--refCount === 0) {
          context[INSTANCE_SYM] = null;
        }
      }
    });
    useDndContextProvider(manager);
    var ref1;
    return function() {
      var ref3;
      return (ref1 = (ref3 = slots.default) === null || ref3 === void 0 ? void 0 : ref3.call(slots)) !== null && ref1 !== void 0 ? ref1 : null;
    };
  }
});

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/core/DragPreviewImage.js
var DragPreviewImage_default = defineComponent({
  props: {
    connect: {
      type: Function,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  setup: function setup2(props) {
    watchEffect(function() {
      if (typeof Image === "undefined")
        return;
      var connected = false;
      var img = new Image();
      img.src = props.src;
      img.onload = function() {
        props.connect(img);
        connected = true;
      };
      return function() {
        if (connected) {
          props.connect(null);
        }
      };
    });
    return function() {
      return null;
    };
  }
});

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/DragSourceMonitorImpl.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var isCallingCanDrag = false;
var isCallingIsDragging = false;
var DragSourceMonitorImpl = function() {
  "use strict";
  function DragSourceMonitorImpl2(manager) {
    _classCallCheck(this, DragSourceMonitorImpl2);
    this.sourceId = null;
    this.internalMonitor = manager.getMonitor();
  }
  var _proto = DragSourceMonitorImpl2.prototype;
  _proto.receiveHandlerId = function receiveHandlerId(sourceId) {
    this.sourceId = sourceId;
  };
  _proto.getHandlerId = function getHandlerId() {
    return this.sourceId;
  };
  _proto.canDrag = function canDrag() {
    invariant(!isCallingCanDrag, "You may not call monitor.canDrag() inside your canDrag() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");
    try {
      isCallingCanDrag = true;
      return this.internalMonitor.canDragSource(this.sourceId);
    } finally {
      isCallingCanDrag = false;
    }
  };
  _proto.isDragging = function isDragging() {
    if (!this.sourceId) {
      return false;
    }
    invariant(!isCallingIsDragging, "You may not call monitor.isDragging() inside your isDragging() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor");
    try {
      isCallingIsDragging = true;
      return this.internalMonitor.isDraggingSource(this.sourceId);
    } finally {
      isCallingIsDragging = false;
    }
  };
  _proto.subscribeToStateChange = function subscribeToStateChange(listener, options) {
    return this.internalMonitor.subscribeToStateChange(listener, options);
  };
  _proto.isDraggingSource = function isDraggingSource(sourceId) {
    return this.internalMonitor.isDraggingSource(sourceId);
  };
  _proto.isOverTarget = function isOverTarget(targetId, options) {
    return this.internalMonitor.isOverTarget(targetId, options);
  };
  _proto.getTargetIds = function getTargetIds() {
    return this.internalMonitor.getTargetIds();
  };
  _proto.isSourcePublic = function isSourcePublic() {
    return this.internalMonitor.isSourcePublic();
  };
  _proto.getSourceId = function getSourceId() {
    return this.internalMonitor.getSourceId();
  };
  _proto.subscribeToOffsetChange = function subscribeToOffsetChange(listener) {
    return this.internalMonitor.subscribeToOffsetChange(listener);
  };
  _proto.canDragSource = function canDragSource(sourceId) {
    return this.internalMonitor.canDragSource(sourceId);
  };
  _proto.canDropOnTarget = function canDropOnTarget(targetId) {
    return this.internalMonitor.canDropOnTarget(targetId);
  };
  _proto.getItemType = function getItemType() {
    return this.internalMonitor.getItemType();
  };
  _proto.getItem = function getItem() {
    return this.internalMonitor.getItem();
  };
  _proto.getDropResult = function getDropResult() {
    return this.internalMonitor.getDropResult();
  };
  _proto.didDrop = function didDrop() {
    return this.internalMonitor.didDrop();
  };
  _proto.getInitialClientOffset = function getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  };
  _proto.getInitialSourceClientOffset = function getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  };
  _proto.getSourceClientOffset = function getSourceClientOffset2() {
    return this.internalMonitor.getSourceClientOffset();
  };
  _proto.getClientOffset = function getClientOffset() {
    return this.internalMonitor.getClientOffset();
  };
  _proto.getDifferenceFromInitialOffset = function getDifferenceFromInitialOffset2() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  };
  return DragSourceMonitorImpl2;
}();

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/DropTargetMonitorImpl.js
function _classCallCheck2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var isCallingCanDrop = false;
var DropTargetMonitorImpl = function() {
  "use strict";
  function DropTargetMonitorImpl2(manager) {
    _classCallCheck2(this, DropTargetMonitorImpl2);
    this.targetId = null;
    this.internalMonitor = manager.getMonitor();
  }
  var _proto = DropTargetMonitorImpl2.prototype;
  _proto.receiveHandlerId = function receiveHandlerId(targetId) {
    this.targetId = targetId;
  };
  _proto.getHandlerId = function getHandlerId() {
    return this.targetId;
  };
  _proto.subscribeToStateChange = function subscribeToStateChange(listener, options) {
    return this.internalMonitor.subscribeToStateChange(listener, options);
  };
  _proto.canDrop = function canDrop() {
    if (!this.targetId) {
      return false;
    }
    invariant(!isCallingCanDrop, "You may not call monitor.canDrop() inside your canDrop() implementation. Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor");
    try {
      isCallingCanDrop = true;
      return this.internalMonitor.canDropOnTarget(this.targetId);
    } finally {
      isCallingCanDrop = false;
    }
  };
  _proto.isOver = function isOver(options) {
    if (!this.targetId) {
      return false;
    }
    return this.internalMonitor.isOverTarget(this.targetId, options);
  };
  _proto.getItemType = function getItemType() {
    return this.internalMonitor.getItemType();
  };
  _proto.getItem = function getItem() {
    return this.internalMonitor.getItem();
  };
  _proto.getDropResult = function getDropResult() {
    return this.internalMonitor.getDropResult();
  };
  _proto.didDrop = function didDrop() {
    return this.internalMonitor.didDrop();
  };
  _proto.getInitialClientOffset = function getInitialClientOffset() {
    return this.internalMonitor.getInitialClientOffset();
  };
  _proto.getInitialSourceClientOffset = function getInitialSourceClientOffset() {
    return this.internalMonitor.getInitialSourceClientOffset();
  };
  _proto.getSourceClientOffset = function getSourceClientOffset2() {
    return this.internalMonitor.getSourceClientOffset();
  };
  _proto.getClientOffset = function getClientOffset() {
    return this.internalMonitor.getClientOffset();
  };
  _proto.getDifferenceFromInitialOffset = function getDifferenceFromInitialOffset2() {
    return this.internalMonitor.getDifferenceFromInitialOffset();
  };
  return DropTargetMonitorImpl2;
}();

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/utils.js
var _typeof2 = function(obj) {
  "@swc/helpers - typeof";
  return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isVueSkipInstance(element) {
  return element ? element.__v_skip : false;
}
function isValidElement(element) {
  return isVNode(element) && _typeof2(element.type) !== "symbol";
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/wrapConnectorHooks.js
function throwIfCompositeComponentElement() {
  throw new Error("Only native element nodes can now be passed to Vue DnD connectors.You can either wrap Component into a <div>, or turn it into a drag source or a drop target itself.");
}
function wrapHookToRecognizeElement(hook) {
  return function() {
    var elementOrNode = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (isVueSkipInstance(elementOrNode)) {
      throwIfCompositeComponentElement();
    }
    if (!isValidElement(elementOrNode)) {
      var node = elementOrNode;
      hook(node, options);
      return node;
    }
  };
}
function wrapConnectorHooks(hooks) {
  var wrappedHooks = {};
  Object.keys(hooks).forEach(function(key) {
    var hook = hooks[key];
    if (key.endsWith("Ref")) {
      wrappedHooks[key] = hooks[key];
    } else {
      var wrappedHook = wrapHookToRecognizeElement(hook);
      wrappedHooks[key] = function() {
        return wrappedHook;
      };
    }
  });
  return wrappedHooks;
}

// ../../node_modules/.pnpm/@react-dnd+shallowequal@3.0.1/node_modules/@react-dnd/shallowequal/dist/esm/index.mjs
function shallowEqual(objA, objB, compare, compareContext) {
  let compareResult = compare ? compare.call(compareContext, objA, objB) : void 0;
  if (compareResult !== void 0) {
    return !!compareResult;
  }
  if (objA === objB) {
    return true;
  }
  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];
    if (!bHasOwnProperty(key)) {
      return false;
    }
    const valueA = objA[key];
    const valueB = objB[key];
    compareResult = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
    if (compareResult === false || compareResult === void 0 && valueA !== valueB) {
      return false;
    }
  }
  return true;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/SourceConnector.js
function _classCallCheck3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
var SourceConnector = function() {
  "use strict";
  function SourceConnector2(backend) {
    var _this = this;
    _classCallCheck3(this, SourceConnector2);
    this.hooks = wrapConnectorHooks({
      dragSource: function(node, options) {
        _this.clearDragSource();
        _this.dragSourceOptions = options || null;
        _this.dragSourceNode = node;
        _this.reconnectDragSource();
      },
      dragPreview: function(node, options) {
        _this.clearDragPreview();
        _this.dragPreviewOptions = options || null;
        _this.dragPreviewNode = node;
        _this.reconnectDragPreview();
      }
    });
    this.handlerId = null;
    this.dragSourceOptionsInternal = null;
    this.dragPreviewOptionsInternal = null;
    this.lastConnectedHandlerId = null;
    this.lastConnectedDragSource = null;
    this.lastConnectedDragSourceOptions = null;
    this.lastConnectedDragPreview = null;
    this.lastConnectedDragPreviewOptions = null;
    this.backend = backend;
  }
  var _proto = SourceConnector2.prototype;
  _proto.receiveHandlerId = function receiveHandlerId(newHandlerId) {
    if (this.handlerId === newHandlerId) {
      return;
    }
    this.handlerId = newHandlerId;
    this.reconnect();
  };
  _proto.reconnect = function reconnect() {
    var didChange = this.reconnectDragSource();
    this.reconnectDragPreview(didChange);
  };
  _proto.reconnectDragSource = function reconnectDragSource() {
    var dragSource = this.dragSource;
    var didChange = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();
    if (didChange) {
      this.disconnectDragSource();
    }
    if (!this.handlerId) {
      return didChange;
    }
    if (!dragSource) {
      this.lastConnectedDragSource = dragSource;
      return didChange;
    }
    if (didChange) {
      this.lastConnectedHandlerId = this.handlerId;
      this.lastConnectedDragSource = dragSource;
      this.lastConnectedDragSourceOptions = this.dragSourceOptions;
      this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, dragSource, this.dragSourceOptions);
    }
    return didChange;
  };
  _proto.reconnectDragPreview = function reconnectDragPreview() {
    var forceDidChange = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var dragPreview = this.dragPreview;
    var didChange = forceDidChange || this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();
    if (didChange) {
      this.disconnectDragPreview();
    }
    if (!this.handlerId) {
      return;
    }
    if (!dragPreview) {
      this.lastConnectedDragPreview = dragPreview;
      return;
    }
    if (didChange) {
      this.lastConnectedHandlerId = this.handlerId;
      this.lastConnectedDragPreview = dragPreview;
      this.lastConnectedDragPreviewOptions = this.dragPreviewOptions;
      this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, dragPreview, this.dragPreviewOptions);
    }
  };
  _proto.didHandlerIdChange = function didHandlerIdChange() {
    return this.lastConnectedHandlerId !== this.handlerId;
  };
  _proto.didConnectedDragSourceChange = function didConnectedDragSourceChange() {
    return this.lastConnectedDragSource !== this.dragSource;
  };
  _proto.didConnectedDragPreviewChange = function didConnectedDragPreviewChange() {
    return this.lastConnectedDragPreview !== this.dragPreview;
  };
  _proto.didDragSourceOptionsChange = function didDragSourceOptionsChange() {
    return !shallowEqual(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
  };
  _proto.didDragPreviewOptionsChange = function didDragPreviewOptionsChange() {
    return !shallowEqual(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
  };
  _proto.disconnectDragSource = function disconnectDragSource() {
    if (this.dragSourceUnsubscribe) {
      this.dragSourceUnsubscribe();
      this.dragSourceUnsubscribe = void 0;
    }
  };
  _proto.disconnectDragPreview = function disconnectDragPreview() {
    if (this.dragPreviewUnsubscribe) {
      this.dragPreviewUnsubscribe();
      this.dragPreviewUnsubscribe = void 0;
      this.dragPreviewNode = null;
    }
  };
  _proto.clearDragSource = function clearDragSource() {
    this.dragSourceNode = null;
  };
  _proto.clearDragPreview = function clearDragPreview() {
    this.dragPreviewNode = null;
  };
  _createClass(SourceConnector2, [
    {
      key: "connectTarget",
      get: function get2() {
        return this.dragSource;
      }
    },
    {
      key: "dragSourceOptions",
      get: function get2() {
        return this.dragSourceOptionsInternal;
      },
      set: function set2(options) {
        this.dragSourceOptionsInternal = options;
      }
    },
    {
      key: "dragPreviewOptions",
      get: function get2() {
        return this.dragPreviewOptionsInternal;
      },
      set: function set2(options) {
        this.dragPreviewOptionsInternal = options;
      }
    },
    {
      key: "dragSource",
      get: function get2() {
        return this.dragSourceNode;
      }
    },
    {
      key: "dragPreview",
      get: function get2() {
        return this.dragPreviewNode;
      }
    }
  ]);
  return SourceConnector2;
}();

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/TargetConnector.js
function _classCallCheck4(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass2(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties2(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties2(Constructor, staticProps);
  return Constructor;
}
var TargetConnector = function() {
  "use strict";
  function TargetConnector2(backend) {
    var _this = this;
    _classCallCheck4(this, TargetConnector2);
    this.hooks = wrapConnectorHooks({
      dropTarget: function(node, options) {
        _this.clearDropTarget();
        _this.dropTargetOptions = options;
        if (isRef(node)) {
          _this.dropTargetRef = node;
        } else {
          _this.dropTargetNode = node;
        }
        _this.reconnect();
      }
    });
    this.handlerId = null;
    this.dropTargetRef = null;
    this.dropTargetOptionsInternal = null;
    this.lastConnectedHandlerId = null;
    this.lastConnectedDropTarget = null;
    this.lastConnectedDropTargetOptions = null;
    this.backend = backend;
  }
  var _proto = TargetConnector2.prototype;
  _proto.reconnect = function reconnect() {
    var didChange = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();
    if (didChange) {
      this.disconnectDropTarget();
    }
    var dropTarget = this.dropTarget;
    if (!this.handlerId) {
      return;
    }
    if (!dropTarget) {
      this.lastConnectedDropTarget = dropTarget;
      return;
    }
    if (didChange) {
      this.lastConnectedHandlerId = this.handlerId;
      this.lastConnectedDropTarget = dropTarget;
      this.lastConnectedDropTargetOptions = this.dropTargetOptions;
      this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, dropTarget, this.dropTargetOptions);
    }
  };
  _proto.receiveHandlerId = function receiveHandlerId(newHandlerId) {
    if (newHandlerId === this.handlerId) {
      return;
    }
    this.handlerId = newHandlerId;
    this.reconnect();
  };
  _proto.didHandlerIdChange = function didHandlerIdChange() {
    return this.lastConnectedHandlerId !== this.handlerId;
  };
  _proto.didDropTargetChange = function didDropTargetChange() {
    return this.lastConnectedDropTarget !== this.dropTarget;
  };
  _proto.didOptionsChange = function didOptionsChange() {
    return !shallowEqual(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
  };
  _proto.disconnectDropTarget = function disconnectDropTarget() {
    if (this.unsubscribeDropTarget) {
      this.unsubscribeDropTarget();
      this.unsubscribeDropTarget = void 0;
    }
  };
  _proto.clearDropTarget = function clearDropTarget() {
    this.dropTargetRef = null;
    this.dropTargetNode = null;
  };
  _createClass2(TargetConnector2, [
    {
      key: "connectTarget",
      get: function get2() {
        return this.dropTarget;
      }
    },
    {
      key: "dropTargetOptions",
      get: function get2() {
        return this.dropTargetOptionsInternal;
      },
      set: function set2(options) {
        this.dropTargetOptionsInternal = options;
      }
    },
    {
      key: "dropTarget",
      get: function get2() {
        return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.value;
      }
    }
  ]);
  return TargetConnector2;
}();

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/internals/registration.js
function registerTarget(type, target, manager) {
  var registry = unref(manager).getRegistry();
  var targetId = registry.addTarget(unref(type), unref(target));
  return [
    targetId,
    function() {
      return registry.removeTarget(targetId);
    }
  ];
}
function registerSource(type, source, manager) {
  var registry = manager.getRegistry();
  var sourceId = registry.addSource(type, source);
  return [
    sourceId,
    function() {
      return registry.removeSource(sourceId);
    }
  ];
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/DragSourceImpl.js
function _classCallCheck5(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var DragSourceImpl = function() {
  "use strict";
  function DragSourceImpl2(spec, monitor, connector) {
    _classCallCheck5(this, DragSourceImpl2);
    this.spec = spec;
    this.monitor = monitor;
    this.connector = connector;
  }
  var _proto = DragSourceImpl2.prototype;
  _proto.beginDrag = function beginDrag() {
    var spec = this.spec;
    var monitor = this.monitor;
    var result = null;
    if (typeof spec.item === "object") {
      result = spec.item;
    } else if (typeof spec.item === "function") {
      result = spec.item(monitor);
    } else {
      result = {};
    }
    return result !== null && result !== void 0 ? result : null;
  };
  _proto.canDrag = function canDrag() {
    var spec = this.spec;
    var monitor = this.monitor;
    if (typeof spec.canDrag === "boolean") {
      return spec.canDrag;
    } else if (typeof spec.canDrag === "function") {
      return spec.canDrag(monitor);
    } else {
      return true;
    }
  };
  _proto.isDragging = function isDragging(globalMonitor, target) {
    var spec = this.spec;
    var monitor = this.monitor;
    var isDragging1 = spec.isDragging;
    return isDragging1 ? isDragging1(monitor) : target === globalMonitor.getSourceId();
  };
  _proto.endDrag = function endDrag() {
    var spec = this.spec;
    var monitor = this.monitor;
    var connector = this.connector;
    var end = spec.end;
    if (end) {
      end(monitor.getItem(), monitor);
    }
    connector.reconnect();
  };
  return DragSourceImpl2;
}();

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/useDragSource.js
function useDragSource(spec, monitor, connector) {
  var handler = computed(function() {
    return new DragSourceImpl(unref(spec), unref(monitor), unref(connector));
  });
  watchEffect(function() {
    handler.value.spec = unref(spec);
  });
  return handler;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDragDropManager.js
function useDragDropManager() {
  var dragDropManager = useDndContextInjector();
  invariant(dragDropManager != null, "Expected drag drop context");
  return dragDropManager;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/useDragType.js
function useDragType(spec) {
  return computed(function() {
    var result = unref(spec).type;
    invariant(result != null, "spec.type must be defined");
    return result;
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/useRegisteredDragSource.js
function _arrayLikeToArray2(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _arrayWithHoles2(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArrayLimit2(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _nonIterableRest2() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray2(arr, i) {
  return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest2();
}
function _unsupportedIterableToArray2(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray2(o, minLen);
}
function useRegisteredDragSource(spec, monitor, connector) {
  var manager = useDragDropManager();
  var handler = useDragSource(spec, monitor, connector);
  var itemType = useDragType(spec);
  watchEffect(function registerDragSource(onCleanup) {
    if (unref(itemType) != null) {
      var ref2 = _slicedToArray2(registerSource(unref(itemType), unref(handler), unref(manager)), 2), handlerId = ref2[0], unregister = ref2[1];
      unref(monitor).receiveHandlerId(handlerId);
      unref(connector).receiveHandlerId(handlerId);
      onCleanup(unregister);
    }
    return;
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useOptionalFactory.js
function useOptionalFactory(arg) {
  return computed(function() {
    return typeof arg === "function" ? arg() : arg;
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/useDragSourceMonitor.js
function useDragSourceMonitor() {
  var manager = useDragDropManager();
  return computed(function() {
    return new DragSourceMonitorImpl(unref(manager));
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/useDragSourceConnector.js
function useDragSourceConnector(dragSourceOptions, dragPreviewOptions) {
  var manager = useDragDropManager();
  var connector = computed(function() {
    return new SourceConnector(unref(manager).getBackend());
  });
  watchEffect(function(onCleanup) {
    connector.value.dragSourceOptions = unref(dragSourceOptions) || null;
    unref(connector).reconnect();
    onCleanup(function() {
      connector.value.disconnectDragSource();
    });
  });
  watchEffect(function(onCleanup) {
    connector.value.dragPreviewOptions = unref(dragPreviewOptions) || null;
    unref(connector).reconnect();
    onCleanup(function() {
      connector.value.disconnectDragPreview();
    });
  });
  return connector;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useCollector.js
var import_fast_deep_equal = __toESM(require_fast_deep_equal());
function useCollector(monitor, collect, onUpdate) {
  var collected = ref(unref(collect)(unref(monitor)));
  var updateCollected = function() {
    var nextValue = unref(collect)(unref(monitor));
    if (!(0, import_fast_deep_equal.default)(collected, nextValue)) {
      collected.value = nextValue;
      if (onUpdate) {
        onUpdate();
      }
    }
  };
  watchEffect(updateCollected);
  return [
    collected,
    updateCollected
  ];
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useMonitorOutput.js
function _arrayLikeToArray3(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _arrayWithHoles3(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArrayLimit3(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _nonIterableRest3() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray3(arr, i) {
  return _arrayWithHoles3(arr) || _iterableToArrayLimit3(arr, i) || _unsupportedIterableToArray3(arr, i) || _nonIterableRest3();
}
function _unsupportedIterableToArray3(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray3(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray3(o, minLen);
}
function useMonitorOutput(monitor, collect, onCollect) {
  var ref2 = _slicedToArray3(useCollector(monitor, collect, onCollect), 2), collected = ref2[0], updateCollected = ref2[1];
  watchEffect(function subscribeToMonitorStateChange(onCleanup) {
    var handlerId = unref(monitor).getHandlerId();
    if (handlerId == null) {
      return;
    }
    onCleanup(unref(monitor).subscribeToStateChange(updateCollected, {
      handlerIds: [
        handlerId
      ]
    }));
  });
  return collected;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useCollectedProps.js
function useCollectedProps(collector, monitor, connector) {
  var defaultCollector = function() {
    return {};
  };
  return useMonitorOutput(monitor, collector || defaultCollector, function() {
    return unref(connector).reconnect();
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useConnector.js
var import_fast_deep_equal2 = __toESM(require_fast_deep_equal());
function useConnector(callback, defaultOptions) {
  var _state = reactive({
    el: null,
    options: unref(defaultOptions)
  });
  watchEffect(function() {
    callback(_state);
  }, {
    flush: "post"
  });
  var connector = function(element, options) {
    set(_state, "el", element);
    var _options = unref(defaultOptions) || options;
    if (!(0, import_fast_deep_equal2.default)(_state.options, _options)) {
      set(_state, "options", _options);
    }
    return unref(element);
  };
  return connector;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/connectors.js
function useConnectDragSource(connector, spec) {
  return useConnector(function(state) {
    unref(connector).hooks.dragSource()(state.el, state.options);
  }, computed(function() {
    return unref(spec).options;
  }));
}
function useConnectDragPreview(connector, spec) {
  return useConnector(function(state) {
    unref(connector).hooks.dragPreview()(state.el, state.options);
  }, computed(function() {
    return unref(spec).previewOptions;
  }));
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrag/useDrag.js
function useDrag(specArg) {
  var spec = useOptionalFactory(specArg);
  var monitor = useDragSourceMonitor();
  var connector = useDragSourceConnector(computed(function() {
    return unref(spec).options;
  }), computed(function() {
    return unref(spec).previewOptions;
  }));
  useRegisteredDragSource(spec, monitor, connector);
  return [
    useCollectedProps(computed(function() {
      return unref(spec).collect || function() {
        return {};
      };
    }), monitor, connector),
    useConnectDragSource(connector, spec),
    useConnectDragPreview(connector, spec)
  ];
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/useAccept.js
function useAccept(spec) {
  return computed(function() {
    var accept = unref(spec).accept;
    invariant(accept != null, "accept must be defined");
    return Array.isArray(accept) ? accept : [
      accept
    ];
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/DropTargetImpl.js
function _classCallCheck6(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var DropTargetImpl = function() {
  "use strict";
  function DropTargetImpl2(spec, monitor) {
    _classCallCheck6(this, DropTargetImpl2);
    this.spec = spec;
    this.monitor = monitor;
  }
  var _proto = DropTargetImpl2.prototype;
  _proto.canDrop = function canDrop() {
    var spec = this.spec;
    var monitor = this.monitor;
    return spec.canDrop ? spec.canDrop(monitor.getItem(), monitor) : true;
  };
  _proto.hover = function hover() {
    var spec = this.spec;
    var monitor = this.monitor;
    if (spec.hover) {
      spec.hover(monitor.getItem(), monitor);
    }
  };
  _proto.drop = function drop() {
    var spec = this.spec;
    var monitor = this.monitor;
    if (spec.drop) {
      return spec.drop(monitor.getItem(), monitor);
    }
    return;
  };
  return DropTargetImpl2;
}();

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/useDropTarget.js
function useDropTarget(spec, monitor) {
  var dropTarget = computed(function() {
    return new DropTargetImpl(unref(spec), unref(monitor));
  });
  watchEffect(function() {
    dropTarget.value.spec = unref(spec);
  });
  return dropTarget;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/useRegisteredDropTarget.js
function _arrayLikeToArray4(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _arrayWithHoles4(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArrayLimit4(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _nonIterableRest4() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray4(arr, i) {
  return _arrayWithHoles4(arr) || _iterableToArrayLimit4(arr, i) || _unsupportedIterableToArray4(arr, i) || _nonIterableRest4();
}
function _unsupportedIterableToArray4(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray4(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray4(o, minLen);
}
function useRegisteredDropTarget(spec, monitor, connector) {
  var manager = useDragDropManager();
  var dropTarget = useDropTarget(spec, monitor);
  var accept = useAccept(spec);
  watchEffect(function registerDropTarget(onCleanup) {
    var ref2 = _slicedToArray4(registerTarget(accept, dropTarget, manager), 2), handlerId = ref2[0], unregister = ref2[1];
    unref(monitor).receiveHandlerId(handlerId);
    unref(connector).receiveHandlerId(handlerId);
    onCleanup(unregister);
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/useDropTargetMonitor.js
function useDropTargetMonitor() {
  var manager = useDragDropManager();
  return computed(function() {
    return new DropTargetMonitorImpl(unref(manager));
  });
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/useDropTargetConnector.js
function useDropTargetConnector(options) {
  var manager = useDragDropManager();
  var connector = computed(function() {
    return new TargetConnector(unref(manager).getBackend());
  });
  watchEffect(function(onCleanup) {
    connector.value.dropTargetOptions = unref(options) || null;
    connector.value.reconnect();
    onCleanup(function() {
      return connector.value.disconnectDropTarget();
    });
  });
  return connector;
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/connectors.js
function useConnectDropTarget(connector, spec) {
  return useConnector(function(state) {
    unref(connector).hooks.dropTarget()(state.el, state.options);
  }, computed(function() {
    return unref(spec).options;
  }));
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDrop/useDrop.js
function useDrop(specArg) {
  var spec = useOptionalFactory(specArg);
  var monitor = useDropTargetMonitor();
  var connector = useDropTargetConnector(computed(function() {
    return unref(spec).options;
  }));
  useRegisteredDropTarget(spec, monitor, connector);
  return [
    useCollectedProps(computed(function() {
      return unref(spec).collect || function() {
        return {};
      };
    }), monitor, connector),
    useConnectDropTarget(connector, spec)
  ];
}

// ../../node_modules/.pnpm/vue3-dnd@2.0.2_vue@3.2.47/node_modules/vue3-dnd/dist/esm/hooks/useDragLayer.js
function _arrayLikeToArray5(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _arrayWithHoles5(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArrayLimit5(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _nonIterableRest5() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray5(arr, i) {
  return _arrayWithHoles5(arr) || _iterableToArrayLimit5(arr, i) || _unsupportedIterableToArray5(arr, i) || _nonIterableRest5();
}
function _unsupportedIterableToArray5(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray5(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray5(o, minLen);
}
function useDragLayer(collect) {
  var dragDropManager = useDragDropManager();
  var monitor = computed(function() {
    return unref(dragDropManager).getMonitor();
  });
  var ref2 = _slicedToArray5(useCollector(monitor, collect), 2), collected = ref2[0], updateCollected = ref2[1];
  watchEffect(function(onCleanup) {
    onCleanup(monitor.value.subscribeToOffsetChange(updateCollected));
  });
  watchEffect(function(onCleanup) {
    onCleanup(monitor.value.subscribeToStateChange(updateCollected));
  });
  return collected;
}
export {
  DndContextSymbol,
  DragPreviewImage_default as DndPreviewImage,
  DndProvider_default as DndProvider,
  DragPreviewImage_default as DragPreviewImage,
  useDndContextInjector,
  useDndContextProvider,
  useDrag,
  useDragDropManager,
  useDragLayer,
  useDrop
};
//# sourceMappingURL=vue3-dnd.js.map
