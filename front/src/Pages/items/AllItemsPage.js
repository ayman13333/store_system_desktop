import AllItemsComponent from "../../components/items/AllItemsComponent";
import SideBar from "../../Utilities/SideBar";

export default function AllItemsPage() {
    return (
        <div className='parent'>
            <SideBar />
            <div className="p-4 w-100" style={{
                overflow: 'hidden'
            }}
            >
                <AllItemsComponent />
            </div>
        </div>
    )
}
