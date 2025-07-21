"use client"

import { motion } from "framer-motion"
import { useState } from "react"

// Animation variants
const containerVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
}

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const floatingElementVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

// Floating elements data - dark mode uyğun rənglər
const FLOATING_ELEMENTS = [
  {
    id: 1,
    className: "absolute top-4 right-4 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full",
    delay: 0,
  },
  {
    id: 2,
    className: "absolute bottom-4 left-4 w-2 h-2 bg-pink-500 dark:bg-pink-400 rounded-full",
    delay: 1,
  },
  {
    id: 3,
    className: "absolute top-1/2 left-4 w-1 h-1 bg-indigo-500 dark:bg-indigo-400 rounded-full",
    delay: 2,
  },
  {
    id: 4,
    className: "absolute top-8 left-8 w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full",
    delay: 1.5,
  },
  {
    id: 5,
    className: "absolute bottom-8 right-8 w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full",
    delay: 0.5,
  },
]

const PROFILE_BADGES = [
  {
    text: "Fresh Graduate",
    color:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50",
    icon: "🎓",
  },
  {
    text: "ML Enthusiast",
    color:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50",
    icon: "🤖",
  },
  {
    text: "Problem Solver",
    color:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50",
    icon: "💡",
  },
]

// Components
const FloatingElement = ({ element }) => (
  <motion.div
    key={element.id}
    className={element.className}
    variants={floatingElementVariants}
    animate="animate"
    style={{
      animationDelay: `${element.delay}s`,
    }}
  />
)

const ProfileBadge = ({ badge, index }) => (
  <motion.div
    key={badge.text}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{
      duration: 0.3,
      delay: index * 0.1,
      ease: "easeOut",
    }}
    viewport={{ once: true }}
    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color} cursor-default transition-all duration-300`}
  >
    <span>{badge.icon}</span>
    <span>{badge.text}</span>
  </motion.div>
)

const ProfileImage = ({ image, isLoaded, setIsLoaded }) => (
  <div className="relative w-full max-w-[20rem] h-80 mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 dark:from-blue-400/20 dark:via-purple-400/10 dark:to-pink-400/20 border-2 border-blue-500/30 dark:border-blue-400/30 shadow-2xl dark:shadow-black/40 sm:w-80">
    {/* Loading placeholder */}
    {!isLoaded && (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10 dark:from-blue-400/10 dark:to-pink-400/10 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 dark:border-blue-400/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    )}

    {/* Profile Image */}
    <motion.img
      src={image}
      alt="Profile"
      className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    />

    {/* Floating Elements */}
    {FLOATING_ELEMENTS.map((element) => (
      <FloatingElement key={element.id} element={element} />
    ))}

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
  </div>
)

const ProfileInfo = () => (
  <motion.div variants={contentVariants} className="mt-6 text-center space-y-4">
    <div className="space-y-2">
      <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100">🎓 Information Security Graduate</h4>
      <p className="text-gray-600 dark:text-gray-300 text-base">
        Passionate about <span className="text-blue-600 dark:text-blue-400 font-semibold">Computer Vision</span> &{" "}
        <span className="text-blue-600 dark:text-blue-400 font-semibold">Machine Learning</span>
      </p>
    </div>

    {/* Profile Badges */}
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {PROFILE_BADGES.map((badge, index) => (
        <ProfileBadge key={badge.text} badge={badge} index={index} />
      ))}
    </div>

    {/* Additional Info */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
      className="pt-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm"
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">🌍 Based in Baku, Azerbaijan</p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">🚀 Ready for new opportunities</p>
    </motion.div>
  </motion.div>
)

// Main Component
const ProfilePictureSection = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const image = "myimage3.jpg"

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="relative group flex justify-center"
    >
      {/* Background Glow Effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-pink-500/20 dark:from-blue-400/20 dark:to-pink-400/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

      {/* Main Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl dark:shadow-black/40 bg-gradient-to-br from-white/90 to-gray-50/70 dark:from-gray-900/90 dark:to-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-500 w-full max-w-lg">
        <div className="p-6 flex flex-col items-center">
          <ProfileImage image={image} isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
          <ProfileInfo />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400" />
      </div>
    </motion.div>
  )
}

export default ProfilePictureSection
