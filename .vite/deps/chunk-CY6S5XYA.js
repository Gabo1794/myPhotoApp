import {
  init_useControlled,
  useControlled_default
} from "./chunk-ALDWAU65.js";
import {
  init_requirePropFactory,
  requirePropFactory_default
} from "./chunk-3UTDVNOH.js";
import {
  createSvgIcon,
  init_createSvgIcon
} from "./chunk-UBALTMFX.js";
import {
  init_useEventCallback,
  init_useForkRef,
  useEventCallback_default,
  useForkRef_default
} from "./chunk-2F6432DZ.js";
import {
  init_isMuiElement,
  isMuiElement_default
} from "./chunk-XCXJYM7X.js";
import {
  init_memoTheme,
  memoTheme
} from "./chunk-DQK7MEH2.js";
import {
  capitalize_default,
  init_capitalize
} from "./chunk-NPHKFYAT.js";
import {
  ClassNameGenerator_default,
  createChainedFunction,
  debounce,
  deprecatedPropType,
  init_createChainedFunction,
  init_debounce,
  init_deprecatedPropType,
  init_esm,
  init_ownerDocument,
  init_ownerWindow,
  init_setRef,
  init_unsupportedProp,
  init_useEnhancedEffect,
  init_useId,
  ownerDocument,
  ownerWindow,
  setRef,
  unsupportedProp,
  useEnhancedEffect_default,
  useId
} from "./chunk-FY3YDR7A.js";
import {
  __esm,
  __export
} from "./chunk-EWTE5DHJ.js";

// node_modules/@mui/material/utils/createChainedFunction.js
var createChainedFunction_default;
var init_createChainedFunction2 = __esm({
  "node_modules/@mui/material/utils/createChainedFunction.js"() {
    init_createChainedFunction();
    createChainedFunction_default = createChainedFunction;
  }
});

// node_modules/@mui/material/utils/debounce.js
var debounce_default;
var init_debounce2 = __esm({
  "node_modules/@mui/material/utils/debounce.js"() {
    init_debounce();
    debounce_default = debounce;
  }
});

// node_modules/@mui/material/utils/deprecatedPropType.js
var deprecatedPropType_default;
var init_deprecatedPropType2 = __esm({
  "node_modules/@mui/material/utils/deprecatedPropType.js"() {
    init_deprecatedPropType();
    deprecatedPropType_default = deprecatedPropType;
  }
});

// node_modules/@mui/material/utils/ownerDocument.js
var ownerDocument_default;
var init_ownerDocument2 = __esm({
  "node_modules/@mui/material/utils/ownerDocument.js"() {
    init_ownerDocument();
    ownerDocument_default = ownerDocument;
  }
});

// node_modules/@mui/material/utils/ownerWindow.js
var ownerWindow_default;
var init_ownerWindow2 = __esm({
  "node_modules/@mui/material/utils/ownerWindow.js"() {
    init_ownerWindow();
    ownerWindow_default = ownerWindow;
  }
});

// node_modules/@mui/material/utils/setRef.js
var setRef_default;
var init_setRef2 = __esm({
  "node_modules/@mui/material/utils/setRef.js"() {
    init_setRef();
    setRef_default = setRef;
  }
});

// node_modules/@mui/material/utils/useEnhancedEffect.js
var useEnhancedEffect_default2;
var init_useEnhancedEffect2 = __esm({
  "node_modules/@mui/material/utils/useEnhancedEffect.js"() {
    "use client";
    init_useEnhancedEffect();
    useEnhancedEffect_default2 = useEnhancedEffect_default;
  }
});

// node_modules/@mui/material/utils/useId.js
var useId_default;
var init_useId2 = __esm({
  "node_modules/@mui/material/utils/useId.js"() {
    "use client";
    init_useId();
    useId_default = useId;
  }
});

// node_modules/@mui/material/utils/unsupportedProp.js
var unsupportedProp_default;
var init_unsupportedProp2 = __esm({
  "node_modules/@mui/material/utils/unsupportedProp.js"() {
    init_unsupportedProp();
    unsupportedProp_default = unsupportedProp;
  }
});

// node_modules/@mui/material/utils/index.js
var utils_exports = {};
__export(utils_exports, {
  capitalize: () => capitalize_default,
  createChainedFunction: () => createChainedFunction_default,
  createSvgIcon: () => createSvgIcon,
  debounce: () => debounce_default,
  deprecatedPropType: () => deprecatedPropType_default,
  isMuiElement: () => isMuiElement_default,
  ownerDocument: () => ownerDocument_default,
  ownerWindow: () => ownerWindow_default,
  requirePropFactory: () => requirePropFactory_default,
  setRef: () => setRef_default,
  unstable_ClassNameGenerator: () => unstable_ClassNameGenerator,
  unstable_memoTheme: () => memoTheme,
  unstable_useEnhancedEffect: () => useEnhancedEffect_default2,
  unstable_useId: () => useId_default,
  unsupportedProp: () => unsupportedProp_default,
  useControlled: () => useControlled_default,
  useEventCallback: () => useEventCallback_default,
  useForkRef: () => useForkRef_default
});
var unstable_ClassNameGenerator;
var init_utils = __esm({
  "node_modules/@mui/material/utils/index.js"() {
    "use client";
    init_esm();
    init_capitalize();
    init_createChainedFunction2();
    init_createSvgIcon();
    init_debounce2();
    init_deprecatedPropType2();
    init_isMuiElement();
    init_memoTheme();
    init_ownerDocument2();
    init_ownerWindow2();
    init_requirePropFactory();
    init_setRef2();
    init_useEnhancedEffect2();
    init_useId2();
    init_unsupportedProp2();
    init_useControlled();
    init_useEventCallback();
    init_useForkRef();
    unstable_ClassNameGenerator = {
      configure: (generator) => {
        if (true) {
          console.warn(["MUI: `ClassNameGenerator` import from `@mui/material/utils` is outdated and might cause unexpected issues.", "", "You should use `import { unstable_ClassNameGenerator } from '@mui/material/className'` instead", "", "The detail of the issue: https://github.com/mui/material-ui/issues/30011#issuecomment-1024993401", "", "The updated documentation: https://mui.com/guides/classname-generator/"].join("\n"));
        }
        ClassNameGenerator_default.configure(generator);
      }
    };
  }
});

export {
  createChainedFunction_default,
  init_createChainedFunction2 as init_createChainedFunction,
  debounce_default,
  init_debounce2 as init_debounce,
  deprecatedPropType_default,
  ownerDocument_default,
  init_ownerDocument2 as init_ownerDocument,
  ownerWindow_default,
  init_ownerWindow2 as init_ownerWindow,
  setRef_default,
  useEnhancedEffect_default2 as useEnhancedEffect_default,
  init_useEnhancedEffect2 as init_useEnhancedEffect,
  useId_default,
  init_useId2 as init_useId,
  unsupportedProp_default,
  init_unsupportedProp2 as init_unsupportedProp,
  unstable_ClassNameGenerator,
  utils_exports,
  init_utils
};
//# sourceMappingURL=chunk-CY6S5XYA.js.map
