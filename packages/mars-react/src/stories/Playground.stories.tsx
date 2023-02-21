import React from "react";
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Playground } from "../components";

export default {
    title: "Example/Playground",
    component: Playground,
} as ComponentMeta<typeof Playground>;

const Template: ComponentStory<typeof Playground> = (args) => <Playground {...args} />;

export const Default = Template.bind({});
Default.args = {
    data: [{ name: "a", value: 1, type: "raw" }, { name: "df", value: "https://raw.githubusercontent.com/cs109/2014_data/master/countries.csv", type: "pandas" }]
}

