import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { Input } from "./Input";
import { QuestionIcon, UserIcon } from "./icons";

const icons = { none: undefined, user: <UserIcon />, question: <QuestionIcon /> };

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    size: "md",
    label: "Назва проєкту",
    placeholder: "Ваш текст",
    hint: "Підказка",
    error: false,
    disabled: false,
    required: true,
    showLabelIcon: true,
    showHintIcon: true,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    hint: { control: "text" },
    defaultValue: { control: "text" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    showLabelIcon: { control: "boolean" },
    showHintIcon: { control: "boolean" },
    leftIcon: { control: "select", options: Object.keys(icons), mapping: icons },
    rightIcon: { control: "select", options: Object.keys(icons), mapping: icons },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `State=Default`: empty field with a placeholder. */
export const Default: Story = {};

/** Figma `State=Typing`: the field has focus (theme border + focus shine). */
export const Focus: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
    await expect(input).toHaveFocus();
  },
};

/** Figma `State=Filled`: the field has a value. */
export const Filled: Story = {
  args: { defaultValue: "Ваш текст" },
};

/** Figma `State=Disabled`. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Ваш текст" },
};

/** Figma `State=Error`: red border, error shine and a red hint (Red-danger mode). */
export const Error: Story = {
  args: { error: true, defaultValue: "Ваш текст", hint: "Поле заповнено неправильно" },
};

/** Figma `Show Left Icon` / `Show Right Icon`. */
export const WithIcon: Story = {
  args: { leftIcon: "user", rightIcon: "question" } as never,
};

/** Figma `Size`: Xs 24px, Sm 32px, Md 40px, Lg 48px, Xl 56px. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Input key={size} {...args} size={size} label={`Size ${size}`} leftIcon={<UserIcon />} rightIcon={<QuestionIcon />} />
      ))}
    </div>
  ),
};
