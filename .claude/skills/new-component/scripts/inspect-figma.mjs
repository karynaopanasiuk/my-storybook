#!/usr/bin/env node
// Dumps a Figma component set through the figmosha bridge: properties, variants and, for every
// variant, each layer's size, fills, strokes, radius, padding, gap, effects, variable modes and
// text styles, with the Figma variable (or HARD when not bound) behind every value.
// Usage: node .claude/skills/new-component/scripts/inspect-figma.mjs <node-id> [out.json]
//   node-id: from the Figma URL, node-id=2998-6996 -> 2998:6996
import { writeFileSync } from "node:fs";

const BRIDGE = process.env.FIGMA_BRIDGE_URL ?? "http://localhost:8787";
const nodeId = (process.argv[2] ?? "").replace("-", ":");
if (!/^\d+:\d+$/.test(nodeId)) {
  console.error("Usage: inspect-figma.mjs <node-id like 2998:6996 or 2998-6996> [out.json]");
  process.exit(1);
}

const CODE = `
const root = await figma.getNodeByIdAsync(${JSON.stringify(nodeId)});
if (!root) return { error: "node not found in the open file", file: figma.root.name };
const set = root.type === "COMPONENT_SET" ? root : root.type === "COMPONENT" && root.parent.type === "COMPONENT_SET" ? root.parent : null;
const vn = async (a) => { if (!a) return "HARD"; const v = await figma.variables.getVariableByIdAsync(a.id); return v ? v.name : a.id; };
const hex = (c) => "#" + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
const bound = async (n, p) => { const x = n.boundVariables && n.boundVariables[p]; const a = Array.isArray(x) ? x[0] : x; return a ? await vn(a) : "HARD"; };
const paints = async (ps) => { if (!ps || ps === figma.mixed) return ps === figma.mixed ? "mixed" : undefined; const o = []; for (const p of ps) { if (p.visible === false) continue; o.push(p.type === "SOLID" ? hex(p.color) + (p.opacity < 1 ? "@" + p.opacity.toFixed(2) : "") + " [" + (await vn(p.boundVariables && p.boundVariables.color)) + "]" : p.type); } return o.length ? o.join(", ") : undefined; };
const modes = async (n) => { const o = []; for (const [c, m] of Object.entries(n.explicitVariableModes || {})) { const col = await figma.variables.getVariableCollectionByIdAsync(c); o.push(col.name + "=" + (col.modes.find((x) => x.modeId === m) || {}).name); } return o.length ? o.join("; ") : undefined; };
async function describe(n, depth) {
  const d = { name: n.name, type: n.type, size: Math.round(n.width * 100) / 100 + "x" + Math.round(n.height * 100) / 100 };
  if (!n.visible) d.hidden = true;
  if (n.opacity < 1) d.opacity = n.opacity;
  const fill = await paints(n.fills); if (fill) d.fill = fill;
  const stroke = await paints(n.strokes); if (stroke) { d.stroke = stroke; d.strokeWeight = String(n.strokeWeight) + " [" + (await bound(n, "strokeTopWeight")) + "] " + n.strokeAlign; }
  if ("cornerRadius" in n && n.cornerRadius) d.radius = String(n.cornerRadius) + " [" + (await bound(n, "topLeftRadius")) + "]";
  if (n.layoutMode && n.layoutMode !== "NONE") d.layout = n.layoutMode + " pad " + [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].join("/") + " [" + (await bound(n, "paddingTop")) + "|" + (await bound(n, "paddingRight")) + "] gap " + n.itemSpacing + " [" + (await bound(n, "itemSpacing")) + "] sizing " + n.primaryAxisSizingMode + "/" + n.counterAxisSizingMode + " align " + n.primaryAxisAlignItems + "/" + n.counterAxisAlignItems;
  if (n.effects && n.effects.some((e) => e.visible !== false)) d.effects = n.effectStyleId ? "style: " + ((await figma.getStyleByIdAsync(n.effectStyleId)) || {}).name : "HARD " + JSON.stringify(n.effects.map((e) => [e.type, e.offset, e.radius, e.spread, hex(e.color), e.color.a]));
  const m = await modes(n); if (m) d.modes = m;
  if (n.type === "TEXT") { d.text = n.characters; d.font = n.fontSize + "px " + n.fontName.style + " lh " + JSON.stringify(n.lineHeight) + " [" + (n.textStyleId && n.textStyleId !== figma.mixed ? ((await figma.getStyleByIdAsync(n.textStyleId)) || {}).name : "HARD") + "]"; if (n.fills === figma.mixed) { d.segments = []; for (const s of n.getStyledTextSegments(["fills"])) d.segments.push(s.characters + ": " + (await paints(s.fills))); } }
  if (n.type === "INSTANCE") { const main = await n.getMainComponentAsync(); if (main) d.main = main.name + " (" + main.id + ")"; }
  if ("children" in n && depth < 6) { d.children = []; for (const c of n.children) d.children.push(await describe(c, depth + 1)); }
  return d;
}
const out = { file: figma.root.name, node: root.name, type: root.type };
if (set) {
  out.set = set.name; out.variantCount = set.children.length;
  out.properties = Object.fromEntries(Object.entries(set.componentPropertyDefinitions).map(([k, d]) => [k, { type: d.type, default: d.defaultValue, options: d.variantOptions }]));
  out.variants = []; for (const c of set.children) out.variants.push(await describe(c, 0));
} else out.tree = await describe(root, 0);
return out;
`;

const res = await fetch(`${BRIDGE}/exec`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: CODE }),
}).catch(() => null);
if (!res) {
  console.error(`Bridge not reachable at ${BRIDGE}. Start it and run the Figmosha Bridge plugin in Figma.`);
  process.exit(1);
}
const body = await res.json();
if (!body.ok) {
  console.error(`Bridge error: ${body.error} ${body.hint ?? ""}`);
  process.exit(1);
}
const json = JSON.stringify(body.value, null, 2);
if (process.argv[3]) {
  writeFileSync(process.argv[3], json);
  const v = body.value;
  console.log(`${v.file} / ${v.set ?? v.node}: ${v.variantCount ?? 1} variant(s) -> ${process.argv[3]}`);
} else console.log(json);
