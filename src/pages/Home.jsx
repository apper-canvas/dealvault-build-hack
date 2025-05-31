import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white bg-opacity-80 backdrop-blur-lg border-b border-surface-200 dark:bg-surface-900 dark:bg-opacity-80 dark:border-surface-700"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow"
              >
                <ApperIcon name="Vault" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold gradient-text">DealVault</h1>
                <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 hidden sm:block">
                  Lifetime Deal Tracker
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-surface-700 dark:text-surface-300" 
                />
              </motion.button>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary to-secondary rounded-xl text-white text-sm font-medium"
              >
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                <span>Track LTDs</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 sm:mt-20 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Vault" className="w-3 h-3 text-white" />
              </div>
              <span className="text-surface-600 dark:text-surface-400 text-sm">
                © 2024 DealVault. Track your lifetime deals smartly.
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-surface-500 dark:text-surface-400">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="#" 
                className="hover:text-primary transition-colors flex items-center space-x-1"
              >
                <ApperIcon name="Github" className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="#" 
                className="hover:text-primary transition-colors flex items-center space-x-1"
              >
                <ApperIcon name="Twitter" className="w-4 h-4" />
                <span className="hidden sm:inline">Twitter</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home