
export default function CustumNumberInput({ value, setValue, required,placeholder }) {

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[1-9]\d*$/;
    
        // Allow empty input or valid positive whole number
        if (inputValue === '' || regex.test(inputValue)) {
          setValue(inputValue);
        }
      };

    return (
        <input
            value={value} onChange={handleChange}
            required={required}
            type="text" className="form-control" placeholder={placeholder}
        />
    )
}
