import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            appwriteService.deletePost(post.$id).then((status) => {
                if (status) {
                    appwriteService.deleteFile(post.featuredImage);
                    navigate("/");
                }
            });
        }
    };

    return post ? (
        <div className="py-8 bg-gray-50 min-h-screen">
            <Container>
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Featured Image */}
                    <div className="relative h-60  sm:h-96 w-full">
                        {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                <span className="text-gray-500">Loading image...</span>
                            </div>
                        )}
                        <img
                            src={appwriteService.getFileView(post.featuredImage)}
                            alt={post.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                        />

                        {isAuthor && (
                            <div className="absolute right-6 top-6 flex space-x-3">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-600 hover:bg-green-700" className="px-4 py-2 shadow-md">
                                        Edit Post
                                    </Button>
                                </Link>
                                <Button 
                                    bgColor="bg-red-600 hover:bg-red-700" 
                                    onClick={deletePost}
                                    className="px-4 py-2 shadow-md"
                                >
                                    Delete Post
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Post Content */}
                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
                            <div className="flex items-center text-gray-500 text-sm">
                                <span>Posted by {post.userId}</span>
                                {/* Add date if available */}
                                {/* <span className="mx-2">•</span>
                                <span>{new Date(post.$createdAt).toLocaleDateString()}</span> */}
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>

                {/* Related Posts or Comments Section can be added here */}
            </Container>
        </div>
    ) : (
        <div className="flex justify-center items-center h-screen">
            <Loader/>
        </div>
    );
}