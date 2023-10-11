import React from "react";

function Dropdown({
  dropDownTitle,
  options,
  selectedOption,
  onOptionChange,
  nullable,
}) {
  const handleOptionChange = (event) => {
    const newOption = event.target.value;
    onOptionChange(newOption); // Call the parent's function to update the selected option
  };

  return (
    <div>
      <label>{dropDownTitle}</label>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        {nullable && (
          <option key={""} value={""}>
            -- Select --
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
