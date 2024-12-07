import { useState } from "react";
import { Spinner } from "react-bootstrap";
import SearchComponent from "./SearchComponent";

export default function PrintInvoiceComponent() {
    const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='w-100 h-100'>
        <h1> صفحة الطباعة   {isLoading && <Spinner />} </h1>
        <SearchComponent />
    </div>
  )
}
