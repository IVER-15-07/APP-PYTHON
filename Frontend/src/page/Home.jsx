
import { Outlet } from 'react-router-dom'
import Navbar from '../componentes/Navbar'

const Home = () => {
  return (
    <div>
      <Navbar />
     
      <Outlet/>
    </div>
  )
}

export default Home
