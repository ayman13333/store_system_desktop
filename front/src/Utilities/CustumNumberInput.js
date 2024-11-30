
export default function CustumNumberInput({ value, setValue, required,placeholder,disabled=false,type }) {

  // const floatRegex = /^-?\d+(\.\d+)?$/;

    const handleChange = (e) => {
        const inputValue = e.target.value;
        let regex;

        if(type=='float') regex=/^-?(\d+(\.\d*)?|\.\d+)$/;
        else  regex = /^[1-9]\d*$/;
        // Allow empty input or valid positive whole number
        if (inputValue === '' || regex.test(inputValue)) {
          setValue(inputValue);
        }
      };

    return (
        <input
            value={value} onChange={handleChange}
            required={required}
            disabled={disabled}
            type="text" className="form-control" placeholder={placeholder}
        />
    )
}
