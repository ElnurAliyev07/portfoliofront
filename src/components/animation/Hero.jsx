"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail, Download, Eye } from "lucide-react"
import GalaxyBackground from "./GalaxyBackground"
import AnimatedText from "./AnimatedText"
import LoadingScreen from "./LoadingScreen" // Yeni loading screen import
import PropTypes from "prop-types"

/**
 * CONSTANTS AND CONFIGURATION
 */
const HERO_CONFIG = {
  animation: {
    baseDelay: 0.1,
    staggerDelay: 0.2,
    duration: 0.4,
    spring: {
      stiffness: 200,
      damping: 40,
    },
  },
  performance: {
    mouseThrottleDelay: 100,
    scrollSampling: ["start start", "end start"],
    scrollFadeRange: [0, 0.5],
  },
  socialLinks: [
    {
      id: "github",
      icon: Github,
      href: "https://github.com/ElnurAliyev07",
      label: "GitHub",
      color: "from-purple-400 to-purple-600",
      hoverColor: "hover:from-purple-500 hover:to-purple-700",
    },
    {
      id: "linkedin",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/elnur-aliyev-a17160265/",
      label: "LinkedIn",
      color: "from-blue-400 to-blue-600",
      hoverColor: "hover:from-blue-500 hover:to-blue-700",
    },
    {
      id: "email",
      icon: Mail,
      href: "mailto:elnuraliyev.mail@gmail.com",
      label: "Email",
      color: "from-emerald-400 to-emerald-600",
      hoverColor: "hover:from-emerald-500 hover:to-emerald-700",
    },
  ],
  content: {
    name: "Elnur Aliyev",
    title: "AI/ML Engineer & Python Full-Stack Developer",
    description: "Passionate about data, AI/ML and building intelligent applications",
    buttons: {
      primary: {
        text: "View My Work",
        icon: Eye,
        action: "scroll",
        target: "projects",
      },
      secondary: {
        text: "Download Resume",
        icon: Download,
        action: "download",
        target: "/ElnurAliyevResume.pdf",
      },
    },
  },
}

/**
 * Custom Hook: useMousePosition
 */
const useMousePosition = (throttleDelay = HERO_CONFIG.performance.mouseThrottleDelay) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let throttleTimeout = null

    const handleMouseMove = (event) => {
      if (throttleTimeout) return

      throttleTimeout = setTimeout(() => {
        const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2
        const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2

        setMousePosition({
          x: normalizedX,
          y: normalizedY,
        })

        throttleTimeout = null
      }, throttleDelay)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (throttleTimeout) clearTimeout(throttleTimeout)
    }
  }, [throttleDelay])

  return mousePosition
}

/**
 * Custom Hook: useScrollFade
 */
const useScrollFade = (targetRef) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: HERO_CONFIG.performance.scrollSampling,
  })

  const opacity = useTransform(scrollYProgress, HERO_CONFIG.performance.scrollFadeRange, [1, 0])

  const smoothOpacity = useSpring(opacity, HERO_CONFIG.animation.spring)

  return smoothOpacity
}

/**
 * SocialLink Component
 */
const SocialLink = ({ icon: Icon, href, label, color, hoverColor, index }) => {
  const handleClick = useCallback(
    (e) => {
      if (href.startsWith("mailto:")) {
        window.location.href = href
      } else {
        window.open(href, "_blank", "noopener,noreferrer")
      }
    },
    [href],
  )

  return (
    <motion.button
      onClick={handleClick}
      className={`
      w-14 h-14 sm:w-16 sm:h-16 rounded-full 
      bg-gradient-to-r ${color} ${hoverColor}
      flex items-center justify-center
      transition-all duration-300 shadow-lg hover:shadow-xl
      focus:outline-none focus:ring-2 focus:ring-white/50
      hover:scale-110 border-2 border-gray-800/50
    `}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: HERO_CONFIG.animation.duration,
        delay: 0.8 + index * 0.05,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Visit ${label} profile`}
    >
      <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
    </motion.button>
  )
}

/**
 * ActionButton Component
 */
const ActionButton = ({ text, icon: Icon, action, target, variant = "primary", delay = 0 }) => {
  const handleClick = useCallback(() => {
    if (action === "scroll") {
      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [action, target])

  const baseClasses = `
  px-4 py-3 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-xl 
  flex items-center justify-center
  transition-all duration-300 shadow-lg hover:shadow-xl
  focus:outline-none focus:ring-2 focus:ring-white/50
  hover:scale-105 active:scale-95 border-2
`

  const variantClasses = {
    primary: `
    bg-gradient-to-r from-blue-600 to-purple-600 
    hover:from-blue-700 hover:to-purple-700
    text-white border-gray-800
  `,
    secondary: `
    bg-gray-900/80 border-gray-700
    text-white hover:bg-gray-800/90
    backdrop-blur-sm
  `,
  }

  if (action === "download") {
    return (
      <motion.a
        href={target}
        download
        className={`${baseClasses} ${variantClasses[variant]}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: HERO_CONFIG.animation.duration, delay: 0.5 + delay }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={text}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        {text}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: HERO_CONFIG.animation.duration, delay: 0.5 + delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={text}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      {text}
    </motion.button>
  )
}

/**
 * ScrollIndicator Component
 */
const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      <motion.div
        className="flex flex-col items-center space-y-2 cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        onClick={() => {
          const nextSection = document.querySelector("section:nth-child(2)")
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" })
          }
        }}
        whileHover={{ scale: 1.1 }}
        role="button"
        aria-label="Scroll to next section"
        tabIndex={0}
      >
        <span className="text-white/80 text-sm font-medium drop-shadow-lg">Scroll to explore</span>
        <ArrowDown className="w-5 h-5 text-white/80 drop-shadow-lg" />
      </motion.div>
    </motion.div>
  )
}

/**
 * HeroContent Component
 */
const HeroContent = ({ opacity }) => {
  const { content, socialLinks } = HERO_CONFIG

  return (
    <motion.div style={{ opacity }} className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: HERO_CONFIG.animation.duration,
          delay: HERO_CONFIG.animation.baseDelay,
        }}
        className="
        relative bg-black/10 rounded-3xl border-2 border-gray-800/30
        p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-2xl
      "
      >
        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
          <AnimatedText
            text={content.name}
            className="
            font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 
            text-transparent bg-clip-text drop-shadow-lg
          "
            staggerDelay={0.1}
            initialDelay={0.2}
          />
        </h1>

        {/* Subtitle and description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: HERO_CONFIG.animation.duration,
            delay: 0.3,
          }}
          className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
        >
          <AnimatedText
            text={content.title}
            className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 drop-shadow-lg"
            staggerDelay={0.08}
            initialDelay={0.4}
          />
          <motion.p
            className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto drop-shadow-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {content.description}
          </motion.p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: HERO_CONFIG.animation.duration,
            delay: 0.5,
          }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10"
        >
          <ActionButton {...content.buttons.primary} variant="primary" delay={0} />
          <ActionButton {...content.buttons.secondary} variant="secondary" delay={0.1} />
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: HERO_CONFIG.animation.duration,
            delay: 0.7,
          }}
          className="flex justify-center space-x-4 sm:space-x-6"
          role="list"
          aria-label="Social media links"
        >
          {socialLinks.map((link, index) => (
            <SocialLink key={link.id} {...link} index={index} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Main Hero Component with Loading Screen Integration
 */
const Hero = ({
  className = "",
  customContent = null,
  showScrollIndicator = true,
  showLoadingScreen = true, // Yeni prop loading screen'i göstərmək üçün
}) => {
  const containerRef = useRef(null)
  const mousePosition = useMousePosition()
  const opacity = useScrollFade(containerRef)
  const [isLoading, setIsLoading] = useState(showLoadingScreen)

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && showLoadingScreen && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        id="home"
        ref={containerRef}
        className={`
        relative min-h-screen flex items-center justify-center 
        overflow-hidden ${className}
      `}
        role="banner"
        aria-label="Hero section"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Galaxy Background */}
        <motion.div style={{ opacity }} className="absolute inset-0 z-0">
          <GalaxyBackground mousePosition={mousePosition} />
        </motion.div>

        {/* Overlay for better text readability */}
        <div
          className="
        absolute inset-0 bg-gradient-to-b from-black/1 via-transparent to-black/1 
        z-10 pointer-events-none
      "
        />

        {/* Main Content */}
        {customContent ? (
          <motion.div style={{ opacity }} className="relative z-20">
            {customContent}
          </motion.div>
        ) : (
          <HeroContent opacity={opacity} />
        )}

        {/* Scroll Indicator */}
        {showScrollIndicator && <ScrollIndicator />}
      </motion.section>
    </>
  )
}

// PropTypes
Hero.propTypes = {
  className: PropTypes.string,
  customContent: PropTypes.node,
  showScrollIndicator: PropTypes.bool,
  showLoadingScreen: PropTypes.bool, // Yeni PropType
}

SocialLink.propTypes = {
  icon: PropTypes.elementType.isRequired,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  hoverColor: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  action: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  delay: PropTypes.number,
}

export default Hero