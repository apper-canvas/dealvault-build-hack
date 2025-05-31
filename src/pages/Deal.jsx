import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Package, 
  RotateCcw,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const Deal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    purchase_date: '',
    amount: '',
    source: '',
    status: 'active',
    category: '',
    refund_date: ''
  })

// Sample deals data - in a real app, this would come from a data store or API
  const sampleDeals = [
    {
      id: "1",
      name: "AppSumo - Lifetime Deal Pack",
      purchase_date: "2024-01-15",
      amount: 79,
      source: "AppSumo",
      status: "active",
      category: "Software Tools"
    },
    {
      id: "2",
      name: "PitchGround - Marketing Suite",
      purchase_date: "2024-02-08",
      amount: 59,
      source: "PitchGround",
      status: "dead",
      category: "Marketing"
    },
    {
      id: "3",
      name: "DealMirror - Design Package",
      purchase_date: "2024-01-22",
      amount: 99,
      source: "DealMirror",
      status: "refunded",
      category: "Design",
      refund_date: "2024-02-15"
    },
    {
      id: "4",
      name: "SaaS Mantra - Analytics Pro",
      purchase_date: "2024-03-01",
      amount: 129,
      source: "SaaS Mantra",
      status: "active",
      category: "Analytics"
    },
    {
      id: "5",
      name: "Stellar Deals - Email Tool",
      purchase_date: "2024-02-14",
      amount: 39,
      source: "Stellar Deals",
      status: "active",
      category: "Email Marketing"
    }
  ]

  useEffect(() => {
    // Simulate loading and finding the deal
    const timer = setTimeout(() => {
      const foundDeal = sampleDeals.find(d => d.id === id)
      setDeal(foundDeal)
      if (foundDeal) {
        setFormData({
          name: foundDeal.name,
          purchase_date: foundDeal.purchase_date,
          amount: foundDeal.amount.toString(),
          source: foundDeal.source,
          status: foundDeal.status,
          category: foundDeal.category || '',
          refund_date: foundDeal.refund_date || ''
        })
      }
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [id])

  const handleEditSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.purchase_date || !formData.amount || !formData.source) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.status === 'refunded' && !formData.refund_date) {
      toast.error('Refund date is required for refunded deals')
      return
    }

    // Update the deal
    const updatedDeal = {
      ...deal,
      name: formData.name.trim(),
      purchase_date: formData.purchase_date,
      amount: parseFloat(formData.amount),
      source: formData.source,
      status: formData.status,
      category: formData.category.trim(),
      refund_date: formData.status === 'refunded' ? formData.refund_date : ''
    }

    setDeal(updatedDeal)
    setShowEditModal(false)
    toast.success('Deal updated successfully!')
  }

  const handleDelete = () => {
    setShowDeleteModal(false)
    toast.success('Deal deleted successfully!')
    navigate('/')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'dead': return <XCircle className="w-5 h-5 text-red-600" />
      case 'refunded': return <RotateCcw className="w-5 h-5 text-orange-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'dead': return 'bg-red-100 text-red-800 border-red-200'
      case 'refunded': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Not Found</h1>
          <p className="text-gray-600 mb-6">The deal you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300 mr-4"></div>
            <h1 className="text-3xl font-bold text-gray-900">Deal Details</h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Deal Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Deal Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{deal.name}</h2>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center px-3 py-1 rounded-full border ${getStatusColor(deal.status)}`}>
                    {getStatusIcon(deal.status)}
                    <span className="ml-2 text-sm font-medium capitalize">{deal.status}</span>
                  </div>
                  {deal.category && (
                    <div className="flex items-center text-gray-600">
                      <Tag className="w-4 h-4 mr-1" />
                      <span className="text-sm">{deal.category}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">${deal.amount}</div>
                <div className="text-sm text-gray-600">Total Investment</div>
              </div>
            </div>
          </div>

          {/* Deal Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Purchase Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h3>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Purchase Date</div>
                    <div className="font-medium text-gray-900">
                      {new Date(deal.purchase_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Source</div>
                    <div className="font-medium text-gray-900">{deal.source}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Amount Paid</div>
                    <div className="font-medium text-gray-900">${deal.amount}</div>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
                
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Current Status</div>
                    <div className="font-medium text-gray-900 capitalize">{deal.status}</div>
                  </div>
                </div>

                {deal.status === 'refunded' && deal.refund_date && (
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Refund Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(deal.refund_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Days Since Purchase</div>
                    <div className="font-medium text-gray-900">
                      {Math.floor((new Date() - new Date(deal.purchase_date)) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Deal</h3>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter deal name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source *
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., AppSumo, PitchGround"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="dead">Dead</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Tools, Marketing"
                  />
                </div>

                {formData.status === 'refunded' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refund Date *
                    </label>
                    <input
                      type="date"
                      value={formData.refund_date}
                      onChange={(e) => setFormData({ ...formData, refund_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Deal</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "{deal.name}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Deal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deal