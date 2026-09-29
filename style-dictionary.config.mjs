import { fileHeader } from "style-dictionary/utils";

const figma = (token) => token.$extensions?.["com.figma"] ?? {};
const cssVar = (path) => `--${path.join("-")}`;
const modeSlug = (mode) => mode.trim().toLowerCase().replace(/\s+/g, "-");

// {color.primary.5} -> var(--color-primary-5); literals pass through.
const toCss = (value) => value.replace(/^\{(.+)\}$/, (_, p) => `var(${cssVar(p.split("."))})`);

export default {
  source: ["tokens.json"],
  usesDtcg: true,
  hooks: {
    transforms: {
      // Tailwind: keep Figma radius tokens out of Tailwind's own `rounded-*` names
      // (--radius-lg would silently change every existing `rounded-lg`).
      "name/tailwind": {
        type: "name",
        transform: (token) => {
          const path = [...token.path];
          if (path[0] === "radius") path.splice(1, 0, "ds");
          return path.join("-");
        },
      },
    },
    formats: {
      // One [data-theme="<mode>"] block per Figma mode, overriding the default (Primary) values.
      "css/figma-modes": async ({ dictionary, file }) => {
        const modes = new Map();
        for (const token of dictionary.allTokens) {
          for (const [mode, value] of Object.entries(figma(token).modes ?? {})) {
            if (!modes.has(mode)) modes.set(mode, []);
            modes.get(mode).push(`  ${cssVar(token.path)}: ${toCss(String(value))};`);
          }
        }
        const blocks = [...modes].map(([mode, lines]) => `[data-theme="${modeSlug(mode)}"] {\n${lines.join("\n")}\n}`);
        return `${await fileHeader({ file })}${blocks.join("\n\n")}\n`;
      },
    },
  },
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: { outputReferences: true },
        },
        {
          destination: "tokens.modes.css",
          format: "css/figma-modes",
          filter: (token) => Object.keys(figma(token).modes ?? {}).length > 0,
        },
      ],
    },
    tailwind: {
      transformGroup: "css",
      transforms: ["name/tailwind"],
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.theme.css",
          format: "css/variables",
          options: { selector: "@theme" },
          // Colors, semantic spacing and radius only. Primitive spacing is named by pixels
          // (spacing.8 = 8px) and would clash with Tailwind's multiplier scale (p-8 = 2rem).
          filter: (token) =>
            token.$type === "color" ||
            (figma(token).collection === "Semantic Spaces" && ["spacing", "radius"].includes(token.path[0])),
        },
      ],
    },
  },
};
