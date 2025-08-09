import React,{ useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import authService from './appwrite/auth'
import { login, logout , finishLoading} from './store/authSlice'
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import Loader from './components/Loader'

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
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
         <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) 
}

export default App
