import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import type { BadgeColor, BadgeSize, BadgeVariant } from "./Badge";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const icons = { none: undefined, left: <ChevronLeftIcon />, right: <ChevronRightIcon /> };
const variants: BadgeVariant[] = ["filled", "light", "outline", "default", "grey", "dot"];
const sizes: BadgeSize[] = ["xs", "sm", "md", "lg", "xl"];
const colors: BadgeColor[] = ["primary", "grey", "danger", "warning", "info", "success", "violet", "cyan", "dark"];

const row = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" } as const;
const column = { display: "flex", flexDirection: "column", gap: 16 } as const;

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Текст",
    variant: "filled",
    size: "md",
    circle: false,
  },
  argTypes: {
    children: { control: "text" },
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    color: { control: "select", options: [undefined, ...colors] },
    circle: { control: "boolean" },
    leftIcon: { control: "select", options: Object.keys(icons), mapping: icons },
    rightIcon: { control: "select", options: Object.keys(icons), mapping: icons },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `Style=Filled`. */
export const Filled: Story = {};

/** Figma `Style=Light`. */
export const Light: Story = { args: { variant: "light" } };

/** Figma `Style=Outline`. */
export const Outline: Story = { args: { variant: "outline" } };

/** Figma `Style=Default`: neutral, ignores `color`. */
export const Default: Story = { args: { variant: "default" } };

/** Figma `Style=Grey`: the light style in the Grey mode. */
export const Grey: Story = { args: { variant: "grey" } };

/** Figma `Style=Dot`: a colored dot (Green-success mode by default). */
export const Dot: Story = { args: { variant: "dot" } };

/** Figma `Show Left Icon` / `Show Right Icon`. */
export const WithIcons: Story = {
  args: { leftIcon: "left", rightIcon: "right" } as never,
};

/** Figma `Circle=True`: a round counter. */
export const Circle: Story = {
  args: { circle: true, children: "2" },
  render: (args) => (
    <div style={row}>
      {variants.filter((v) => v !== "dot").map((variant) => (
        <Badge key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** Figma `Size`: xs 16px, sm 18px, md 20px, lg 24px, xl 28px. */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Badge {...args} size={size} leftIcon={<ChevronLeftIcon />} rightIcon={<ChevronRightIcon />} />
          <Badge {...args} size={size} variant="dot" />
          <Badge {...args} size={size} circle>
            2
          </Badge>
        </div>
      ))}
    </div>
  ),
};

/** `color`: the Figma variable modes, applied to every style. */
export const Colors: Story = {
  render: (args) => (
    <div style={column}>
      {colors.map((color) => (
        <div key={color} style={row}>
          {variants.filter((v) => v !== "default" && v !== "grey").map((variant) => (
            <Badge key={variant} {...args} variant={variant} color={color}>
              {color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Every style side by side. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={row}>
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};
