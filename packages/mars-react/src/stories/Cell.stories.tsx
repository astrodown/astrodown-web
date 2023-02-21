import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Cell } from "../components";

export default {
    title: "Example/Cell",
    component: Cell,
} as ComponentMeta<typeof Cell>;

const Template: ComponentStory<typeof Cell> = (args) => <Cell {...args} />;

export const Default = Template.bind({});