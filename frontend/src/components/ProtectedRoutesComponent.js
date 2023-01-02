import {Outlet, Navigate} from 'react-router-dom'


const ProtectedRoutesComponent = () => {

  const auth = true

  // Outlet is everything between protected routes component
  return auth ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutesComponent