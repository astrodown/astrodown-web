import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Playground } from "../components";

export default {
    title: "Example/Playground",
    component: Playground,
} as Meta;

const Template: Story = (args) => <Playground {...args} />;

export const Default = Template.bind({});
Default.args = {
    exports: [{ name: "a", value: 1, type: "raw" }, { name: "df", value: "https://raw.githubusercontent.com/cs109/2014_data/master/countries.csv", type: "pandas" }]
}

