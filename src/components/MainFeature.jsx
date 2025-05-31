import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
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
      { status: 'active', date: '2024-01-15T14:15:00.000Z' }
    ]
  },
  {
    id: '1703087200000',
    name: 'Figma Alternative',
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
    notes: 'Sales funnel builder with lifetime access.',
    rating: 2,
    statusHistory: [
      { status: 'active', date: '2024-01-28T09:15:00.000Z' },
      { status: 'dead', date: '2024-08-15T14:30:00.000Z' }
    ]
  },
  {
    id: '1703260800000',
    name: 'Database Management Pro',
    price: 79.00,
    purchaseDate: '2024-01-05',
    source: 'AppSumo',
    status: 'refunded',
    category: 'Database',
    notes: 'Had to request refund due to poor performance.',
    rating: 2,
    refund_date: '2024-02-15',
    statusHistory: [
      { status: 'active', date: '2024-01-05T08:20:00.000Z' },
      { status: 'refunded', date: '2024-02-15T10:30:00.000Z' }
    ]
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
    name: 'Social Media Tool',
    price: 149.00,
    purchaseDate: '2024-01-20',
    source: 'FB Group',
    status: 'dead',
    category: 'Social Media',
    notes: 'Platform shut down after 6 months.',
    rating: 1,
    statusHistory: [
      { status: 'active', date: '2024-01-20T16:30:00.000Z' },
      { status: 'dead', date: '2024-07-20T10:00:00.000Z' }
    ]
  },
  {
    id: '1703779200000',
    name: 'Team Chat Pro',
    price: 99.00,
    purchaseDate: '2024-04-18',
    source: 'Direct',
    status: 'active',
    category: 'Communication',
    notes: 'Slack alternative with lifetime deal.',
    rating: 4,
    statusHistory: [
      { status: 'active', date: '2024-04-18T11:15:00.000Z' }
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
      rating: 3,
      refund_date: ''
    })
  }

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
      purchaseDate: format(parseISO(deal.purchaseDate), 'yyyy-MM-dd'),
      refund_date: deal.refund_date ? format(parseISO(deal.refund_date), 'yyyy-MM-dd') : ''
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
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {tab.icon === 'Package' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
                {tab.icon === 'BarChart3' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
              </svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

<motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
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
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="dead">Dead</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-800 dark:border-surface-600 dark:text-white"
                >
                  <option value="purchaseDate">Date</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>

{/* Deals List */}
            <div className="space-y-4">
              {filteredDeals.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-surface-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-surface-600 dark:text-surface-400">No deals found</p>
                </div>
              ) : (
                filteredDeals.map((deal, index) => (
                  <Link 
                    key={deal.id}
                    to={`/deal/${deal.id}`}
                    className="block hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <motion.div
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
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="font-semibold text-lg text-surface-900 dark:text-white">
                                ${deal.price}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{format(parseISO(deal.purchaseDate), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>{deal.source}</span>
                            </div>
                            {deal.category && (
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span>{deal.category}</span>
                              </div>
                            )}
                            {deal.refund_date && (
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                <span>Refunded: {format(parseISO(deal.refund_date), 'MMM dd, yyyy')}</span>
                              </div>
                            )}
                          </div>

                          {deal.notes && (
                            <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">
                              {deal.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2" onClick={(e) => e.preventDefault()}>
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(deal);
                            }}
                            className="p-2 text-surface-600 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(deal.id);
                            }}
                            className="p-2 text-surface-600 hover:text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
</div>
                      </div>
                    </motion.div>
                  </Link>
                ))
))
              )}
            </div>
          </motion.div>
        )}
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
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

<div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Dead Deals</p>
                    <p className="text-2xl font-bold text-danger">{analytics.deadDeals}</p>
                  </div>
                  <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

<div className="metric-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Refunded</p>
                    <p className="text-2xl font-bold text-warning">{analytics.refundedDeals}</p>
                  </div>
                  <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
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
                  <svg className="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                        <svg className="w-5 h-5 fill-current" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
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