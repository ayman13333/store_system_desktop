import React, { useEffect } from 'react';
import Select from 'react-select';

const ReactSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Search or select...', 
  isClearable = true, 
  isSearchable = true, 
  isDisabled = false, 
  width = '100%' // Default width
}) => {
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: width, // Apply the width dynamically
    }),
  };

  return (
    <Select
      value={options.find((option) => option.value == value)} // Matches selected value
      onChange={(selectedOption) => onChange(selectedOption?.value || '')}
      options={options}
      placeholder={placeholder}
      isClearable={isClearable} // Allows clearing the selection
      isSearchable={isSearchable} // Enables the search feature
      isDisabled={isDisabled} // Disables the select if needed
      styles={customStyles} // Apply custom styles
    />
  );
};

export default ReactSelect;
