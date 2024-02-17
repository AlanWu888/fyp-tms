"use client";

import React, { useState } from "react";
import { COLOURS } from "@/app/constants";

import Button from "./buttons/Button";
import MySelect from "./selects/select";
import Checkbox from "./checkboxes/checkbox";

const MyComponents = () => {
  // #region Button constants
  const handleClickButton = () => {
    alert("button pressed");
  };
  // #endregion

  // #region Select constants 1
  const options1 = [
    { value: "week", label: "Week" },
    { value: "fortnight", label: "Fortnight" },
    { value: "month", label: "Month" },
    { value: "quarter", label: "Quarter" },
    { value: "year", label: "Year" },
    { value: "all", label: "All" },
    { value: "custom", label: "Custom Range" },
  ];
  const [selectedOption1, setSelectedOption1] = useState(options1[0]);
  const handleChange1 = (selectedOption1) => {
    setSelectedOption1(selectedOption1);
  };
  // #endregion

  // #region Select constants 2
  const options2 = [
    { value: "r", label: "Research" },
    { value: "b", label: "Billable" },
    { value: "n", label: "Non-Billable" },
  ];
  const [selectedOption2, setSelectedOption2] = useState(null);
  const handleChange2 = (selectedOption2) => {
    setSelectedOption2(selectedOption2);
  };
  // #endregion

  // #region Checkbox constants
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  // #endregion

  return (
    <div>
      <div className="m-5">
        <Button
          bgcolour={COLOURS.GREEN_ENABLED}
          colour={COLOURS.WHITE}
          label="Save"
          onClick={handleClickButton}
        />
      </div>

      <div className="m-5">
        <MySelect
          options={options1}
          value={options1[0]}
          onChange={handleChange1}
          isRequired={false}
        />
        {selectedOption1 && <p>Selected option: {selectedOption1.label}</p>}
      </div>

      <div className="m-5">
        <MySelect
          options={options2}
          value={selectedOption2}
          onChange={handleChange2}
          isRequired={true}
        />
        {selectedOption2 && <p>Selected option: {selectedOption2.label}</p>}
      </div>

      <div className="m-5">
        <Checkbox
          isChecked={isChecked}
          onChange={handleCheckboxChange}
          label=""
        />
      </div>
    </div>
  );
};

export default MyComponents;
