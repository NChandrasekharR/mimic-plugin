"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // code.ts
  var require_code = __commonJS({
    "code.ts"(exports) {
      figma.showUI(__html__, { width: 300, height: 400 });
      var learnedPattern = null;
      function isContainer(node) {
        return "children" in node && Array.isArray(node.children);
      }
      function isEditableLeaf(node) {
        if (node.locked) return false;
        if ("visible" in node && node.visible === false) return false;
        const hasStyle = "fills" in node || "strokes" in node || node.type === "TEXT" || "opacity" in node;
        const hasSize = "width" in node && "height" in node;
        return hasStyle && hasSize && !isContainer(node);
      }
      function findFirstEditableLeaf(node) {
        if (isEditableLeaf(node)) return node;
        if (isContainer(node)) {
          for (const child of node.children) {
            const found = findFirstEditableLeaf(child);
            if (found) return found;
          }
        }
        return null;
      }
      function collectEditableLeaves(node, out) {
        if (node.locked) return;
        if ("visible" in node && node.visible === false) return;
        if (isEditableLeaf(node)) {
          out.push(node);
          return;
        }
        if (isContainer(node)) {
          for (const child of node.children) collectEditableLeaves(child, out);
        }
      }
      function extractNodeProperties(node) {
        var _a, _b, _c, _d;
        const props = {
          width: (_a = node.width) != null ? _a : 0,
          height: (_b = node.height) != null ? _b : 0
        };
        if ("rotation" in node) {
          props.rotation = (_c = node.rotation) != null ? _c : 0;
        }
        if ("opacity" in node) {
          props.opacity = (_d = node.opacity) != null ? _d : 1;
        }
        if ("fills" in node) {
          try {
            const fills = node.fills;
            if (Array.isArray(fills) && fills.length > 0) {
              const first = fills[0];
              if (first.type === "SOLID") {
                const c = first.color;
                props.fill = { r: c.r, g: c.g, b: c.b };
              }
            }
          } catch (e) {
          }
        }
        if ("strokes" in node) {
          try {
            const strokes = node.strokes;
            const strokeWeight = node.strokeWeight;
            if (typeof strokeWeight === "number") props.strokeWidth = strokeWeight;
            if (Array.isArray(strokes) && strokes.length > 0) {
              const first = strokes[0];
              if (first.type === "SOLID") {
                const c = first.color;
                props.stroke = { r: c.r, g: c.g, b: c.b };
              }
            }
          } catch (e) {
          }
        }
        if (node.type === "TEXT") {
          const fs = node.fontSize;
          if (typeof fs === "number") props.fontSize = fs;
        }
        return props;
      }
      function learnPattern(inputNode, outputNode) {
        var _a, _b, _c, _d;
        const a = extractNodeProperties(inputNode);
        const b = extractNodeProperties(outputNode);
        const pattern = {};
        pattern.rotation = ((_a = b.rotation) != null ? _a : 0) - ((_b = a.rotation) != null ? _b : 0);
        pattern.scaleX = a.width ? b.width / a.width : 1;
        pattern.scaleY = a.height ? b.height / a.height : 1;
        pattern.opacity = ((_c = b.opacity) != null ? _c : 1) - ((_d = a.opacity) != null ? _d : 1);
        if (b.fill) pattern.fill = b.fill;
        if (typeof b.strokeWidth === "number") pattern.strokeWidth = b.strokeWidth;
        if (b.stroke) pattern.stroke = b.stroke;
        if (typeof b.fontSize === "number" && typeof a.fontSize === "number") {
          pattern.fontSize = b.fontSize - a.fontSize;
        }
        return pattern;
      }
      function applyPattern(node, pattern) {
        return __async(this, null, function* () {
          var _a, _b, _c, _d;
          if ("rotation" in node && typeof pattern.rotation === "number") {
            node.rotation = ((_a = node.rotation) != null ? _a : 0) + pattern.rotation;
          }
          if ("resize" in node && typeof pattern.scaleX === "number" && typeof pattern.scaleY === "number") {
            const w = (_b = node.width) != null ? _b : 0;
            const h = (_c = node.height) != null ? _c : 0;
            try {
              node.resize(w * pattern.scaleX, h * pattern.scaleY);
            } catch (e) {
            }
          }
          if ("opacity" in node && typeof pattern.opacity === "number") {
            const next = Math.max(0, Math.min(1, ((_d = node.opacity) != null ? _d : 1) + pattern.opacity));
            node.opacity = next;
          }
          if ("fills" in node && pattern.fill) {
            try {
              const existingFills = node.fills;
              const fills = Array.isArray(existingFills) ? existingFills.slice() : [];
              const solid = { type: "SOLID", color: pattern.fill };
              if (fills.length > 0) fills[0] = solid;
              else fills.push(solid);
              node.fills = fills;
            } catch (e) {
            }
          }
          if ("strokes" in node) {
            try {
              if (typeof pattern.strokeWidth === "number") {
                const current = node.strokeWeight;
                if (typeof current === "number") node.strokeWeight = current + pattern.strokeWidth;
                else node.strokeWeight = pattern.strokeWidth;
              }
              if (pattern.stroke) {
                const existingStrokes = node.strokes;
                const strokes = Array.isArray(existingStrokes) ? existingStrokes.slice() : [];
                const solid = { type: "SOLID", color: pattern.stroke };
                if (strokes.length > 0) strokes[0] = solid;
                else strokes.push(solid);
                node.strokes = strokes;
              }
            } catch (e) {
            }
          }
          if (node.type === "TEXT" && typeof pattern.fontSize === "number") {
            try {
              const tn = node;
              yield figma.loadFontAsync(tn.fontName);
              if (typeof tn.fontSize === "number") tn.fontSize = tn.fontSize + pattern.fontSize;
            } catch (e) {
            }
          }
        });
      }
      function selectionSummary(nodes) {
        return nodes.map((n) => ({ id: n.id, name: n.name, type: n.type, locked: n.locked, visible: "visible" in n ? n.visible : true }));
      }
      figma.ui.onmessage = (msg) => __async(null, null, function* () {
        if (msg.type === "learn-pattern") {
          try {
            const sel = figma.currentPage.selection;
            if (sel.length !== 2) {
              console.error("[Mimic] Learn error: expected 2 nodes, got", sel.length, selectionSummary(sel));
              figma.ui.postMessage({ type: "error", message: "Select exactly 2 nodes to learn." });
              return;
            }
            const a = findFirstEditableLeaf(sel[0]);
            const b = findFirstEditableLeaf(sel[1]);
            if (!a || !b) {
              console.error("[Mimic] Learn error: no editable inner element found", { sel: selectionSummary(sel) });
              figma.ui.postMessage({ type: "error", message: "Could not find inner elements. Select frames/groups with editable children." });
              return;
            }
            learnedPattern = learnPattern(a, b);
            figma.ui.postMessage({ type: "pattern-learned", data: learnedPattern });
          } catch (e) {
            console.error("[Mimic] Learn exception", e);
            figma.ui.postMessage({ type: "error", message: "Unexpected error during learning. Check console." });
          }
        }
        if (msg.type === "apply-pattern") {
          try {
            if (!learnedPattern) {
              console.error("[Mimic] Apply error: no learned pattern available");
              figma.ui.postMessage({ type: "error", message: "No pattern learned yet." });
              return;
            }
            const sel = figma.currentPage.selection;
            if (sel.length < 1) {
              console.error("[Mimic] Apply error: empty selection");
              figma.ui.postMessage({ type: "error", message: "Select at least 1 node to apply." });
              return;
            }
            const targets = [];
            for (const n of sel) collectEditableLeaves(n, targets);
            let applied = 0;
            for (const t of targets) {
              try {
                yield applyPattern(t, learnedPattern);
                applied += 1;
              } catch (e) {
                console.error("[Mimic] Apply exception on node", { id: t.id, name: t.name, type: t.type }, e);
              }
            }
            figma.ui.postMessage({ type: "applied", count: applied });
          } catch (e) {
            console.error("[Mimic] Apply exception", e);
            figma.ui.postMessage({ type: "error", message: "Unexpected error during apply. Check console." });
          }
        }
      });
    }
  });
  require_code();
})();
