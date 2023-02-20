import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Cell } from "../components";

export default {
    title: "Example/Cell",
    component: Cell,
} as Meta;

const Template: Story = (args) => <Cell {...args} />;

export const Default = Template.bind({});