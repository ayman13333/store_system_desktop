import AddItemComponent from "../../components/items/AddItemComponent";
import SideBar from "../../Utilities/SideBar";

export default function EditItemPage() {
  return (
    <div className='parent'>
            <SideBar />
            <div className="p-4 w-100">

                <AddItemComponent />
            </div>
        </div>
  )
}
