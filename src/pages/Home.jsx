import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        setLoading(true)
        appwriteService.getPosts()
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                }
            })
            .finally(() => setLoading(false))
    }, [authStatus])

    if (loading) {
        return (
            <div className="w-full py-12">
                <Container>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-64 bg-gray-200 rounded-xl"></div>
                                <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-16">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            {authStatus ? 'No posts yet' : 'Explore our community'}
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            {authStatus 
                                ? 'Be the first to create a post!' 
                                : 'Sign in to discover amazing content from our community.'}
                        </p>
                        {!authStatus && (
                            <div className="flex justify-center space-x-4">
                                <Link
                                    to="/login"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                        {authStatus && (
                            <Link
                                to="/add-post"
                                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Create Your First Post
                            </Link>
                        )}
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {posts.map((post) => (
                        <PostCard key={post.$id} {...post} />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home