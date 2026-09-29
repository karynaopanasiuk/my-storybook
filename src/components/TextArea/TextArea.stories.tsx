import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { TextArea } from "./TextArea";

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: {
    size: "md",
    label: "Текст",
    placeholder: "Ваш текст",
    hint: "Підказка",
    maxLength: 200,
    required: true,
    error: false,
    disabled: false,
    showLabelIcon: true,
    showHintIcon: true,
    showCounter: true,
    resizable: true,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    hint: { control: "text" },
    defaultValue: { control: "text" },
    maxLength: { control: "number" },
    required: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    showLabelIcon: { control: "boolean" },
    showHintIcon: { control: "boolean" },
    showCounter: { control: "boolean" },
    resizable: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `State=Default`: empty field with a placeholder. */
export const Default: Story = {};

/** Figma `State=Focused`: primary border + focus shine. Typing updates the counter. */
export const Focused: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByRole("textbox");
    await userEvent.click(field);
    await expect(field).toHaveFocus();
    await userEvent.type(field, "Привіт");
    await expect(canvas.getByText("6")).toBeInTheDocument();
  },
};

/** Figma `State=Filled`. */
export const Filled: Story = { args: { defaultValue: "Ваш текст" } };

/** Figma `State=Error` (Red-danger mode). */
export const Error: Story = {
  args: { error: true, defaultValue: "Ваш текст", hint: "Текст задовгий" },
};

/** Figma `State=Disabled`. */
export const Disabled: Story = { args: { disabled: true, defaultValue: "Ваш текст" } };

/** Figma `Size`: md and lg. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <TextArea {...args} size="md" label="Size md" />
      <TextArea {...args} size="lg" label="Size lg" />
    </div>
  ),
};
