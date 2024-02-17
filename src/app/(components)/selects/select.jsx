import React from "react";
import Select from "react-select";
import { COLOURS } from "@/app/constants";

const primaryColor = COLOURS.LIGHT_BLUE;
const secondaryColor = COLOURS.GREY;
const secondaryTextColor = "black";
const primaryTextColor = "black";
const secondaryColorHover = COLOURS.DARK_BLUE;
const width = 180;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: width,
    borderColor: state.isFocused ? primaryColor : secondaryColor,
    boxShadow: state.isFocused ? `0 0 0 1px ${primaryColor}` : null,
    "&:hover": {
      borderColor: state.isFocused ? primaryColor : secondaryColor,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontWeight: state.isSelected ? "bold" : "normal",
    backgroundColor: state.isFocused ? primaryColor : "transparent",
    color: state.isFocused ? "white" : secondaryTextColor,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontWeight: "bold",
    color: primaryTextColor,
  }),
  menu: (provided) => ({
    ...provided,
    width: 170,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  }),
  colors: {
    primary: primaryColor,
    primary25: secondaryColorHover,
  },
};

const MySelect = ({ options, value, onChange, isRequired }) => (
  <Select
    options={options}
    value={value}
    onChange={onChange}
    styles={customStyles}
    required={isRequired ? true : false}
  />
);

export default MySelect;
