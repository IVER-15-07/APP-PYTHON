
import { Navbar } from "../componentes/ui";
import { Outlet } from "react-router-dom"
const VentanaPublica = () => {
    return (
        <div>
            <Navbar />

            <main className='flex-1'>
                <Outlet />
            </main>

        </div>
    )
}

export default VentanaPublica
