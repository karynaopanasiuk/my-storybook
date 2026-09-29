#!/usr/bin/env node
// Exports a Figma node (usually an icon's main component) as an SVG string through the figmosha bridge.
// Usage: node .claude/skills/new-component/scripts/export-svg.mjs <node-id> [out.svg]
import { writeFileSync } from "node:fs";

const BRIDGE = process.env.FIGMA_BRIDGE_URL ?? "http://localhost:8787";
const nodeId = (process.argv[2] ?? "").replace("-", ":");
if (!/^\d+:\d+$/.test(nodeId)) {
  console.error("Usage: export-svg.mjs <node-id> [out.svg]");
  process.exit(1);
}
const code = `const n = await figma.getNodeByIdAsync(${JSON.stringify(nodeId)}); if (!n) return null; return { name: n.name, svg: await n.exportAsync({ format: "SVG_STRING" }) };`;
const res = await fetch(`${BRIDGE}/exec`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }).catch(() => null);
if (!res) { console.error(`Bridge not reachable at ${BRIDGE}.`); process.exit(1); }
const body = await res.json();
if (!body.ok || !body.value) { console.error(`Bridge error or node not found: ${body.error ?? nodeId}`); process.exit(1); }
if (process.argv[3]) { writeFileSync(process.argv[3], body.value.svg); console.log(`${body.value.name} -> ${process.argv[3]}`); }
else console.log(`<!-- ${body.value.name} -->\n${body.value.svg}`);
