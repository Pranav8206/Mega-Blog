import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

const PostCard = ({ $id, title, featuredImage }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (featuredImage) {
      try {
        const url = appwriteService.getFileView(featuredImage);
        setImageUrl(url);
        setImageError(false);
      } catch (error) {
        console.error("Error generating file view URL:", error);
        setImageError(true);
      }
    }
  }, [featuredImage]);

  return (
    <Link to={`/post/${$id}`} className="block h-full group">
      <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
        {/* Image container with aspect ratio */}
        <div className="relative pt-[56.25%] bg-gray-100 overflow-hidden">
          {imageError || !imageUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <img 
                src="/placeholder-image.jpg" 
                alt="Placeholder"
                className="w-1/2 h-auto opacity-50"
              />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                setImageError(true);
                e.target.onerror = null;
                e.target.src = "/placeholder-image.jpg";
              }}
              loading="lazy"
            />
          )}
        </div>
        
        {/* Content area */}
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h2>
          <div className="mt-auto pt-2 border-t border-gray-100">
            <span className="text-sm text-blue-600 font-medium">View Post →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;