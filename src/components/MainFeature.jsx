import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'
import Chart from 'react-apexcharts'

// Sample deals data
const sampleDeals = [
  {
    id: '1703001600000',
    name: 'Notion Lifetime Deal',
    price: 59.00,
    purchaseDate: '2024-01-15',
    source: 'AppSumo',
    status: 'active',
    category: 'Productivity',
    notes: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    rating: 5,
    statusHistory: [
      { status: 'active', date: '2024-01-15T10:30:00.000Z' }
    ]
  },
  {
    id: '1703088000000',
    name: 'Figma Professional',
    price: 89.00,
    purchaseDate: '2024-02-03',
    source: 'PitchGround',
    status: 'active',
    category: 'Design',
    notes: 'UI/UX design tool with real-time collaboration features.',
    rating: 4,
    statusHistory: [
      { status: 'active', date: '2024-02-03T14:15:00.000Z' }
    ]
  },
  {
    id: '1703174400000',
    name: 'ClickFunnels LTD',
    price: 297.00,
    purchaseDate: '2024-01-28',
    source: 'FB Group',
    status: 'dead',
    category: 'Marketing',
    notes: 'Sales funnel builder - company went out of business.',
    rating: 2,
    statusHistory: [
      { status: 'active', date: '2024-01-28T09:45:00.000Z' },
      { status: 'dead', date: '2024-05-12T16:20:00.000Z' }
    ]
  },
  {
    id: '1703260800000',
    name: 'Grammarly Premium',
    price: 39.00,
    purchaseDate: '2024-03-10',
    source: 'AppSumo',
    status: 'active',
    category: 'Writing',
    notes: 'AI-powered writing assistant for grammar and style.',
    rating: 4,
    statusHistory: [
      { status: 'active', date: '2024-03-10T11:30:00.000Z' }
    ]
  },
  {
    id: '1703347200000',
    name: 'Canva Pro Lifetime',
    price: 49.00,
    purchaseDate: '2024-02-20',
    source: 'Direct',
    status: 'active',
    category: 'Design',
    notes: 'Graphic design platform with premium templates.',
    rating: 5,
    statusHistory: [
      { status: 'active', date: '2024-02-20T13:45:00.000Z' }
    ]
  },
  {
    id: '1703433600000',
    name: 'Mailchimp Alternative',
    price: 67.00,
    purchaseDate: '2024-01-05',
    source: 'AppSumo',
    status: 'refunded',
    category: 'Email Marketing',
    notes: 'Email marketing tool - refunded due to poor deliverability.',
statusHistory: [
      { status: 'active', date: '2024-01-05T08:20:00.000Z' },
      { status: 'refunded', date: '2024-02-15T10:30:00.000Z' }
],
    refund_date: '2024-02-15'
  },
  {
    id: '1703520000000',
    name: 'Airtable Pro',
    price: 79.00,
    purchaseDate: '2024-03-22',
    source: 'PitchGround',
    status: 'active',
    category: 'Database',
    notes: 'Spreadsheet-database hybrid for project management.',
    rating: 4,
    statusHistory: [
      { status: 'active', date: '2024-03-22T15:10:00.000Z' }
    ]
  },
  {
    id: '1703606400000',
    name: 'Loom Screen Recorder',
    price: 25.00,
    purchaseDate: '2024-04-05',
    source: 'AppSumo',
    status: 'active',
    category: 'Video',
    notes: 'Simple screen recording tool for quick demos.',
    rating: 3,
    statusHistory: [
      { status: 'active', date: '2024-04-05T12:00:00.000Z' }
    ]
  },
  {
    id: '1703692800000',
    name: 'Social Media Scheduler',
    price: 45.00,
    purchaseDate: '2024-02-14',
    source: 'FB Group',
    status: 'dead',
    category: 'Social Media',
    notes: 'Platform shut down after 6 months.',
    rating: 1,
    statusHistory: [
      { status: 'active', date: '2024-02-14T16:30:00.000Z' },
      { status: 'dead', date: '2024-08-20T14:45:00.000Z' }
    ]
  },
  {
    id: '1703779200000',
    name: 'Slack Alternative',
    price: 99.00,
    purchaseDate: '2024-04-18',
    source: 'Direct',
    status: 'active',
    category: 'Communication',
    notes: 'Team communication tool with better privacy features.',
    rating: 4,
    statusHistory: [
      { status: 'active', date: '2024-04-18T09:15:00.000Z' }
    ]
},
{
    id: '1703865600000',
    name: 'Photoshop Alternative',
    price: 129.00,
    purchaseDate: '2024-05-10',
    source: 'StackSocial',
    status: 'active',
    category: 'Design',
    notes: 'Professional photo editing software with AI features.',
    rating: 4,
    statusHistory: [
      { status: 'active', date: '2024-05-10T14:20:00.000Z' }
    ]
  },
  {
    id: '1703952000000',
    name: 'Project Management Pro',
    price: 89.00,
    purchaseDate: '2024-03-28',
    source: 'AppSumo',
    status: 'active',
    category: 'Productivity',
    notes: 'Advanced project management with team collaboration tools.',
    rating: 5,
    statusHistory: [
      { status: 'active', date: '2024-03-28T11:45:00.000Z' }
    ]
  }
];

const MainFeature = () => {
  const [deals, setDeals] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [activeTab, setActiveTab] = useState('deals')
  const [sortBy, setSortBy] = useState('purchaseDate')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    source: '',
    status: 'active',
    category: '',
    notes: '',
rating: 3,
refund_date: ''
  })

  // Load deals from localStorage on mount
  useEffect(() => {
    const savedDeals = localStorage.getItem('dealvault-deals')
    if (savedDeals && savedDeals !== 'null' && savedDeals !== '[]') {
      try {
        const parsedDeals = JSON.parse(savedDeals)
        if (Array.isArray(parsedDeals) && parsedDeals.length > 0) {
          setDeals(parsedDeals)
          return
        }
      } catch (error) {
        console.error('Failed to parse saved deals:', error)
      }
    }
    
    // Initialize with sample data if no valid saved deals exist
    setDeals(sampleDeals)
    localStorage.setItem('dealvault-deals', JSON.stringify(sampleDeals))
  }, [])

  // Save deals to localStorage whenever deals change (but not on initial empty state)
  useEffect(() => {
    if (deals.length > 0) {
      localStorage.setItem('dealvault-deals', JSON.stringify(deals))
    }
  }, [deals])

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      purchaseDate: format(new Date(), 'yyyy-MM-dd'),
      source: '',
      status: 'active',
      category: '',
      notes: '',
      rating: 3
refund_date: ''
})

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.source) {
      toast.error('Please fill in all required fields')
      return
    }

    const dealData = {
      ...formData,
      id: editingDeal ? editingDeal.id : Date.now().toString(),
      price: parseFloat(formData.price),
      rating: parseInt(formData.rating),
      statusHistory: editingDeal?.statusHistory || [
        { status: formData.status, date: new Date().toISOString() }
      ]
    }

    if (editingDeal) {
      // Check if status changed
      if (editingDeal.status !== formData.status) {
        dealData.statusHistory = [
          ...editingDeal.statusHistory,
          { status: formData.status, date: new Date().toISOString() }
        ]
      }
      
      setDeals(deals.map(deal => deal.id === editingDeal.id ? dealData : deal))
      toast.success('Deal updated successfully!')
      setEditingDeal(null)
    } else {
      setDeals([...deals, dealData])
      toast.success('Deal added successfully!')
    }

    resetForm()
    setShowAddForm(false)
  }

  const handleEdit = (deal) => {
    setFormData({
      ...deal,
      purchaseDate: format(parseISO(deal.purchaseDate), 'yyyy-MM-dd')
    })
    setEditingDeal(deal)
    setShowAddForm(true)
  }

  const handleDelete = (dealId) => {
    setDeals(deals.filter(deal => deal.id !== dealId))
    toast.success('Deal deleted successfully!')
  }

  const handleStatusUpdate = (dealId, newStatus) => {
    setDeals(deals.map(deal => {
      if (deal.id === dealId) {
        const updatedDeal = {
          ...deal,
          status: newStatus,
          statusHistory: [
            ...deal.statusHistory,
            { status: newStatus, date: new Date().toISOString() }
          ]
        }
        return updatedDeal
      }
      return deal
    }))
    toast.success(`Deal status updated to ${newStatus}`)
  }

  // Analytics calculations
  const analytics = useMemo(() => {
    const now = new Date()
    const currentMonth = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)
    
    const currentMonthDeals = deals.filter(deal => 
      isWithinInterval(parseISO(deal.purchaseDate), { 
        start: currentMonth, 
        end: currentMonthEnd 
      })
    )
    
    const lifetimeTotal = deals.reduce((sum, deal) => sum + deal.price, 0)
    const currentMonthTotal = currentMonthDeals.reduce((sum, deal) => sum + deal.price, 0)
    const avgDealPrice = deals.length > 0 ? lifetimeTotal / deals.length : 0
    
    const statusCounts = deals.reduce((acc, deal) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1
      return acc
    }, {})

    // Monthly spending data for chart
    const monthlyData = deals.reduce((acc, deal) => {
      const month = format(parseISO(deal.purchaseDate), 'yyyy-MM')
      acc[month] = (acc[month] || 0) + deal.price
      return acc
    }, {})

    const chartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months

    return {
      lifetimeTotal,
      currentMonthTotal,
      avgDealPrice,
      totalDeals: deals.length,
      activeDeals: statusCounts.active || 0,
      deadDeals: statusCounts.dead || 0,
      refundedDeals: statusCounts.refunded || 0,
      monthlyData: chartData
    }
  }, [deals])

  // Filtered and sorted deals
  const filteredDeals = useMemo(() => {
    let filtered = deals

    if (filterStatus !== 'all') {
      filtered = filtered.filter(deal => deal.status === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price':
          return b.price - a.price
        case 'status':
          return a.status.localeCompare(b.status)
        default: // purchaseDate
          return new Date(b.purchaseDate) - new Date(a.purchaseDate)
      }
    })
  }, [deals, filterStatus, searchTerm, sortBy])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-white'
      case 'dead': return 'bg-danger text-white'
      case 'refunded': return 'bg-warning text-white'
      default: return 'bg-surface-500 text-white'
    }
  }

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    colors: ['#6366f1'],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 5
    },
    xaxis: {
      categories: analytics.monthlyData.map(([month]) => format(parseISO(month + '-01'), 'MMM yyyy')),
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(0)}`,
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header Stats */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Lifetime Total</p>
              <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                ${analytics.lifetimeTotal.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">This Month</p>
              <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                ${analytics.currentMonthTotal.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Deals</p>
              <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                {analytics.totalDeals}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Avg Deal</p>
              <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
                ${analytics.avgDealPrice.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success to-green-700 rounded-xl flex items-center justify-center">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex bg-surface-100 dark:bg-surface-800 rounded-xl p-1">
          {[
            { id: 'deals', label: 'Deals', icon: 'Package' },
            { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-surface-700 text-primary shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-glow transition-all"
        >
          <ApperIcon name="Plus" className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Deal</span>
        </motion.button>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'deals' && (
          <motion.div
            key="deals"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-3 w-4 h-4 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="dead">Dead</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
              >
                <option value="purchaseDate">Date</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Deals List */}
            <div className="grid gap-4 sm:gap-6">
              {filteredDeals.length === 0 ? (
                <div className="deal-card p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
                    <ApperIcon name="Package" className="w-8 h-8 text-surface-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                    No deals found
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    {deals.length === 0 
                      ? "Start tracking your lifetime deals by adding your first purchase."
                      : "Try adjusting your filters or search terms."
                    }
                  </p>
                  {deals.length === 0 && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-glow transition-all"
                    >
                      <ApperIcon name="Plus" className="w-5 h-5" />
                      <span>Add Your First Deal</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="deal-card p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 space-y-2 sm:space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                            {deal.name}
                          </h3>
                          <span className={`status-badge w-fit ${getStatusColor(deal.status)}`}>
                            {deal.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600 dark:text-surface-400">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="DollarSign" className="w-4 h-4" />
                            <span className="font-semibold text-lg text-surface-900 dark:text-white">
                              ${deal.price}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>{format(parseISO(deal.purchaseDate), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="ExternalLink" className="w-4 h-4" />
                            <span>{deal.source}</span>
                          </div>
                          {deal.category && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Tag" className="w-4 h-4" />
                              <span>{deal.category}</span>
                            </div>
                          )}
                        </div>

{deal.refund_date && deal.status === 'refunded' && (
                          <div className="flex items-center space-x-1 text-sm text-surface-600 dark:text-surface-400 mt-1">
                            <ApperIcon name="RotateCcw" className="w-4 h-4" />
                            <span>Refunded on {format(parseISO(deal.refund_date), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                        {deal.notes && (
                          <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">
                            {deal.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={deal.status}
                          onChange={(e) => handleStatusUpdate(deal.id, e.target.value)}
                          className="px-3 py-1 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
                        >
                          <option value="active">Active</option>
                          <option value="dead">Dead</option>
                          <option value="refunded">Refunded</option>
                        </select>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(deal)}
                          className="p-2 text-surface-600 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(deal.id)}
                          className="p-2 text-surface-600 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            {/* Status Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Active Deals</p>
                    <p className="text-2xl font-bold text-success">{analytics.activeDeals}</p>
                  </div>
                  <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Dead Deals</p>
                    <p className="text-2xl font-bold text-danger">{analytics.deadDeals}</p>
                  </div>
                  <ApperIcon name="XCircle" className="w-8 h-8 text-danger" />
                </div>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Refunded</p>
                    <p className="text-2xl font-bold text-warning">{analytics.refundedDeals}</p>
                  </div>
                  <ApperIcon name="RotateCcw" className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>

            {/* Spending Chart */}
            {analytics.monthlyData.length > 0 && (
              <div className="deal-card p-6">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6">
                  Monthly Spending Trend
                </h3>
                <div className="h-64 sm:h-80">
                  <Chart
                    options={chartOptions}
                    series={[{
                      name: 'Monthly Spending',
                      data: analytics.monthlyData.map(([, amount]) => amount)
                    }]}
                    type="area"
                    height="100%"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Deal Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddForm(false)
              setEditingDeal(null)
              resetForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
                  {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingDeal(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Deal Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                    placeholder="e.g., Notion Lifetime Deal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                      placeholder="59.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Source *
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                    placeholder="e.g., AppSumo, FB Group, Direct"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="dead">Dead</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                      placeholder="e.g., Productivity, Design"
                    />
                  </div>
                </div>

{formData.status === 'refunded' && (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Refund Date
                    </label>
                    <input
                      type="date"
                      value={formData.refund_date}
                      onChange={(e) => setFormData({ ...formData, refund_date: e.target.value })}
                      className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Rating (1-5)
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className={`p-1 rounded transition-colors ${
                          star <= formData.rating ? 'text-yellow-400' : 'text-surface-300'
                        }`}
                      >
                        <ApperIcon name="Star" className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 dark:border-surface-600 dark:text-white resize-none"
                    placeholder="Additional notes about this deal..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingDeal(null)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-glow transition-all"
                  >
                    {editingDeal ? 'Update Deal' : 'Add Deal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature