import React, { useState, useEffect, useRef } from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

const PostCardSlider = ({ $id, title, featuredImage, content }) => {
  const [imageUrl, setImageUrl] = useState("")
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (featuredImage) {
      try {
        const url = appwriteService.getFileView(featuredImage)
        setImageUrl(url)
        setImageError(false)
      } catch (error) {
        console.error("Error generating file view URL:", error)
        setImageError(true)
      }
    }
  }, [featuredImage])

  const getPreviewText = (htmlContent) => {
    if (!htmlContent) return ""
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    const textContent = tempDiv.textContent || tempDiv.innerText || ""
    return textContent.slice(0, 150) + (textContent.length > 150 ? "..." : "")
  }

  return (
    <Link to={`/post/${$id}`} className="block h-full group">
      <div className="relative h-full bg-gradient-to-br from-blue-400  to-blue-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.5)] hover:-translate-y-2 hover:scale-[1.02]">

        <div className="relative z-10 flex flex-col md:flex-row h-full">

          <div className="relative md:w-2/3 h-60 md:h-auto overflow-hidden">
            {imageError || !imageUrl ? (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-800/80 backdrop-blur-sm">
                <svg className="w-12 h-12 text-white/70 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ) : (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-blue-800/40 animate-pulse"></div>
                )}
                <img
                  src={imageUrl}
                  alt={title}
                  className={`w-full h-full object-fit  transition-all duration-1000 group-hover:scale-110 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    setImageError(true)
                    e.target.style.display = 'none'
                  }}
                  loading="lazy"
                />
              </>
            )}
          </div>

          <div className="flex-1 p-4  sm:py-6 sm:px-5 flex flex-col justify-between md:w-1/2">
            <div>
              <h3 className="sm:text-2xl text-xl font-bold text-white sm:mb-4 leading-tight group-hover:text-blue-100 transition-colors duration-300">
                {title}
              </h3>
              {content && (
                <p className="text-blue-100 max-md:hidden text-base leading-relaxed lg:mb-6 group-hover:text-blue-50 transition-colors duration-300 max-h-40  overflow-hidden">
                  {getPreviewText(content)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-white/30">
              <span className="text-white text-sm font-semibold">Read Full Story</span>
              <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full group-hover:bg-white/30 transition-all duration-300">
                <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const PostSlider = ({ posts = [] }) => {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dragStartX = useRef(0)
  const dragDelta = useRef(0)
  const trackRef = useRef(null)
  const autoplayRef = useRef(null)
  const progressRef = useRef(null)
  const AUTOPLAY_MS = 4000

  const slides = posts.slice(0, Math.min(4, posts.length))

  useEffect(() => {
    if (slides.length > 0 && current >= slides.length) {
      setCurrent(0)
    }
  }, [slides.length, current])

  useEffect(() => {
    if (slides.length <= 1 || isPaused || isDragging || isTransitioning) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
      return
    }

    autoplayRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length)
    }, AUTOPLAY_MS)

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [isPaused, isDragging, isTransitioning, slides.length])

  useEffect(() => {
    function handleVisibility() {
      setIsPaused(document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const next = () => {
    if (slides.length <= 1 || isTransitioning) return
    setIsTransitioning(true)
    setCurrent((c) => (c + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prev = () => {
    if (slides.length <= 1 || isTransitioning) return
    setIsTransitioning(true)
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index) => {
    if (index === current || isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Enhanced Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
      if (e.key === ' ') {
        e.preventDefault()
        setIsPaused(!isPaused)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [slides.length, isPaused])

  // Enhanced Drag handlers
  const onPointerDown = (e) => {
    if (slides.length <= 1 || isTransitioning) return
    
    setIsDragging(true)
    setIsPaused(true)
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX
    dragDelta.current = 0
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
    }
  }

  const onPointerMove = (e) => {
    if (!isDragging || slides.length <= 1) return
    
    const x = e.touches ? e.touches[0].clientX : e.clientX
    dragDelta.current = x - dragStartX.current
    if (trackRef.current) {
      const currentTransform = -(current * (100 / slides.length))
      const deltaPercent = (dragDelta.current / window.innerWidth) * 100
      trackRef.current.style.transform = `translateX(${currentTransform + deltaPercent}%)`
    }
  }

  const onPointerUp = () => {
    if (!isDragging || slides.length <= 1) return
    
    setIsDragging(false)
    setIsPaused(false)
    if (trackRef.current) {
      trackRef.current.style.transition = ''
    }

    const threshold = 80
    if (dragDelta.current > threshold) {
      prev()
    } else if (dragDelta.current < -threshold) {
      next()
    } else {
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${current * (100 / slides.length)}%)`
      }
    }
    dragDelta.current = 0
  }

  // Sync transform with smooth transitions
  useEffect(() => {
    if (trackRef.current && !isDragging) {
      trackRef.current.style.transform = `translateX(-${current * (100 / slides.length)}%)`
    }
  }, [current, isDragging, slides.length])

  if (slides.length === 0) return null

  return (
    <div className="relative ">
      <div className="flex items-center justify-between mb-5 sm:mb-8">
        <div className="sm:space-y-1">
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
            Featured Stories
          </h2>
          <div className="w-15 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>
        
        {slides.length > 1 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-3 cursor-pointer rounded-full max-sm:hidden bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 hover:scale-105"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              )}
            </button>

            <div className="flex space-x-2">
              <button
                onClick={prev}
                disabled={isTransitioning}
                className="p-2 sm:p-3 rounded-full cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 "
                aria-label="Previous slide"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={isTransitioning}
                className="p-2 sm:p-3 rounded-full cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 hover:scale-105 disabled:opacity-50 "
                aria-label="Next slide"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-3xl ring-1 ring-black/5 shadow-2xl md:w-2/3 mx-auto "
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="cursor-grab active:cursor-grabbing select-none"
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={() => isDragging && onPointerUp()}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          style={{ touchAction: 'pan-y' }}
        >
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-out"
            style={{ width: `${slides.length * 100}%` }}
          >
            {slides.map((post, index) => (
              <div
                key={post.$id}
                className={`flex-shrink-0 w-full  transition-all duration-700 ${
                  index === current ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                }`}
                style={{ width: `${100 / slides.length}%` }}
              >
                <div className="h-[500px] max-w-3xl mx-auto">
                  <PostCardSlider {...post} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && !isPaused && !isDragging && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              ref={progressRef}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 ease-linear shadow-lg"
              style={{ 
                width: `${((current + 1) / slides.length) * 100}%`,
                animation: `slideProgress ${AUTOPLAY_MS}ms linear infinite`
              }}
            />
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => goToSlide(i)}
              disabled={isTransitioning}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 cursor-pointer hover:scale-100  ${
                i === current 
                  ? 'w-8 h-3 bg-blue-600 rounded-full shadow-lg' 
                  : 'w-3 h-3 bg-gray-400 rounded-full hover:bg-gray-400 hover:w-8'
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes slideProgress {
          from { width: ${(current / slides.length) * 100}%; }
          to { width: ${((current + 1) / slides.length) * 100}%; }
        }
      `}</style>
    </div>
  )
}

export default PostSlider