import React, { useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'


const Protected = ({children, authentication = true}) => {

    const navigate = useNavigate()
    const authStatus = useSelector((state) => state.auth.status);
  const loading = useSelector((state) => state.auth.loading);

    useEffect(() => {
      if (loading) return
        if (authentication && !authStatus) {
          navigate('/login')
        } else if (!authentication && authStatus ) {
          navigate('/')
        }
      
    }, [authStatus, navigate, authentication, loading])
    

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader/>
      </div>
    );
  }

  return <>{children}</>;
}

export default Protected
