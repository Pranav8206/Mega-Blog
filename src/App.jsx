import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout , finishLoading} from './store/authSlice'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  // const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData)=>{
      if (userData) {
        dispatch(login(userData))
      } else {
        dispatch(logout())
      }
    })
    .catch(() => dispatch(logout()))
    .finally(()=> {
       dispatch(finishLoading());
    } )
  }, [dispatch])
  
  
  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-300'>
      <div className='w-full block'>
        <Header />
        <main className='min-h-[60vh]'>
         <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) 
}

export default App
