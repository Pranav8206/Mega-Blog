import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Selects } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import {RTE} from "../index";

const PostForm = ({ post = "" }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [contentLength, setContentLength] = useState(0);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
    
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateTitle = (value) => {
    if (!value) return "Title is required";
    if (value.length > 36) return "Title must be 36 characters or less";
    if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
      return "Title can only contain letters and numbers";
    }
    return true;
  };

  const validateContent = (value) => {
    if (value.length > 10000) {
      alert(
        "Content cannot exceed 10000 characters. Your content will be truncated."
      );
      return false;
    }
    return true;
  };

  const checkSlugAvailability = useCallback(
    async (slug) => {
      if (!slug || post?.slug === slug) return true;
      try {
        const existingPost = await appwriteService.getPost(slug);
        setSlugAvailable(!existingPost);
        return !existingPost;
      } catch (error) {
        console.error("Error checking slug:", error);
        return false;
      }
    },
    [post]
  );

  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const submit = async (data) => {
    if (!validateTitle(data.title)) return;
    if (!validateContent(data.content)) return;

    const isAvailable = await checkSlugAvailability(data.slug);
    if (!isAvailable) {
      alert("This title is already taken. Please choose a different title.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (post) {
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
        }
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });

        if (dbPost) {
          triggerCelebration();
          setTimeout(() => navigate(`/post/${dbPost.$id}`), 2000);
        }
      } else {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          const postData = {
            title: data.title,
            slug: data.slug,
            content: data.content.substring(0, 10000),
            status: data.status,
            featuredImage: file.$id,
            userId: userData.$id,
          };

          const dbPost = await appwriteService.createPost(postData);
          if (dbPost) {
            triggerCelebration();
            setTimeout(() => navigate(`/post/${dbPost.$id}`), 2000);
          }
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      if (error.message.includes("already exists")) {
        alert("This title is already taken. Please choose a different title.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value.trim().toLowerCase().replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch(async (value, { name }) => {
      if (name === "title") {
        const newSlug = slugTransform(value.title);
        setValue("slug", newSlug, { shouldValidate: true });
        await checkSlugAvailability(newSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue, checkSlugAvailability]);


  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={900}
          gravity={0.5}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* new Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Input
                  label="Title"
                  placeholder="Enter post title (max 36 chars, letters & numbers only)"
                  className="w-full"
                  {...register("title", {
                    required: "Title is required",
                    validate: validateTitle,
                  })}
                  maxLength={36}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
                {!slugAvailable && (
                  <p className="mt-1 text-sm text-red-600">
                    This title is already taken. Please modify it.
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {watch("title")?.length || 0}/36 characters
                </p>
              </div>

              <Input
                label="Slug"
                placeholder="post-slug"
                className="w-full"
                {...register("slug", { required: "Slug is required" })}
              />

              <div className="h-full">
                <RTE
                  label={`Content (${contentLength}/10000 characters)`}
                  name="content"
                  control={control}
                  defaultValue={getValues("content")}
                  className="min-h-[300px]"
                  onKeyDown={(e) => {
                    if (contentLength >= 10000 && e.key !== "Backspace") {
                      alert("Content cannot exceed 10000 characters");
                      e.preventDefault();
                    }
                  }}
                />
                {contentLength >= 10000 && (
                  <p className="mt-1 text-sm text-red-600">
                    Maximum 10000 characters reached
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <Input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  className="w-full"
                  {...register("image", {
                    required: !post && "Image is required",
                  })}
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
                {post && (
                  <div className="mt-2">
                    <img
                      src={appwriteService.getFileView(post.featuredImage)}
                      alt={post.title}
                      className="rounded-lg w-full h-auto max-h-48 object-cover"
                    />
                  </div>
                )}
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
              <Selects
                options={["Active (Everyone can see.)", "Inactive (Only you can see.)"]}
                label="Status"
                className="w-full"
                {...register("status", { required: "Status is required" })}
              />

              <Button
                type="submit"
                disabled={
                  isSubmitting || contentLength > 10000 || !slugAvailable
                }
                className={`w-full py-3 ${
                  post
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md transition-colors disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {post ? "Updating..." : "Submitting..."}
                  </span>
                ) : post ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </Button>

              {showConfetti && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-4"
                >
                  <h3 className="text-xl font-bold text-green-600">
                    {post
                      ? "Post Updated Successfully!"
                      : "Post Created Successfully!"}
                  </h3>
                  <p className="text-gray-600">Redirecting to your post...</p>
                </motion.div>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default PostForm;
