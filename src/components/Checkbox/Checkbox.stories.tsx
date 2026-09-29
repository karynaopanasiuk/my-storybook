import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { Checkbox } from "./Checkbox";
import type { CheckboxSize } from "./Checkbox";

const sizes: CheckboxSize[] = ["xs", "sm", "md", "lg"];
const row = { display: "flex", gap: 16, alignItems: "center" } as const;
const column = { display: "flex", flexDirection: "column", gap: 16 } as const;

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    size: "md",
    defaultChecked: false,
    indeterminate: false,
    error: false,
    disabled: false,
    "aria-label": "Погоджуюсь з умовами",
  },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  // Remount when defaultChecked changes so the control takes effect on an uncontrolled input.
  render: (args) => <Checkbox key={String(args.defaultChecked)} {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `Type=Unchecked, State=Default`. */
export const Unchecked: Story = {};

/** Figma `Type=Checked`. Click toggles it. */
export const Checked: Story = { args: { defaultChecked: true } };

/** Figma `Type=Indeterminate`. */
export const Indeterminate: Story = { args: { indeterminate: true } };

// Resolves a token utility to its computed value, so tests compare against tokens, not hex codes.
function tokenValue(canvasElement: HTMLElement, className: string, property: "backgroundColor" | "borderTopColor") {
  const probe = document.createElement("span");
  probe.className = `border-solid ${className}`;
  canvasElement.appendChild(probe);
  const value = getComputedStyle(probe)[property];
  probe.remove();
  return value;
}

/** Figma `State=Focused`: keyboard focus (Tab). Checked: hover fill + theme border. */
export const Focused: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.tab();
    const box = canvas.getByRole("checkbox");
    await expect(box).toHaveFocus();
    // Read the token values once: adding probe elements inside waitFor would retrigger it forever.
    const fill = tokenValue(canvasElement, "bg-background-theme-filled-hover", "backgroundColor");
    const border = tokenValue(canvasElement, "border-border-theme", "borderTopColor");
    await waitFor(() => {
      expect(getComputedStyle(box).backgroundColor).toBe(fill);
      expect(getComputedStyle(box).borderTopColor).toBe(border);
    });
  },
};

/** Figma `State=Error` (Red-danger mode). */
export const Error: Story = {
  render: (args) => (
    <div style={row}>
      <Checkbox {...args} error aria-label="Unchecked" />
      <Checkbox {...args} error defaultChecked aria-label="Checked" />
      <Checkbox {...args} error indeterminate aria-label="Indeterminate" />
    </div>
  ),
};

/** Figma `State=Disabled`. */
export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      <Checkbox {...args} disabled aria-label="Unchecked" />
      <Checkbox {...args} disabled defaultChecked aria-label="Checked" />
      <Checkbox {...args} disabled indeterminate aria-label="Indeterminate" />
    </div>
  ),
};

/** Figma `Size`: xs 14px, sm 16px, md 18px, lg 20px. */
export const Sizes: Story = {
  render: (args) => (
    <div style={column}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Checkbox {...args} size={size} aria-label={`${size} unchecked`} />
          <Checkbox {...args} size={size} defaultChecked aria-label={`${size} checked`} />
          <Checkbox {...args} size={size} indeterminate aria-label={`${size} indeterminate`} />
        </div>
      ))}
    </div>
  ),
};

/** Toggle by click: unchecked -> checked. */
export const Toggle: Story = {
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox");
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
