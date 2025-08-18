import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard, PostSlider } from '../components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const authStatus = useSelector((state) => state.auth.status)

  // Calculate splits
  const featuredPosts = posts.slice(0, Math.min(4, posts.length))
  const remainingPosts = posts.slice(Math.min(4, posts.length))

  // Fetch posts
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    appwriteService
      .getPosts()
      .then((resp) => {
        if (resp && resp.documents) {
          setPosts(resp.documents)
        } else {
          setPosts([])
        }
      })
      .catch((error) => {
        console.error('Error fetching posts:', error)
        setError('Failed to load posts. Please try again later.')
        setPosts([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [authStatus])

  if (loading) {
    return (
      <div className="w-full py-12">
        <Container>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-3xl animate-pulse"></div>
          </div>

          <div className="mb-8">
            <div className="h-8 w-40 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </Container>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-10 sm:py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="size-15 sm:size-20  bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {authStatus ? 'No posts yet' : 'Welcome to our blog'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {authStatus
                ? 'Be the first to create a post and share your thoughts with the community!'
                : 'Sign in to discover amazing content from our community and start your blogging journey.'}
            </p>
            {!authStatus ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mx-8">
                <Link
                  to="/login"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Login to Explore
                </Link>
                <Link
                  to="/signup"
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Create Account
                </Link>
              </div>
            ) : (
              <Link
                to="/add-post"
                className="inline-flex mx-4 items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Post
              </Link>
            )}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Container>
        <div className="py-8">
          <PostSlider posts={featuredPosts} />
        </div>

        {remainingPosts.length > 0 && (
          <div className="py-3 sm:py-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  More Stories
                </h2>
                <p className="text-gray-600">
                  Explore our latest articles and insights
                </p>
              </div>
              
              {authStatus && (
                <Link
                  to="/add-post"
                  className="inline-flex items-center px-2 py-1.5 sm:mr-10 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New <span className='hidden sm:block sm:pl-1'> Post</span>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {remainingPosts.map((post) => (
                <PostCard key={post.$id} {...post} />
              ))}
            </div>

            {remainingPosts.length >= 8 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Load More Posts
                </button>
              </div>
            )}
          </div>
        )}

        {authStatus && posts.length > 0 && (
          <div className="py-16">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Share Your Story?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our community of writers and share your unique perspective with readers around the world.
              </p>
              <Link
                to="/add-post"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Start Writing
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

export default Home