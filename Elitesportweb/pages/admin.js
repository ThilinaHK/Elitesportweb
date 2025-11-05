import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Toast, { showToast } from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'
import DietPlanManager from '../components/DietPlanManager'
import AttendanceTab from '../components/AttendanceTab'

export default function Admin() {
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [classes, setClasses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('members')
  const [showClassForm, setShowClassForm] = useState(false)
  const [showInstructorForm, setShowInstructorForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [editingInstructor, setEditingInstructor] = useState(null)
  const [payments, setPayments] = useState([])
  const [salaries, setSalaries] = useState([])
  const [paymentForm, setPaymentForm] = useState({
    memberId: '',
    memberName: '',
    classId: '',
    className: '',
    paymentType: 'monthly',
    amount: 0,
    paymentMethod: 'cash',
    paymentMonth: new Date().toISOString().slice(0, 7),
    notes: ''
  })
  const [salaryForm, setSalaryForm] = useState({
    instructorId: '',
    instructorName: '',
    month: new Date().toISOString().slice(0, 7),
    baseSalary: 0,
    bonuses: 0,
    deductions: 0,
    notes: ''
  })
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [paymentMonthFilter, setPaymentMonthFilter] = useState('all')
  const [reminders, setReminders] = useState([])
  const [paymentStatus, setPaymentStatus] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [editingPayment, setEditingPayment] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [editingSalary, setEditingSalary] = useState(null)
  const [showSalaryForm, setShowSalaryForm] = useState(false)
  const [salaryFilter, setSalaryFilter] = useState('all')
  const [posts, setPosts] = useState([])
  const [pendingPosts, setPendingPosts] = useState([])
  const [postHistory, setPostHistory] = useState([])
  const [pendingPlans, setPendingPlans] = useState({ dietPlans: [], exercisePlans: [] })
  const [attendanceData, setAttendanceData] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'general',
    type: 'normal'
  })
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    featuredImage: '',
    tags: [''],
    isPublished: true
  })
  const [editingArticle, setEditingArticle] = useState(null)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [quoteForm, setQuoteForm] = useState({
    text: '',
    author: '',
    position: '',
    category: 'motivation',
    isActive: true
  })
  const [editingQuote, setEditingQuote] = useState(null)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    classId: '',
    className: ''
  })
  const [showNotificationForm, setShowNotificationForm] = useState(false)
  const [diets, setDiets] = useState([])
  const [exercises, setExercises] = useState([])
  const [exerciseForm, setExerciseForm] = useState({
    memberId: '',
    memberName: '',
    planName: '',
    description: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '', rest: '' }],
    duration: '',
    difficulty: 'beginner',
    notes: ''
  })
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [editingExercise, setEditingExercise] = useState(null)
  const [dietForm, setDietForm] = useState({
    memberId: '',
    memberName: '',
    planName: '',
    description: '',
    meals: [{ name: '', time: '', foods: [''] }],
    calories: 0,
    duration: '',
    notes: ''
  })
  const [showDietForm, setShowDietForm] = useState(false)
  const [editingDiet, setEditingDiet] = useState(null)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    dateOfBirth: '',
    gender: 'male',
    weight: '',
    height: '',
    emergencyContact: '',
    medicalConditions: '',
    profilePicture: '',
    membershipType: 'trial',
    assignedClasses: []
  })
  const [editingMember, setEditingMember] = useState(null)
  const [rules, setRules] = useState({
    doorAccess: {
      requirePayment: true,
      gracePeriodDays: 3,
      allowPartialPayment: false,
      qrExpiryHours: 1,
      maxDailyEntries: 5
    },
    paymentReminders: {
      firstReminderDays: 7,
      secondReminderDays: 3,
      finalReminderDays: 1,
      suspensionAfterDays: 5,
      autoSmsEnabled: true,
      autoEmailEnabled: true
    }
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [memberFilter, setMemberFilter] = useState('all')
  const [memberSearch, setMemberSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [classSearch, setClassSearch] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [instructorSearch, setInstructorSearch] = useState('')
  const [paymentSearch, setPaymentSearch] = useState('')
  const [postFilter, setPostFilter] = useState('all')
  const [postSearch, setPostSearch] = useState('')
  const [articleFilter, setArticleFilter] = useState('all')
  const [articleSearch, setArticleSearch] = useState('')
  const [dietFilter, setDietFilter] = useState('all')
  const [dietSearch, setDietSearch] = useState('')
  const [editingBooking, setEditingBooking] = useState(null)
  const [showBookingEditModal, setShowBookingEditModal] = useState(false)
  const [bookingEditForm, setBookingEditForm] = useState({
    memberName: '',
    memberEmail: '',
    memberPhone: '',
    status: 'pending'
  })
  const [smsConfig, setSmsConfig] = useState({
    twilio: {
      accountSid: '',
      authToken: '',
      fromNumber: ''
    },
    local: {
      apiUrl: '',
      apiKey: '',
      senderId: ''
    },
    templates: {
      paymentReminder: 'Hi {memberName}, your {className} payment of LKR {amount} is due for {month}. Please pay to continue classes. - Elite Sports Academy',
      welcomeMessage: 'Welcome to Elite Sports Academy {memberName}! Your membership is confirmed. Contact us: +94771095334'
    }
  })
  const [contactInfo, setContactInfo] = useState({
    title: 'Transform Your Limits',
    description: 'Your premier destination for CrossFit, Karate, and Zumba training. Join our community and transform your fitness journey.',
    address: '162/2/1 Colombo - Batticaloa Hwy, Avissawella',
    phone: '(+94) 77 109 5334',
    email: 'EliteSportsAcademy@gmail.com',
    website: 'www.elitesportsacademy.lk',
    socialMedia: {
      facebook: 'https://facebook.com/elitesportsacademy',
      instagram: 'https://instagram.com/elitesportsacademy',
      youtube: 'https://youtube.com/@elitesportsacademy'
    },
    businessHours: {
      weekdays: '6:00 AM - 10:00 PM',
      weekends: '7:00 AM - 9:00 PM'
    },
    mapLocation: {
      latitude: 6.9537892,
      longitude: 80.2015719,
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8977!2d80.2015719!3d6.9537892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3a97a9266e939%3A0x447841913a8b1b0e!2sElite%20Sports%20Academy!5e0!3m2!1sen!2slk!4v1234567890'
    }
  })
  const [classForm, setClassForm] = useState({
    name: '',
    category: 'crossfit',
    instructor: '',
    days: ['Monday'],
    time: '',
    duration: 60,
    capacity: 20,
    description: '',
    isOnline: false,
    meetingLink: '',
    admissionFee: 0,
    fees: {
      monthly: 0,
      sixMonthly: 0,
      annually: 0
    }
  })
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: ['crossfit'],
    qualifications: [''],
    experience: 1,
    position: 'instructor',
    salary: 50000,
    bio: '',
    image: '',
    assignedClasses: []
  })

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin-login')
      return
    }
    fetchMembers()
    fetchClasses()
    fetchInstructors()
    fetchPayments()
    fetchSalaries()
    fetchReminders()
    fetchPaymentStatus()
    fetchPosts()
    fetchPendingPosts()
    fetchPostHistory()
    fetchPendingPlans()
    fetchBookings()
    fetchNotifications()
    fetchDiets()
    fetchExercises()
    fetchQuotes()
    fetchRules()
    fetchContactInfo()
    fetchSmsConfig()
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      fetchPaymentStatus(selectedMonth)
    }
  }, [selectedMonth])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      const data = await response.json()
      setInstructors(data)
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  const fetchSalaries = async () => {
    try {
      const response = await fetch('/api/salaries')
      const data = await response.json()
      setSalaries(data)
    } catch (error) {
      console.error('Error fetching salaries:', error)
    }
  }

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders')
      const data = await response.json()
      setReminders(data)
    } catch (error) {
      console.error('Error fetching reminders:', error)
    }
  }

  const generateReminders = async () => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      })
      const data = await response.json()
      showToast(`Generated ${data.count} payment reminders`, 'success')
      fetchReminders()
    } catch (error) {
      console.error('Error generating reminders:', error)
    }
  }

  const fetchPaymentStatus = async (month = selectedMonth) => {
    try {
      const response = await fetch(`/api/payments/status?month=${month}`)
      const data = await response.json()
      setPaymentStatus(data)
    } catch (error) {
      console.error('Error fetching payment status:', error)
    }
  }

  const sendReminder = async (reminderId, method) => {
    try {
      const response = await fetch('/api/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderId, method })
      })
      const data = await response.json()
      showToast(data.message, 'success')
      fetchReminders()
    } catch (error) {
      console.error('Error sending reminder:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchPendingPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts/pending')
      const data = await response.json()
      setPendingPosts(data)
    } catch (error) {
      console.error('Error fetching pending posts:', error)
    }
  }

  const fetchPostHistory = async () => {
    try {
      const response = await fetch('/api/admin/posts/history')
      const data = await response.json()
      setPostHistory(data)
    } catch (error) {
      console.error('Error fetching post history:', error)
    }
  }

  const handlePostApproval = async (postId, action, rejectionReason = '') => {
    try {
      const response = await fetch('/api/admin/posts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action, rejectionReason })
      })
      if (response.ok) {
        fetchPendingPosts()
        fetchPosts()
        fetchPostHistory()
        showToast(`Post ${action} successfully`, 'success')
      }
    } catch (error) {
      console.error('Error updating post approval:', error)
      showToast('Error updating post approval', 'error')
    }
  }

  const fetchPendingPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans/pending')
      const data = await response.json()
      setPendingPlans(data)
    } catch (error) {
      console.error('Error fetching pending plans:', error)
    }
  }

  const handlePlanApproval = async (planId, planType, action, rejectionReason = '') => {
    try {
      const response = await fetch('/api/admin/plans/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, planType, action, rejectionReason })
      })
      if (response.ok) {
        fetchPendingPlans()
        showToast(`${planType} plan ${action} successfully`, 'success')
      }
    } catch (error) {
      console.error('Error updating plan approval:', error)
      showToast('Error updating plan approval', 'error')
    }
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingPost ? `/api/posts/${editingPost._id}` : '/api/posts'
      const method = editingPost ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm)
      })
      if (response.ok) {
        fetchPosts()
        setShowPostForm(false)
        setEditingPost(null)
        setPostForm({ title: '', description: '', youtubeUrl: '', category: 'general' })
      }
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const editPost = (post) => {
    setEditingPost(post)
    setPostForm({
      title: post.title || '',
      description: post.description || '',
      youtubeUrl: post.youtubeUrl || '',
      category: post.category || 'general'
    })
    setShowPostForm(true)
  }

  const deletePost = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`/api/posts/${id}`, { method: 'DELETE' })
        fetchPosts()
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const handleArticleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingArticle ? `/api/posts/${editingArticle._id}` : '/api/posts'
      const method = editingArticle ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...articleForm, type: 'article', tags: articleForm.tags.filter(t => t.trim() !== '')})
      })
      if (response.ok) {
        fetchPosts()
        setShowArticleForm(false)
        setEditingArticle(null)
        setArticleForm({
          title: '',
          content: '',
          excerpt: '',
          category: 'general',
          featuredImage: '',
          tags: [''],
          isPublished: true
        })
        showToast(editingArticle ? 'Article updated successfully!' : 'Article created successfully!', 'success')
      }
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  const editArticle = (article) => {
    setEditingArticle(article)
    setArticleForm({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category || 'general',
      featuredImage: article.featuredImage || '',
      tags: article.tags || [''],
      isPublished: article.isPublished !== false
    })
    setShowArticleForm(true)
  }

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes')
      const data = await response.json()
      setQuotes(data)
    } catch (error) {
      console.error('Error fetching quotes:', error)
    }
  }

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rules')
      const data = await response.json()
      setRules(data)
    } catch (error) {
      console.error('Error fetching rules:', error)
    }
  }

  const getFilteredMembers = () => {
    let filteredMembers = members
    
    if (memberFilter && memberFilter !== 'all') {
      if (memberFilter === 'active') {
        filteredMembers = filteredMembers.filter(m => m.status === 'active')
      } else if (memberFilter === 'inactive') {
        filteredMembers = filteredMembers.filter(m => m.status !== 'active')
      } else {
        filteredMembers = filteredMembers.filter(m => m.membershipType === memberFilter)
      }
    }
    
    if (memberSearch) {
      const searchTerm = memberSearch.toLowerCase()
      filteredMembers = filteredMembers.filter(m => 
        (m.fullName || m.name || '').toLowerCase().includes(searchTerm) ||
        (m.email || '').toLowerCase().includes(searchTerm) ||
        (m.memberId || '').toLowerCase().includes(searchTerm)
      )
    }
    
    return filteredMembers
  }

  const getFilteredClasses = () => {
    let filteredClasses = classes
    
    if (classFilter !== 'all') {
      filteredClasses = filteredClasses.filter(c => c.category === classFilter)
    }
    
    if (classSearch) {
      const searchTerm = classSearch.toLowerCase()
      filteredClasses = filteredClasses.filter(c => 
        (c.name || '').toLowerCase().includes(searchTerm) ||
        (c.instructor || '').toLowerCase().includes(searchTerm) ||
        (c.days ? c.days.join(' ').toLowerCase().includes(searchTerm) : (c.day || '').toLowerCase().includes(searchTerm))
      )
    }
    
    return filteredClasses
  }

  const getFilteredInstructors = () => {
    let filteredInstructors = instructors
    
    if (instructorFilter && instructorFilter !== 'all') {
      if (['crossfit', 'karate', 'zumba'].includes(instructorFilter)) {
        filteredInstructors = filteredInstructors.filter(i => i.specialization.includes(instructorFilter))
      } else {
        filteredInstructors = filteredInstructors.filter(i => i.position === instructorFilter)
      }
    }
    
    if (instructorSearch) {
      const searchTerm = instructorSearch.toLowerCase()
      filteredInstructors = filteredInstructors.filter(i => 
        (i.name || '').toLowerCase().includes(searchTerm) ||
        (i.email || '').toLowerCase().includes(searchTerm) ||
        (i.phone || '').toLowerCase().includes(searchTerm) ||
        (i.instructorId || '').toLowerCase().includes(searchTerm)
      )
    }
    
    return filteredInstructors
  }

  const getFilteredPosts = () => {
    let filteredPosts = posts.filter(post => post.type !== 'article')
    
    if (postFilter !== 'all') {
      if (['crossfit', 'karate', 'zumba', 'general'].includes(postFilter)) {
        filteredPosts = filteredPosts.filter(p => p.category === postFilter)
      } else {
        filteredPosts = filteredPosts.filter(p => p.type === postFilter)
      }
    }
    
    if (postSearch) {
      const searchTerm = postSearch.toLowerCase()
      filteredPosts = filteredPosts.filter(p => 
        (p.title || '').toLowerCase().includes(searchTerm) ||
        (p.description || '').toLowerCase().includes(searchTerm) ||
        (p.category || '').toLowerCase().includes(searchTerm)
      )
    }
    
    return filteredPosts
  }

  const getFilteredArticles = () => {
    let filteredArticles = posts.filter(post => post.type === 'article')
    
    if (articleFilter !== 'all') {
      if (articleFilter === 'published') {
        filteredArticles = filteredArticles.filter(a => a.isPublished)
      } else if (articleFilter === 'draft') {
        filteredArticles = filteredArticles.filter(a => !a.isPublished)
      } else {
        filteredArticles = filteredArticles.filter(a => a.category === articleFilter)
      }
    }
    
    if (articleSearch) {
      const searchTerm = articleSearch.toLowerCase()
      filteredArticles = filteredArticles.filter(a => 
        (a.title || '').toLowerCase().includes(searchTerm) ||
        (a.content || '').toLowerCase().includes(searchTerm) ||
        (a.category || '').toLowerCase().includes(searchTerm) ||
        (a.tags || []).some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    return filteredArticles
  }

  const getFilteredDiets = () => {
    let filteredDiets = diets
    
    if (dietFilter !== 'all') {
      if (['1 week', '2 weeks', '1 month', '3 months', '6 months'].includes(dietFilter)) {
        filteredDiets = filteredDiets.filter(d => d.duration === dietFilter)
      } else {
        // Filter by member
        filteredDiets = filteredDiets.filter(d => d.memberId === dietFilter)
      }
    }
    
    if (dietSearch) {
      const searchTerm = dietSearch.toLowerCase()
      filteredDiets = filteredDiets.filter(d => 
        (d.memberName || '').toLowerCase().includes(searchTerm) ||
        (d.planName || '').toLowerCase().includes(searchTerm) ||
        (d.description || '').toLowerCase().includes(searchTerm) ||
        (d.duration || '').toLowerCase().includes(searchTerm)
      )
    }
    
    return filteredDiets
  }

  const getFilteredPayments = () => {
    let filteredPayments = payments
    
    // Filter by class
    if (paymentFilter !== 'all') {
      filteredPayments = filteredPayments.filter(p => p.classId === paymentFilter)
    }
    
    // Filter by status
    if (paymentStatusFilter !== 'all') {
      filteredPayments = filteredPayments.filter(p => (p.status || 'paid') === paymentStatusFilter)
    }
    
    // Filter by month
    if (paymentMonthFilter !== 'all') {
      filteredPayments = filteredPayments.filter(p => p.paymentMonth === paymentMonthFilter)
    }
    
    // Search filter
    if (paymentSearch) {
      const searchTerm = paymentSearch.toLowerCase()
      filteredPayments = filteredPayments.filter(p => 
        (p.memberName || '').toLowerCase().includes(searchTerm) ||
        (p.className || '').toLowerCase().includes(searchTerm) ||
        (p.paymentType || '').toLowerCase().includes(searchTerm) ||
        (p.paymentMethod || '').toLowerCase().includes(searchTerm) ||
        (p.memberId || '').toLowerCase().includes(searchTerm)
      )
    }
    
    return filteredPayments
  }

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info')
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }

  const fetchSmsConfig = async () => {
    try {
      const response = await fetch('/api/sms-config')
      if (response.ok) {
        const data = await response.json()
        if (data.twilio || data.local || data.templates) {
          setSmsConfig(prev => ({ ...prev, ...data }))
        }
      }
    } catch (error) {
      console.error('Error fetching SMS config:', error)
    }
  }

  const saveSmsConfig = async (provider, config) => {
    try {
      const response = await fetch('/api/sms-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, config })
      })
      if (response.ok) {
        showToast(`${provider} SMS configuration saved successfully`, 'success')
        fetchSmsConfig()
      } else {
        showToast('Failed to save SMS configuration', 'error')
      }
    } catch (error) {
      console.error('Error saving SMS config:', error)
      showToast('Error saving SMS configuration', 'error')
    }
  }

  const saveContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      })
      if (response.ok) {
        showToast('Contact information updated successfully', 'success')
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      showToast('Error saving contact information', 'error')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error')
      return
    }
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm)
      })
      
      const data = await response.json()
      if (response.ok) {
        showToast('Password updated successfully', 'success')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        showToast(data.message || 'Failed to update password', 'error')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      showToast('Error updating password', 'error')
    }
  }

  const saveRules = async () => {
    try {
      const response = await fetch('/api/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rules)
      })
      if (response.ok) {
        showToast('Rules updated successfully', 'success')
      }
    } catch (error) {
      console.error('Error saving rules:', error)
    }
  }

  const updateRule = (category, key, value) => {
    setRules(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  function RulesTab() {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>System Rules</h3>
          <button 
            onClick={saveRules}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Save Rules
          </button>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h5 style={{ color: '#333', marginBottom: '15px' }}><i className="fas fa-door-open"></i> Door Access Rules</h5>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={rules.doorAccess.requirePayment}
                    onChange={(e) => updateRule('doorAccess', 'requirePayment', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  Require Payment for Access
                </label>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Grace Period (Days):</label>
                <input 
                  type="number" 
                  value={rules.doorAccess.gracePeriodDays}
                  onChange={(e) => updateRule('doorAccess', 'gracePeriodDays', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={rules.doorAccess.allowPartialPayment}
                    onChange={(e) => updateRule('doorAccess', 'allowPartialPayment', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  Allow Partial Payment Access
                </label>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>QR Code Expiry (Hours):</label>
                <input 
                  type="number" 
                  value={rules.doorAccess.qrExpiryHours}
                  onChange={(e) => updateRule('doorAccess', 'qrExpiryHours', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Max Daily Entries:</label>
                <input 
                  type="number" 
                  value={rules.doorAccess.maxDailyEntries}
                  onChange={(e) => updateRule('doorAccess', 'maxDailyEntries', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h5 style={{ color: '#333', marginBottom: '15px' }}><i className="fas fa-bell"></i> Payment Reminder Rules</h5>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>First Reminder (Days Before Due):</label>
                <input 
                  type="number" 
                  value={rules.paymentReminders.firstReminderDays}
                  onChange={(e) => updateRule('paymentReminders', 'firstReminderDays', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Second Reminder (Days Before Due):</label>
                <input 
                  type="number" 
                  value={rules.paymentReminders.secondReminderDays}
                  onChange={(e) => updateRule('paymentReminders', 'secondReminderDays', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Final Reminder (Days Before Due):</label>
                <input 
                  type="number" 
                  value={rules.paymentReminders.finalReminderDays}
                  onChange={(e) => updateRule('paymentReminders', 'finalReminderDays', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Suspension After (Days Overdue):</label>
                <input 
                  type="number" 
                  value={rules.paymentReminders.suspensionAfterDays}
                  onChange={(e) => updateRule('paymentReminders', 'suspensionAfterDays', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={rules.paymentReminders.autoSmsEnabled}
                    onChange={(e) => updateRule('paymentReminders', 'autoSmsEnabled', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  Auto SMS Reminders
                </label>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={rules.paymentReminders.autoEmailEnabled}
                    onChange={(e) => updateRule('paymentReminders', 'autoEmailEnabled', e.target.checked)}
                    style={{ marginRight: '10px' }}
                  />
                  Auto Email Reminders
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingQuote ? `/api/quotes/${editingQuote._id}` : '/api/quotes'
      const method = editingQuote ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm)
      })
      if (response.ok) {
        fetchQuotes()
        setShowQuoteForm(false)
        setEditingQuote(null)
        setQuoteForm({ text: '', author: '', position: '', category: 'motivation', isActive: true })
      }
    } catch (error) {
      console.error('Error saving quote:', error)
    }
  }

  const editQuote = (quote) => {
    setEditingQuote(quote)
    setQuoteForm({
      text: quote.text || '',
      author: quote.author || '',
      position: quote.position || '',
      category: quote.category || 'motivation',
      isActive: quote.isActive !== false
    })
    setShowQuoteForm(true)
  }

  const deleteQuote = async (id) => {
    if (confirm('Are you sure you want to delete this quote?')) {
      try {
        await fetch(`/api/quotes/${id}`, { method: 'DELETE' })
        fetchQuotes()
      } catch (error) {
        console.error('Error deleting quote:', error)
      }
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchDiets = async () => {
    try {
      const response = await fetch('/api/diets')
      const data = await response.json()
      setDiets(data)
    } catch (error) {
      console.error('Error fetching diets:', error)
    }
  }

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      const data = await response.json()
      setExercises(data)
    } catch (error) {
      console.error('Error fetching exercises:', error)
    }
  }

  const handleDietSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingDiet ? `/api/diets/${editingDiet._id}` : '/api/diets'
      const method = editingDiet ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dietForm)
      })
      if (response.ok) {
        fetchDiets()
        setShowDietForm(false)
        setEditingDiet(null)
        setDietForm({
          memberId: '',
          memberName: '',
          planName: '',
          description: '',
          meals: [{ name: '', time: '', foods: [''] }],
          calories: 0,
          duration: '',
          notes: ''
        })
        showToast(editingDiet ? 'Diet plan updated successfully!' : 'Diet plan assigned successfully!', 'success')
      }
    } catch (error) {
      console.error('Error saving diet plan:', error)
    }
  }

  const editDiet = (diet) => {
    setEditingDiet(diet)
    setDietForm({
      memberId: diet.memberId || '',
      memberName: diet.memberName || '',
      planName: diet.planName || '',
      description: diet.description || '',
      meals: diet.meals || [{ name: '', time: '', foods: [''] }],
      calories: diet.calories || 0,
      duration: diet.duration || '',
      notes: diet.notes || ''
    })
    setShowDietForm(true)
  }

  const deleteDiet = async (id) => {
    if (confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await fetch(`/api/diets/${id}`, { method: 'DELETE' })
        fetchDiets()
      } catch (error) {
        console.error('Error deleting diet plan:', error)
      }
    }
  }

  const handleNotificationSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationForm)
      })
      if (response.ok) {
        fetchNotifications()
        setShowNotificationForm(false)
        setNotificationForm({ title: '', message: '', classId: '', className: '' })
        showToast('Notification sent to all members in the selected class!', 'success')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const deleteMember = async (id) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await fetch(`/api/members/${id}`, { method: 'DELETE' })
        fetchMembers()
      } catch (error) {
        console.error('Error deleting member:', error)
      }
    }
  }

  const deleteClass = async (id) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await fetch(`/api/classes/${id}`, { method: 'DELETE' })
        fetchClasses()
      } catch (error) {
        console.error('Error deleting class:', error)
      }
    }
  }

  const handleClassSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingClass ? `/api/classes/${editingClass._id}` : '/api/classes'
      const method = editingClass ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classForm)
      })
      if (response.ok) {
        fetchClasses()
        setShowClassForm(false)
        setEditingClass(null)
        setClassForm({
          name: '',
          category: 'crossfit',
          instructor: '',
          days: ['Monday'],
          time: '',
          duration: 60,
          capacity: 20,
          description: '',
          isOnline: false,
          meetingLink: '',
          admissionFee: 0,
          fees: {
            monthly: 0,
            sixMonthly: 0,
            annually: 0
          }
        })
      }
    } catch (error) {
      console.error('Error saving class:', error)
    }
  }

  const editClass = (cls) => {
    setEditingClass(cls)
    setClassForm({
      name: cls.name || '',
      category: cls.category || 'crossfit',
      instructor: cls.instructor || '',
      days: cls.days || (cls.day ? [cls.day] : ['Monday']),
      time: cls.time || '',
      duration: cls.duration || 60,
      capacity: cls.capacity || 20,
      description: cls.description || '',
      isOnline: cls.isOnline || false,
      meetingLink: cls.meetingLink || '',
      admissionFee: cls.admissionFee || 0,
      fees: {
        monthly: cls.fees?.monthly || 0,
        sixMonthly: cls.fees?.sixMonthly || 0,
        annually: cls.fees?.annually || 0
      }
    })
    setShowClassForm(true)
  }

  const deleteInstructor = async (id) => {
    if (confirm('Are you sure you want to delete this instructor?')) {
      try {
        await fetch(`/api/instructors/${id}`, { method: 'DELETE' })
        fetchInstructors()
      } catch (error) {
        console.error('Error deleting instructor:', error)
      }
    }
  }

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingMember ? `/api/members/${editingMember._id}` : '/api/members'
      const method = editingMember ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm)
      })
      const data = await response.json()
      if (response.ok) {
        fetchMembers()
        setShowMemberForm(false)
        setEditingMember(null)
        setMemberForm({
          fullName: '',
          email: '',
          phone: '',
          nic: '',
          address: '',
          dateOfBirth: '',
          gender: 'male',
          weight: '',
          height: '',
          emergencyContact: '',
          medicalConditions: '',
          profilePicture: '',
          membershipType: 'trial',
          assignedClasses: []
        })
        showToast(editingMember ? 'Member updated successfully!' : 'Member added successfully!', 'success')
      } else {
        showToast(data.error || 'Error saving member', 'error')
      }
    } catch (error) {
      console.error('Error saving member:', error)
      showToast('Error saving member', 'error')
    }
  }

  const editMember = (member) => {
    setEditingMember(member)
    setMemberForm({
      fullName: member.fullName || member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      nic: member.nic || '',
      address: member.address || '',
      dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '',
      gender: member.gender || 'male',
      weight: member.weight || '',
      height: member.height || '',
      emergencyContact: member.emergencyContact || '',
      medicalConditions: member.medicalConditions || '',
      profilePicture: member.profilePicture || '',
      membershipType: member.membershipType || 'trial',
      assignedClasses: member.assignedClasses || []
    })
    setShowMemberForm(true)
  }

  const handleInstructorSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingInstructor ? `/api/instructors/${editingInstructor._id}` : '/api/instructors'
      const method = editingInstructor ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...instructorForm,
          qualifications: instructorForm.qualifications.filter(q => q.trim() !== ''),
          assignedClasses: instructorForm.assignedClasses || []
        })
      })
      if (response.ok) {
        fetchInstructors()
        setShowInstructorForm(false)
        setEditingInstructor(null)
        setInstructorForm({
          name: '',
          email: '',
          phone: '',
          specialization: ['crossfit'],
          qualifications: [''],
          experience: 1,
          position: 'instructor',
          salary: 50000,
          bio: '',
          image: '',
          assignedClasses: []
        })
        showToast(editingInstructor ? 'Instructor updated successfully!' : 'Instructor created successfully!', 'success')
      }
    } catch (error) {
      console.error('Error saving instructor:', error)
      showToast('Error saving instructor', 'error')
    }
  }

  const editInstructor = (instructor) => {
    setEditingInstructor(instructor)
    setInstructorForm({
      name: instructor.name || '',
      email: instructor.email || '',
      phone: instructor.phone || '',
      specialization: instructor.specialization || ['crossfit'],
      qualifications: instructor.qualifications || [''],
      experience: instructor.experience || 1,
      position: instructor.position || 'instructor',
      salary: instructor.salary || 50000,
      bio: instructor.bio || '',
      image: instructor.image || '',
      assignedClasses: instructor.assignedClasses || []
    })
    setShowInstructorForm(true)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingPayment ? `/api/payments/${editingPayment._id}` : '/api/payments'
      const method = editingPayment ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      })
      if (response.ok) {
        fetchPayments()
        fetchPaymentStatus(selectedMonth)
        setShowPaymentForm(false)
        setEditingPayment(null)
        setPaymentForm({
          memberId: '',
          memberName: '',
          classId: '',
          className: '',
          paymentType: 'monthly',
          amount: 0,
          paymentMethod: 'cash',
          paymentMonth: new Date().toISOString().slice(0, 7),
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error saving payment:', error)
    }
  }

  const editPayment = (payment) => {
    setEditingPayment(payment)
    setPaymentForm({
      memberId: payment.memberId || '',
      memberName: payment.memberName || '',
      classId: payment.classId || '',
      className: payment.className || '',
      paymentType: payment.paymentType || 'monthly',
      amount: payment.amount || 0,
      paymentMethod: payment.paymentMethod || 'cash',
      paymentMonth: payment.paymentMonth || new Date().toISOString().slice(0, 7),
      notes: payment.notes || ''
    })
    setShowPaymentForm(true)
  }

  const deletePayment = async (id) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await fetch(`/api/payments/${id}`, { method: 'DELETE' })
        fetchPayments()
        fetchPaymentStatus(selectedMonth)
      } catch (error) {
        console.error('Error deleting payment:', error)
      }
    }
  }

  const handleSalarySubmit = async (e) => {
    e.preventDefault()
    const totalAmount = parseFloat(salaryForm.baseSalary) + parseFloat(salaryForm.bonuses || 0) - parseFloat(salaryForm.deductions || 0)
    try {
      const url = editingSalary ? `/api/salaries/${editingSalary._id}` : '/api/salaries'
      const method = editingSalary ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...salaryForm, totalAmount })
      })
      if (response.ok) {
        fetchSalaries()
        setShowSalaryForm(false)
        setEditingSalary(null)
        setSalaryForm({
          instructorId: '',
          instructorName: '',
          month: new Date().toISOString().slice(0, 7),
          baseSalary: 0,
          bonuses: 0,
          deductions: 0,
          notes: ''
        })
      }
    } catch (error) {
      console.error('Error saving salary:', error)
    }
  }

  const editSalary = (salary) => {
    setEditingSalary(salary)
    setSalaryForm({
      instructorId: salary.instructorId || '',
      instructorName: salary.instructorName || '',
      month: salary.month || new Date().toISOString().slice(0, 7),
      baseSalary: salary.baseSalary || 0,
      bonuses: salary.bonuses || 0,
      deductions: salary.deductions || 0,
      notes: salary.notes || ''
    })
    setShowSalaryForm(true)
  }

  const deleteSalary = async (id) => {
    if (confirm('Are you sure you want to delete this salary record?')) {
      try {
        await fetch(`/api/salaries/${id}`, { method: 'DELETE' })
        fetchSalaries()
      } catch (error) {
        console.error('Error deleting salary:', error)
      }
    }
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <nav style={{ backgroundColor: '#1a1a1a', padding: '15px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: 'white', margin: 0 }}>Elite Sports Academy - Admin Panel</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => router.push('/dashboard')}
                  style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('adminToken')
                    router.push('/admin-login')
                  }}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container" style={{ padding: '20px 0 0 0' }}>
          <div style={{ borderBottom: '1px solid #ddd', marginBottom: '30px' }}>
            <button 
              onClick={() => setActiveTab('members')}
              style={{
                backgroundColor: activeTab === 'members' ? '#f36100' : 'transparent',
                color: activeTab === 'members' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                marginRight: '10px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Members ({members.length})
            </button>
            <button 
              onClick={() => setActiveTab('classes')}
              style={{
                backgroundColor: activeTab === 'classes' ? '#f36100' : 'transparent',
                color: activeTab === 'classes' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Classes ({classes.length})
            </button>
            <button 
              onClick={() => setActiveTab('instructors')}
              style={{
                backgroundColor: activeTab === 'instructors' ? '#f36100' : 'transparent',
                color: activeTab === 'instructors' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Instructors ({instructors.length})
            </button>
            <button 
              onClick={() => setActiveTab('attendance')}
              style={{
                backgroundColor: activeTab === 'attendance' ? '#f36100' : 'transparent',
                color: activeTab === 'attendance' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Attendance
            </button>
            <button 
              onClick={() => setActiveTab('payments')}
              style={{
                backgroundColor: activeTab === 'payments' ? '#f36100' : 'transparent',
                color: activeTab === 'payments' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Payments ({payments.length})
            </button>
            <button 
              onClick={() => setActiveTab('salaries')}
              style={{
                backgroundColor: activeTab === 'salaries' ? '#f36100' : 'transparent',
                color: activeTab === 'salaries' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Salaries ({salaries.length})
            </button>
            <button 
              onClick={() => setActiveTab('sms')}
              style={{
                backgroundColor: activeTab === 'sms' ? '#f36100' : 'transparent',
                color: activeTab === 'sms' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              SMS Gateway
            </button>
            <button 
              onClick={() => setActiveTab('posts')}
              style={{
                backgroundColor: activeTab === 'posts' ? '#f36100' : 'transparent',
                color: activeTab === 'posts' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Video Posts ({posts ? posts.filter(p => p.type !== 'article').length : 0})
            </button>
            <button 
              onClick={() => setActiveTab('post-approval')}
              style={{
                backgroundColor: activeTab === 'post-approval' ? '#f36100' : 'transparent',
                color: activeTab === 'post-approval' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Post Approval
            </button>
            <button 
              onClick={() => setActiveTab('plan-approval')}
              style={{
                backgroundColor: activeTab === 'plan-approval' ? '#f36100' : 'transparent',
                color: activeTab === 'plan-approval' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Plan Approval
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              style={{
                backgroundColor: activeTab === 'articles' ? '#f36100' : 'transparent',
                color: activeTab === 'articles' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Articles ({posts ? posts.filter(p => p.type === 'article').length : 0})
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              style={{
                backgroundColor: activeTab === 'bookings' ? '#f36100' : 'transparent',
                color: activeTab === 'bookings' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Bookings ({bookings ? bookings.length : 0})
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              style={{
                backgroundColor: activeTab === 'notifications' ? '#f36100' : 'transparent',
                color: activeTab === 'notifications' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('diets')}
              style={{
                backgroundColor: activeTab === 'diets' ? '#f36100' : 'transparent',
                color: activeTab === 'diets' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Diet Plans ({diets.length})
            </button>
            <button 
              onClick={() => setActiveTab('exercises')}
              style={{
                backgroundColor: activeTab === 'exercises' ? '#f36100' : 'transparent',
                color: activeTab === 'exercises' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Exercise Plans ({exercises.length})
            </button>
            <button 
              onClick={() => setActiveTab('quotes')}
              style={{
                backgroundColor: activeTab === 'quotes' ? '#f36100' : 'transparent',
                color: activeTab === 'quotes' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Quotes
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              style={{
                backgroundColor: activeTab === 'roles' ? '#f36100' : 'transparent',
                color: activeTab === 'roles' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Instructor Roles
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              style={{
                backgroundColor: activeTab === 'events' ? '#f36100' : 'transparent',
                color: activeTab === 'events' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Events
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              style={{
                backgroundColor: activeTab === 'reports' ? '#f36100' : 'transparent',
                color: activeTab === 'reports' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Reports
            </button>
            <button 
              onClick={() => setActiveTab('rules')}
              style={{
                backgroundColor: activeTab === 'rules' ? '#f36100' : 'transparent',
                color: activeTab === 'rules' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Rules
            </button>
            <button 
              onClick={() => setActiveTab('contact')}
              style={{
                backgroundColor: activeTab === 'contact' ? '#f36100' : 'transparent',
                color: activeTab === 'contact' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Contact Info
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              style={{
                backgroundColor: activeTab === 'password' ? '#f36100' : 'transparent',
                color: activeTab === 'password' ? 'white' : '#333',
                border: 'none',
                padding: '15px 30px',
                cursor: 'pointer',
                borderRadius: '5px 5px 0 0'
              }}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="container" style={{ padding: '0 0 40px 0' }}>
          <div className="row">
            <div className="col-12">
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                
                {activeTab === 'members' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Member Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={memberFilter || 'all'}
                          onChange={(e) => setMemberFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Members ({members.length})</option>
                          <option value="active">Active ({members.filter(m => m.status === 'active').length})</option>
                          <option value="inactive">Inactive ({members.filter(m => m.status !== 'active').length})</option>
                          <option value="trial">Trial ({members.filter(m => m.membershipType === 'trial').length})</option>
                          <option value="monthly">Monthly ({members.filter(m => m.membershipType === 'monthly').length})</option>
                          <option value="yearly">Yearly ({members.filter(m => m.membershipType === 'yearly').length})</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by name, email, or registration #" 
                          value={memberSearch || ''}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowMemberForm(!showMemberForm)
                          setEditingMember(null)
                          setMemberForm({
                            fullName: '',
                            email: '',
                            phone: '',
                            nic: '',
                            address: '',
                            dateOfBirth: '',
                            gender: 'male',
                            weight: '',
                            height: '',
                            emergencyContact: '',
                            medicalConditions: '',
                            profilePicture: '',
                            membershipType: 'trial',
                            assignedClasses: []
                          })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showMemberForm ? 'Cancel' : editingMember ? 'Cancel Edit' : 'Add New Member'}
                      </button>
                    </div>

                    {showMemberForm && (
                      <form onSubmit={handleMemberSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Full Name *</label>
                            <input 
                              type="text" 
                              placeholder="Enter full name" 
                              value={memberForm.fullName}
                              onChange={(e) => setMemberForm({...memberForm, fullName: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Email Address *</label>
                            <input 
                              type="email" 
                              placeholder="Enter email address" 
                              value={memberForm.email}
                              onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Phone Number *</label>
                            <input 
                              type="tel" 
                              placeholder="Enter phone number" 
                              value={memberForm.phone}
                              onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>NIC Number *</label>
                            <input 
                              type="text" 
                              placeholder="Enter NIC number" 
                              value={memberForm.nic}
                              onChange={(e) => setMemberForm({...memberForm, nic: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Address *</label>
                            <textarea 
                              placeholder="Enter address" 
                              value={memberForm.address}
                              onChange={(e) => setMemberForm({...memberForm, address: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Date of Birth *</label>
                            <input 
                              type="date" 
                              value={memberForm.dateOfBirth}
                              onChange={(e) => setMemberForm({...memberForm, dateOfBirth: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Gender *</label>
                            <select 
                              value={memberForm.gender}
                              onChange={(e) => setMemberForm({...memberForm, gender: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Weight (kg) *</label>
                            <input 
                              type="number" 
                              placeholder="Enter weight in kg" 
                              value={memberForm.weight}
                              onChange={(e) => setMemberForm({...memberForm, weight: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Height (cm) *</label>
                            <input 
                              type="number" 
                              placeholder="Enter height in cm" 
                              value={memberForm.height}
                              onChange={(e) => setMemberForm({...memberForm, height: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Emergency Contact *</label>
                            <input 
                              type="tel" 
                              placeholder="Enter emergency contact number" 
                              value={memberForm.emergencyContact}
                              onChange={(e) => setMemberForm({...memberForm, emergencyContact: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Medical Conditions</label>
                            <textarea 
                              placeholder="Enter any medical conditions (optional)" 
                              value={memberForm.medicalConditions}
                              onChange={(e) => setMemberForm({...memberForm, medicalConditions: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '50px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Membership Type *</label>
                            <select 
                              value={memberForm.membershipType}
                              onChange={(e) => setMemberForm({...memberForm, membershipType: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="trial">Trial</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Assign Classes:</label>
                              <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                                {classes.map(cls => (
                                  <label key={cls._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '14px' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={memberForm.assignedClasses.includes(cls._id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setMemberForm({...memberForm, assignedClasses: [...memberForm.assignedClasses, cls._id]})
                                        } else {
                                          setMemberForm({...memberForm, assignedClasses: memberForm.assignedClasses.filter(id => id !== cls._id)})
                                        }
                                      }}
                                      style={{ marginRight: '8px' }}
                                    />
                                    <span>{cls.name} ({cls.days ? cls.days.join(', ') : cls.day} {cls.time})</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Profile Picture:</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (e) => {
                                    setMemberForm({...memberForm, profilePicture: e.target.result})
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                            />
                            {memberForm.profilePicture && (
                              <div style={{ textAlign: 'center' }}>
                                <img 
                                  src={memberForm.profilePicture} 
                                  alt="Preview" 
                                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f36100' }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <button 
                          type="submit"
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          {editingMember ? 'Update Member' : 'Add Member'}
                        </button>
                      </form>
                    )}

                    {loading ? (
                      <LoadingSpinner size="large" text="Loading members..." />
                    ) : (
                      <>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ margin: 0 }}><strong>Showing: {getFilteredMembers().length} / {members.length} Members</strong></p>
                        </div>
                        {getFilteredMembers().length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                            <p>{members.length === 0 ? 'No members registered yet.' : 'No members found matching your search.'}</p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                                <tr>
                                  <th>Registration #</th>
                                  <th>Member</th>
                                  <th>Contact</th>
                                  <th>Physical Info</th>
                                  <th>Membership</th>
                                  <th>Assigned Classes</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getFilteredMembers().map((member) => (
                                  <tr key={member._id}>
                                    <td>
                                      <div style={{fontSize: '12px', fontWeight: '600', color: '#f36100'}}>
                                        {member.memberId || 'N/A'}
                                      </div>
                                      <div style={{fontSize: '10px', color: '#666'}}>
                                        {new Date(member.joinDate).toLocaleDateString()}
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        {member.profilePicture ? (
                                          <img 
                                            src={member.profilePicture} 
                                            alt={member.fullName || member.name}
                                            style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                                          />
                                        ) : (
                                          <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #f36100, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: '600'}}>
                                            {(member.fullName || member.name || '').charAt(0)}
                                          </div>
                                        )}
                                        <div>
                                          <strong>{member.fullName || member.name}</strong>
                                          <div style={{fontSize: '11px', color: '#666'}}>{member.nic}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{fontSize: '12px'}}>{member.email}</div>
                                      <div style={{fontSize: '12px'}}>{member.phone}</div>
                                    </td>
                                    <td>
                                      <div style={{fontSize: '12px'}}>Weight: {member.weight}kg</div>
                                      <div style={{fontSize: '12px'}}>Height: {member.height}cm</div>
                                      <div style={{fontSize: '11px', color: '#666'}}>{member.gender}</div>
                                    </td>
                                    <td>
                                      <span style={{ 
                                        backgroundColor: '#e3f2fd', 
                                        color: '#1976d2', 
                                        padding: '4px 8px', 
                                        borderRadius: '4px',
                                        fontSize: '12px'
                                      }}>
                                        {member.membershipType}
                                      </span>
                                      <div style={{fontSize: '11px', color: member.status === 'active' ? '#2e7d32' : '#c62828', marginTop: '2px'}}>
                                        {member.status}
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ fontSize: '11px' }}>
                                        {member.assignedClasses && member.assignedClasses.length > 0 ? (
                                          member.assignedClasses.slice(0, 2).map(classId => {
                                            const cls = classes.find(c => c._id === classId)
                                            return cls ? (
                                              <div key={classId} style={{ 
                                                backgroundColor: cls.category === 'crossfit' ? '#ff5722' : cls.category === 'karate' ? '#2196f3' : '#9c27b0',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '8px',
                                                marginBottom: '2px',
                                                fontSize: '10px'
                                              }}>
                                                {cls.name}
                                              </div>
                                            ) : null
                                          })
                                        ) : (
                                          <span style={{ color: '#999' }}>No classes</span>
                                        )}
                                        {member.assignedClasses && member.assignedClasses.length > 2 && (
                                          <div style={{ fontSize: '9px', color: '#666' }}>+{member.assignedClasses.length - 2} more</div>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                          onClick={() => editMember(member)}
                                          style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                          }}
                                        >
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => deleteMember(member._id)}
                                          style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {activeTab === 'classes' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Classes Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={classFilter}
                          onChange={(e) => setClassFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Classes ({classes.length})</option>
                          <option value="crossfit">CrossFit ({classes.filter(c => c.category === 'crossfit').length})</option>
                          <option value="karate">Karate ({classes.filter(c => c.category === 'karate').length})</option>
                          <option value="zumba">Zumba ({classes.filter(c => c.category === 'zumba').length})</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by name, instructor, or day" 
                          value={classSearch}
                          onChange={(e) => setClassSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '200px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowClassForm(!showClassForm)
                          setEditingClass(null)
                          setClassForm({
                            name: '',
                            category: 'crossfit',
                            instructor: '',
                            days: ['Monday'],
                            time: '',
                            duration: 60,
                            capacity: 20,
                            description: '',
                            isOnline: false,
                            meetingLink: '',
                            admissionFee: 0,
                            fees: {
                              monthly: 0,
                              sixMonthly: 0,
                              annually: 0
                            }
                          })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showClassForm ? 'Cancel' : editingClass ? 'Cancel Edit' : 'Add New Class'}
                      </button>
                    </div>

                    {showClassForm && (
                      <form onSubmit={handleClassSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Class Name *</label>
                            <input 
                              type="text" 
                              placeholder="Enter class name" 
                              value={classForm.name}
                              onChange={(e) => setClassForm({...classForm, name: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Category *</label>
                            <select 
                              value={classForm.category}
                              onChange={(e) => setClassForm({...classForm, category: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="crossfit">CrossFit</option>
                              <option value="karate">Karate</option>
                              <option value="zumba">Zumba</option>
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Instructor *</label>
                            <select 
                              value={classForm.instructor}
                              onChange={(e) => setClassForm({...classForm, instructor: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="">Select Instructor</option>
                              {instructors.filter(inst => inst.specialization.includes(classForm.category)).map(instructor => (
                                <option key={instructor._id} value={instructor.name}>{instructor.name}</option>
                              ))}
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Days *</label>
                            <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', marginBottom: '15px' }}>
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <label key={day} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '14px' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={classForm.days.includes(day)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setClassForm({...classForm, days: [...classForm.days, day]})
                                      } else {
                                        setClassForm({...classForm, days: classForm.days.filter(d => d !== day)})
                                      }
                                    }}
                                    style={{ marginRight: '8px' }}
                                  />
                                  <span>{day}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Time *</label>
                            <input 
                              type="time" 
                              value={classForm.time}
                              onChange={(e) => setClassForm({...classForm, time: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Duration (minutes) *</label>
                            <input 
                              type="number" 
                              placeholder="Enter duration in minutes" 
                              value={classForm.duration}
                              onChange={(e) => setClassForm({...classForm, duration: parseInt(e.target.value)})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Capacity *</label>
                            <input 
                              type="number" 
                              placeholder="Enter maximum capacity" 
                              value={classForm.capacity}
                              onChange={(e) => setClassForm({...classForm, capacity: parseInt(e.target.value)})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Description</label>
                            <textarea 
                              placeholder="Enter class description (optional)" 
                              value={classForm.description}
                              onChange={(e) => setClassForm({...classForm, description: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Admission Fee (LKR)</label>
                            <input 
                              type="number" 
                              placeholder="Enter admission fee" 
                              value={classForm.admissionFee}
                              onChange={(e) => setClassForm({...classForm, admissionFee: parseFloat(e.target.value) || 0})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                        <div className="row" style={{ marginBottom: '15px' }}>
                          <div className="col-md-4">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Monthly Fee (LKR)</label>
                            <input 
                              type="number" 
                              placeholder="Enter monthly fee" 
                              value={classForm.fees.monthly}
                              onChange={(e) => setClassForm({...classForm, fees: {...classForm.fees, monthly: parseFloat(e.target.value) || 0}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div className="col-md-4">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>6-Monthly Fee (LKR)</label>
                            <input 
                              type="number" 
                              placeholder="Enter 6-monthly fee" 
                              value={classForm.fees.sixMonthly}
                              onChange={(e) => setClassForm({...classForm, fees: {...classForm.fees, sixMonthly: parseFloat(e.target.value) || 0}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div className="col-md-4">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Annual Fee (LKR)</label>
                            <input 
                              type="number" 
                              placeholder="Enter annual fee" 
                              value={classForm.fees.annually}
                              onChange={(e) => setClassForm({...classForm, fees: {...classForm.fees, annually: parseFloat(e.target.value) || 0}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'flex', alignItems: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={classForm.isOnline}
                              onChange={(e) => setClassForm({...classForm, isOnline: e.target.checked})}
                              style={{ marginRight: '10px' }}
                            />
                            Online Class
                          </label>
                        </div>
                        {classForm.isOnline && (
                          <input 
                            type="url" 
                            placeholder="Meeting Link" 
                            value={classForm.meetingLink}
                            onChange={(e) => setClassForm({...classForm, meetingLink: e.target.value})}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        )}
                        <button 
                          type="submit"
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          {editingClass ? 'Update Class' : 'Create Class'}
                        </button>
                      </form>
                    )}

                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ margin: 0 }}><strong>Showing: {getFilteredClasses().length} / {classes.length} Classes</strong></p>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Class Name</th>
                            <th>Category</th>
                            <th>Instructor</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Duration</th>
                            <th>Admission Fee</th>
                            <th>Monthly Fee</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredClasses().map((cls) => (
                            <tr key={cls._id}>
                              <td>{cls.name}</td>
                              <td>
                                <span style={{ 
                                  backgroundColor: cls.category === 'crossfit' ? '#ff5722' : cls.category === 'karate' ? '#2196f3' : '#9c27b0',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {cls.category}
                                </span>
                              </td>
                              <td>{cls.instructor}</td>
                              <td>
                                {cls.days ? (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {cls.days.map(day => (
                                      <span key={day} style={{ 
                                        backgroundColor: '#e3f2fd', 
                                        color: '#1976d2', 
                                        padding: '2px 6px', 
                                        borderRadius: '8px',
                                        fontSize: '11px'
                                      }}>
                                        {day.substring(0, 3)}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  cls.day || 'N/A'
                                )}
                              </td>
                              <td>{cls.time}</td>
                              <td>{cls.duration} mins</td>
                              <td>LKR {cls.admissionFee || 0}</td>
                              <td>LKR {cls.fees?.monthly || 0}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editClass(cls)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteClass(cls._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'instructors' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Instructors Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={instructorFilter}
                          onChange={(e) => setInstructorFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Instructors ({instructors.length})</option>
                          <option value="crossfit">CrossFit ({instructors.filter(i => i.specialization.includes('crossfit')).length})</option>
                          <option value="karate">Karate ({instructors.filter(i => i.specialization.includes('karate')).length})</option>
                          <option value="zumba">Zumba ({instructors.filter(i => i.specialization.includes('zumba')).length})</option>
                          <option value="instructor">Instructor ({instructors.filter(i => i.position === 'instructor').length})</option>
                          <option value="senior_instructor">Senior Instructor ({instructors.filter(i => i.position === 'senior_instructor').length})</option>
                          <option value="chief_instructor">Chief Instructor ({instructors.filter(i => i.position === 'chief_instructor').length})</option>
                          <option value="head_trainer">Head Trainer ({instructors.filter(i => i.position === 'head_trainer').length})</option>
                          <option value="ceo">CEO ({instructors.filter(i => i.position === 'ceo').length})</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by name, email, phone, or registration #" 
                          value={instructorSearch}
                          onChange={(e) => setInstructorSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowInstructorForm(!showInstructorForm)
                          setEditingInstructor(null)
                          setInstructorForm({
                            name: '',
                            email: '',
                            phone: '',
                            specialization: ['crossfit'],
                            qualifications: [''],
                            experience: 1,
                            position: 'instructor',
                            salary: 50000,
                            bio: '',
                            image: '',
                            assignedClasses: []
                          })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showInstructorForm ? 'Cancel' : editingInstructor ? 'Cancel Edit' : 'Add New Instructor'}
                      </button>
                    </div>

                    {showInstructorForm && (
                      <form onSubmit={handleInstructorSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        {!editingInstructor && (
                          <div style={{ backgroundColor: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: '4px', padding: '10px', marginBottom: '15px', fontSize: '14px', color: '#0c5460' }}>
                            <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                            A unique registration number with prefix "EL00" will be automatically assigned to this instructor.
                          </div>
                        )}
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Full Name *</label>
                            <input 
                              type="text" 
                              placeholder="Enter full name" 
                              value={instructorForm.name}
                              onChange={(e) => setInstructorForm({...instructorForm, name: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Email Address *</label>
                            <input 
                              type="email" 
                              placeholder="Enter email address" 
                              value={instructorForm.email}
                              onChange={(e) => setInstructorForm({...instructorForm, email: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Phone Number *</label>
                            <input 
                              type="tel" 
                              placeholder="Enter phone number" 
                              value={instructorForm.phone}
                              onChange={(e) => setInstructorForm({...instructorForm, phone: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Years of Experience *</label>
                            <input 
                              type="number" 
                              placeholder="Enter years of experience" 
                              value={instructorForm.experience}
                              onChange={(e) => setInstructorForm({...instructorForm, experience: parseInt(e.target.value)})}
                              required
                              min="1"
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Position *</label>
                            <select 
                              value={instructorForm.position}
                              onChange={(e) => setInstructorForm({...instructorForm, position: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="instructor">Instructor</option>
                              <option value="senior_instructor">Senior Instructor</option>
                              <option value="chief_instructor">Chief Instructor</option>
                              <option value="head_trainer">Head Trainer</option>
                              <option value="ceo">CEO</option>
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Monthly Salary (LKR) *</label>
                            <input 
                              type="number" 
                              placeholder="Enter monthly salary" 
                              value={instructorForm.salary}
                              onChange={(e) => setInstructorForm({...instructorForm, salary: parseFloat(e.target.value) || 0})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div className="col-md-6">
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Specialization:</label>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                {['crossfit', 'karate', 'zumba'].map(spec => (
                                  <label key={spec} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={instructorForm.specialization.includes(spec)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setInstructorForm({...instructorForm, specialization: [...instructorForm.specialization, spec]})
                                        } else {
                                          const newSpecialization = instructorForm.specialization.filter(s => s !== spec)
                                          // Clear assigned classes that don't match remaining specializations
                                          const validClasses = instructorForm.assignedClasses.filter(classId => {
                                            const cls = classes.find(c => c._id === classId)
                                            return cls && newSpecialization.includes(cls.category)
                                          })
                                          setInstructorForm({...instructorForm, specialization: newSpecialization, assignedClasses: validClasses})
                                        }
                                      }}
                                      style={{ marginRight: '5px' }}
                                    />
                                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Qualifications:</label>
                              {instructorForm.qualifications.map((qual, index) => (
                                <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                                  <input 
                                    type="text" 
                                    placeholder="Qualification/Certification" 
                                    value={qual}
                                    onChange={(e) => {
                                      const newQuals = [...instructorForm.qualifications]
                                      newQuals[index] = e.target.value
                                      setInstructorForm({...instructorForm, qualifications: newQuals})
                                    }}
                                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginRight: '5px' }}
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newQuals = instructorForm.qualifications.filter((_, i) => i !== index)
                                      setInstructorForm({...instructorForm, qualifications: newQuals})
                                    }}
                                    style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => setInstructorForm({...instructorForm, qualifications: [...instructorForm.qualifications, '']})}
                                style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                              >
                                + Add Qualification
                              </button>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Profile Picture:</label>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (e) => {
                                      setInstructorForm({...instructorForm, image: e.target.result})
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                              />
                              {instructorForm.image && (
                                <div style={{ textAlign: 'center' }}>
                                  <img 
                                    src={instructorForm.image} 
                                    alt="Preview" 
                                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f36100' }}
                                  />
                                </div>
                              )}
                            </div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Bio</label>
                            <textarea 
                              placeholder="Enter bio (optional)" 
                              value={instructorForm.bio}
                              onChange={(e) => setInstructorForm({...instructorForm, bio: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                            />
                            <div style={{ marginTop: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Assign Classes:</label>
                              <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                                {classes.filter(cls => instructorForm.specialization.includes(cls.category)).map(cls => (
                                  <label key={cls._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', fontSize: '14px' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={instructorForm.assignedClasses.includes(cls._id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setInstructorForm({...instructorForm, assignedClasses: [...instructorForm.assignedClasses, cls._id]})
                                        } else {
                                          setInstructorForm({...instructorForm, assignedClasses: instructorForm.assignedClasses.filter(id => id !== cls._id)})
                                        }
                                      }}
                                      style={{ marginRight: '8px' }}
                                    />
                                    <span>{cls.name} ({cls.days ? cls.days.join(', ') : cls.day} {cls.time})</span>
                                  </label>
                                ))}
                                {classes.filter(cls => instructorForm.specialization.includes(cls.category)).length === 0 && (
                                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>No classes available for selected specialization</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <button 
                          type="submit"
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          {editingInstructor ? 'Update Instructor' : 'Create Instructor'}
                        </button>
                      </form>
                    )}

                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0 }}><strong>Showing: {getFilteredInstructors().length} / {instructors.length} Instructors</strong></p>
                      <button 
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/instructors/migrate-ids', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            })
                            const data = await response.json()
                            showToast(data.message, 'success')
                            fetchInstructors() // Refresh the list
                          } catch (error) {
                            showToast('Error assigning registration numbers', 'error')
                          }
                        }}
                        style={{
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Assign Registration Numbers
                      </button>
                    </div>

                    {getFilteredInstructors().length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <p>{instructors.length === 0 ? 'No instructors added yet.' : 'No instructors found matching your search.'}</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                            <tr>
                              <th>Registration #</th>
                              <th>Name</th>
                              <th>Contact</th>
                              <th>Position</th>
                              <th>Specialization</th>
                              <th>Assigned Classes</th>
                              <th>Experience</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredInstructors().map((instructor) => (
                              <tr key={instructor._id}>
                                <td>
                                  <div style={{fontSize: '12px', fontWeight: '600', color: '#f36100'}}>
                                    {instructor.instructorId || 'N/A'}
                                  </div>
                                  <div style={{fontSize: '10px', color: '#666'}}>
                                    {new Date(instructor.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td>
                                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    {instructor.image ? (
                                      <img 
                                        src={instructor.image} 
                                        alt={instructor.name}
                                        style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                                      />
                                    ) : (
                                      <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #f36100, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: '600'}}>
                                        {instructor.name.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <strong>{instructor.name}</strong>
                                      {instructor.bio && <div style={{fontSize: '12px', color: '#666'}}>{instructor.bio.substring(0, 30)}...</div>}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div style={{fontSize: '12px'}}>{instructor.email}</div>
                                  <div style={{fontSize: '12px'}}>{instructor.phone}</div>
                                </td>
                                <td>
                                  <span style={{ 
                                    backgroundColor: instructor.position === 'ceo' ? '#dc3545' : instructor.position === 'chief_instructor' ? '#fd7e14' : instructor.position === 'head_trainer' ? '#6f42c1' : instructor.position === 'senior_instructor' ? '#20c997' : '#6c757d',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase'
                                  }}>
                                    {instructor.position?.replace('_', ' ') || 'instructor'}
                                  </span>
                                </td>
                                <td>
                                  {instructor.specialization.map(spec => (
                                    <span key={spec} style={{ 
                                      backgroundColor: spec === 'crossfit' ? '#ff5722' : spec === 'karate' ? '#2196f3' : '#9c27b0',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '10px',
                                      fontSize: '10px',
                                      marginRight: '3px',
                                      textTransform: 'uppercase'
                                    }}>
                                      {spec}
                                    </span>
                                  ))}
                                </td>
                                <td>
                                  <div style={{ fontSize: '11px' }}>
                                    {instructor.assignedClasses && instructor.assignedClasses.length > 0 ? (
                                      instructor.assignedClasses.slice(0, 2).map(classId => {
                                        const cls = classes.find(c => c._id === classId)
                                        return cls ? (
                                          <div key={classId} style={{ 
                                            backgroundColor: cls.category === 'crossfit' ? '#ff5722' : cls.category === 'karate' ? '#2196f3' : '#9c27b0',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            marginBottom: '2px',
                                            fontSize: '10px'
                                          }}>
                                            {cls.name}
                                          </div>
                                        ) : null
                                      })
                                    ) : (
                                      <span style={{ color: '#999' }}>No classes assigned</span>
                                    )}
                                    {instructor.assignedClasses && instructor.assignedClasses.length > 2 && (
                                      <div style={{ fontSize: '9px', color: '#666' }}>+{instructor.assignedClasses.length - 2} more</div>
                                    )}
                                  </div>
                                </td>
                                <td>{instructor.experience} years</td>
                                <td>
                                  <div style={{ display: 'flex', gap: '5px' }}>
                                    <button 
                                      onClick={() => editInstructor(instructor)}
                                      style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => deleteInstructor(instructor._id)}
                                      style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'attendance' && (
                  <AttendanceTab 
                    classes={classes}
                    attendanceData={attendanceData}
                    setAttendanceData={setAttendanceData}
                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    attendanceDate={attendanceDate}
                    setAttendanceDate={setAttendanceDate}
                  />
                )}

                {activeTab === 'payments' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Payment Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <select 
                          value={paymentFilter}
                          onChange={(e) => setPaymentFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Classes ({payments.length})</option>
                          {classes.map(cls => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name} ({payments.filter(p => p.classId === cls._id).length})
                            </option>
                          ))}
                        </select>
                        <select 
                          value={paymentStatusFilter}
                          onChange={(e) => setPaymentStatusFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Status ({payments.length})</option>
                          <option value="paid">Paid ({payments.filter(p => (p.status || 'paid') === 'paid').length})</option>
                          <option value="pending">Pending ({payments.filter(p => p.status === 'pending').length})</option>
                          <option value="overdue">Overdue ({payments.filter(p => p.status === 'overdue').length})</option>
                        </select>
                        <select 
                          value={paymentMonthFilter}
                          onChange={(e) => setPaymentMonthFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Months</option>
                          {[...new Set(payments.map(p => p.paymentMonth).filter(Boolean))].sort().reverse().map(month => (
                            <option key={month} value={month}>
                              {month} ({payments.filter(p => p.paymentMonth === month).length})
                            </option>
                          ))}
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by member, class, type, method, or ID" 
                          value={paymentSearch}
                          onChange={(e) => setPaymentSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowPaymentForm(!showPaymentForm)
                          setEditingPayment(null)
                          setPaymentForm({
                            memberId: '',
                            memberName: '',
                            classId: '',
                            className: '',
                            paymentType: 'monthly',
                            amount: 0,
                            paymentMethod: 'cash',
                            paymentMonth: new Date().toISOString().slice(0, 7),
                            notes: ''
                          })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showPaymentForm ? 'Cancel' : 'Add Payment'}
                      </button>
                    </div>
                    {showPaymentForm && (
                      <form onSubmit={handlePaymentSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                      <div className="row">
                        <div className="col-md-6">
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Member *</label>
                          <select 
                            value={paymentForm.memberId}
                            onChange={(e) => {
                              const member = members.find(m => m._id === e.target.value)
                              setPaymentForm({...paymentForm, memberId: e.target.value, memberName: member?.fullName || '', classId: '', className: ''})
                            }}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          >
                            <option value="">Select Member</option>
                            {members.map(member => (
                              <option key={member._id} value={member._id}>{member.fullName || member.name}</option>
                            ))}
                          </select>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Class *</label>
                          <select 
                            value={paymentForm.classId}
                            onChange={(e) => {
                              const cls = classes.find(c => c._id === e.target.value)
                              const selectedMember = members.find(m => m._id === paymentForm.memberId)
                              let paymentType = 'monthly'
                              let amount = 0
                              
                              if (cls && selectedMember) {
                                // Auto-assign payment type based on membership type
                                if (selectedMember.membershipType === 'trial') {
                                  paymentType = 'admission'
                                  amount = cls.admissionFee || 0
                                } else if (selectedMember.membershipType === 'yearly') {
                                  paymentType = 'annually'
                                  amount = cls.fees?.annually || 0
                                } else {
                                  paymentType = 'monthly'
                                  amount = cls.fees?.monthly || 0
                                }
                              }
                              
                              setPaymentForm({...paymentForm, classId: e.target.value, className: cls?.name || '', paymentType, amount})
                            }}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          >
                            <option value="">Select Class</option>
                            {paymentForm.memberId ? (
                              (() => {
                                const selectedMember = members.find(m => m._id === paymentForm.memberId)
                                const memberClasses = selectedMember?.assignedClasses || []
                                return memberClasses.length > 0 ? 
                                  memberClasses.map(classId => {
                                    const cls = classes.find(c => c._id === classId)
                                    return cls ? <option key={cls._id} value={cls._id}>{cls.name} ({cls.days ? cls.days.join(', ') : cls.day})</option> : null
                                  }) : 
                                  classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)
                              })()
                            ) : (
                              classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name} ({cls.days ? cls.days.join(', ') : cls.day})</option>)
                            )}
                          </select>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Payment Type *</label>
                          <select 
                            value={paymentForm.paymentType}
                            onChange={(e) => {
                              const cls = classes.find(c => c._id === paymentForm.classId)
                              let amount = 0
                              if (cls) {
                                if (e.target.value === 'admission') amount = cls.admissionFee || 0
                                else if (e.target.value === 'monthly') amount = cls.fees?.monthly || 0
                                else if (e.target.value === 'sixMonthly') amount = cls.fees?.sixMonthly || 0
                                else if (e.target.value === 'annually') amount = cls.fees?.annually || 0
                              }
                              setPaymentForm({...paymentForm, paymentType: e.target.value, amount})
                            }}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          >
                            <option value="admission">Admission Fee</option>
                            <option value="monthly">Monthly Fee</option>
                            <option value="sixMonthly">6-Monthly Fee</option>
                            <option value="annually">Annual Fee</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Amount (LKR) *</label>
                          <input 
                            type="number" 
                            placeholder="Enter amount" 
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value) || 0})}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Payment Method *</label>
                          <select 
                            value={paymentForm.paymentMethod}
                            onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                          </select>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Payment Month *</label>
                          <input 
                            type="month" 
                            value={paymentForm.paymentMonth}
                            onChange={(e) => setPaymentForm({...paymentForm, paymentMonth: e.target.value})}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Notes</label>
                          <textarea 
                            placeholder="Enter notes (optional)" 
                            value={paymentForm.notes}
                            onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                          />
                        </div>
                      </div>
                      <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                        {editingPayment ? 'Update Payment' : 'Record Payment'}
                      </button>
                      </form>
                    )}
                    
                    <div style={{ backgroundColor: '#e8f5e8', border: '1px solid #c3e6c3', borderRadius: '5px', padding: '15px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                          <h5 style={{ margin: 0, color: '#2d5a2d' }}>Payment Status for {selectedMonth}</h5>
                          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#2d5a2d' }}>
                            Paid: {paymentStatus ? paymentStatus.filter(p => p.status === 'paid').length : 0} | 
                            Unpaid: {paymentStatus ? paymentStatus.filter(p => p.status === 'unpaid').length : 0} | 
                            Total: {paymentStatus ? paymentStatus.length : 0}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input 
                            type="month" 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                          />
                          <button 
                            onClick={generateReminders}
                            style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                          >
                            Generate Reminders
                          </button>
                        </div>
                      </div>
                      
                      {paymentStatus.filter(p => p.status === 'unpaid').length > 0 && (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          <h6 style={{ color: '#dc3545', marginBottom: '10px' }}>Unpaid Members:</h6>
                          {paymentStatus.filter(p => p.status === 'unpaid').map((status, index) => {
                            const reminder = reminders.find(r => r.memberId === status.memberId && r.classId === status.classId && r.status === 'pending')
                            return (
                              <div key={index} style={{ backgroundColor: 'white', padding: '12px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ffcccb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <strong>{status.memberName}</strong> - {status.className}
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                      Amount: LKR {status.amount} | Email: {status.memberEmail} | Phone: {status.memberPhone}
                                    </div>
                                  </div>
                                  {reminder && (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                      <button 
                                        onClick={() => sendReminder(reminder._id, 'email')}
                                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
                                      >
                                        📧 Email
                                      </button>
                                      <button 
                                        onClick={() => sendReminder(reminder._id, 'sms')}
                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
                                      >
                                        📱 SMS
                                      </button>
                                      <span style={{ fontSize: '10px', color: '#666' }}>Sent: {reminder.reminderCount}x</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0 }}><strong>Showing: {getFilteredPayments().length} / {payments.length} Payments</strong></p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => {
                            setPaymentFilter('all')
                            setPaymentStatusFilter('all')
                            setPaymentMonthFilter('all')
                            setPaymentSearch('')
                          }}
                          style={{
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Member</th>
                            <th>Class</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Month</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPayments().map((payment) => (
                            <tr key={payment._id}>
                              <td>{payment.memberName}</td>
                              <td>{payment.className}</td>
                              <td><span style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{payment.paymentType}</span></td>
                              <td>LKR {payment.amount}</td>
                              <td>{payment.paymentMethod}</td>
                              <td>{payment.paymentMonth || 'N/A'}</td>
                              <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                              <td><span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>PAID</span></td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editPayment(payment)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deletePayment(payment._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'salaries' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Salary Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={salaryFilter}
                          onChange={(e) => setSalaryFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Months ({salaries.length})</option>
                          {[...new Set(salaries.map(s => s.month))].sort().reverse().map(month => (
                            <option key={month} value={month}>
                              {month} ({salaries.filter(s => s.month === month).length})
                            </option>
                          ))}
                        </select>
                        <button 
                          onClick={() => {
                            setShowSalaryForm(!showSalaryForm)
                            setEditingSalary(null)
                            setSalaryForm({
                              instructorId: '',
                              instructorName: '',
                              month: new Date().toISOString().slice(0, 7),
                              baseSalary: 0,
                              bonuses: 0,
                              deductions: 0,
                              notes: ''
                            })
                          }}
                          style={{
                            backgroundColor: '#f36100',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          {showSalaryForm ? 'Cancel' : 'Add Salary'}
                        </button>
                      </div>
                    </div>
                    {showSalaryForm && (
                      <form onSubmit={handleSalarySubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                      <div className="row">
                        <div className="col-md-6">
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Instructor *</label>
                          <select 
                            value={salaryForm.instructorId}
                            onChange={(e) => {
                              const instructor = instructors.find(i => i._id === e.target.value)
                              setSalaryForm({...salaryForm, instructorId: e.target.value, instructorName: instructor?.name || '', baseSalary: instructor?.salary || 0})
                            }}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          >
                            <option value="">Select Instructor</option>
                            {instructors.map(instructor => (
                              <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
                            ))}
                          </select>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Month *</label>
                          <input 
                            type="month" 
                            value={salaryForm.month}
                            onChange={(e) => setSalaryForm({...salaryForm, month: e.target.value})}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Base Salary (LKR) *</label>
                          <input 
                            type="number" 
                            placeholder="Enter base salary" 
                            value={salaryForm.baseSalary}
                            onChange={(e) => setSalaryForm({...salaryForm, baseSalary: parseFloat(e.target.value) || 0})}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Bonuses (LKR)</label>
                          <input 
                            type="number" 
                            placeholder="Enter bonuses" 
                            value={salaryForm.bonuses}
                            onChange={(e) => setSalaryForm({...salaryForm, bonuses: parseFloat(e.target.value) || 0})}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Deductions (LKR)</label>
                          <input 
                            type="number" 
                            placeholder="Enter deductions" 
                            value={salaryForm.deductions}
                            onChange={(e) => setSalaryForm({...salaryForm, deductions: parseFloat(e.target.value) || 0})}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Notes</label>
                          <textarea 
                            placeholder="Enter notes (optional)" 
                            value={salaryForm.notes}
                            onChange={(e) => setSalaryForm({...salaryForm, notes: e.target.value})}
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                          />
                        </div>
                      </div>
                      <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>
                        Total: LKR {(parseFloat(salaryForm.baseSalary) + parseFloat(salaryForm.bonuses || 0) - parseFloat(salaryForm.deductions || 0)).toFixed(2)}
                      </div>
                      <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                        {editingSalary ? 'Update Salary' : 'Record Salary'}
                      </button>
                      </form>
                    )}
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Instructor</th>
                            <th>Month</th>
                            <th>Base Salary</th>
                            <th>Bonuses</th>
                            <th>Deductions</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(salaryFilter === 'all' ? salaries : salaries.filter(s => s.month === salaryFilter)).map((salary) => (
                            <tr key={salary._id}>
                              <td>{salary.instructorName}</td>
                              <td>{salary.month}</td>
                              <td>LKR {salary.baseSalary}</td>
                              <td>LKR {salary.bonuses || 0}</td>
                              <td>LKR {salary.deductions || 0}</td>
                              <td>LKR {salary.totalAmount}</td>
                              <td><span style={{ backgroundColor: salary.status === 'paid' ? '#d4edda' : '#fff3cd', color: salary.status === 'paid' ? '#155724' : '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{salary.status}</span></td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editSalary(salary)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteSalary(salary._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'sms' && (
                  <>
                    <h3 style={{ marginBottom: '30px', color: '#333' }}>SMS Gateway Configuration</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                          <h5 style={{ color: '#333', marginBottom: '15px' }}>Twilio SMS Gateway</h5>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Account SID:</label>
                            <input 
                              type="text" 
                              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                              value={smsConfig.twilio.accountSid}
                              onChange={(e) => setSmsConfig({...smsConfig, twilio: {...smsConfig.twilio, accountSid: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Auth Token:</label>
                            <input 
                              type="password" 
                              placeholder="Your Twilio Auth Token" 
                              value={smsConfig.twilio.authToken}
                              onChange={(e) => setSmsConfig({...smsConfig, twilio: {...smsConfig.twilio, authToken: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>From Number:</label>
                            <input 
                              type="text" 
                              placeholder="+1234567890" 
                              value={smsConfig.twilio.fromNumber}
                              onChange={(e) => setSmsConfig({...smsConfig, twilio: {...smsConfig.twilio, fromNumber: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <button 
                            onClick={() => saveSmsConfig('twilio', smsConfig.twilio)}
                            style={{ backgroundColor: '#f22f46', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Save Twilio Config
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                          <h5 style={{ color: '#333', marginBottom: '15px' }}>Local SMS Gateway</h5>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>API URL:</label>
                            <input 
                              type="text" 
                              placeholder="https://api.localsms.lk/send" 
                              value={smsConfig.local.apiUrl}
                              onChange={(e) => setSmsConfig({...smsConfig, local: {...smsConfig.local, apiUrl: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>API Key:</label>
                            <input 
                              type="password" 
                              placeholder="Your API Key" 
                              value={smsConfig.local.apiKey}
                              onChange={(e) => setSmsConfig({...smsConfig, local: {...smsConfig.local, apiKey: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Sender ID:</label>
                            <input 
                              type="text" 
                              placeholder="ELITE_GYM" 
                              value={smsConfig.local.senderId}
                              onChange={(e) => setSmsConfig({...smsConfig, local: {...smsConfig.local, senderId: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <button 
                            onClick={() => saveSmsConfig('local', smsConfig.local)}
                            style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Save Local Config
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
                      <h5 style={{ color: '#1976d2', marginBottom: '15px' }}>SMS Templates</h5>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Payment Reminder Template:</label>
                        <textarea 
                          placeholder="Hi {memberName}, your {className} payment of LKR {amount} is due for {month}. Please pay to continue classes. - Elite Sports Academy" 
                          value={smsConfig.templates.paymentReminder}
                          onChange={(e) => setSmsConfig({...smsConfig, templates: {...smsConfig.templates, paymentReminder: e.target.value}})}
                          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                        />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Welcome Message Template:</label>
                        <textarea 
                          placeholder="Welcome to Elite Sports Academy {memberName}! Your membership is confirmed. Contact us: +94771095334" 
                          value={smsConfig.templates.welcomeMessage}
                          onChange={(e) => setSmsConfig({...smsConfig, templates: {...smsConfig.templates, welcomeMessage: e.target.value}})}
                          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => saveSmsConfig('templates', smsConfig.templates)}
                          style={{ backgroundColor: '#2196f3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                        >
                          Save Templates
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/test-sms', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ phone: '+94771095334', message: 'Test SMS from Elite Sports Academy' })
                              })
                              const data = await response.json()
                              showToast(data.message || 'Test SMS sent', response.ok ? 'success' : 'error')
                            } catch (error) {
                              showToast('Failed to send test SMS', 'error')
                            }
                          }}
                          style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                        >
                          Test SMS
                        </button>
                        <button style={{ backgroundColor: '#9c27b0', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                          View SMS Logs
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'posts' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Video Posts Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={postFilter}
                          onChange={(e) => setPostFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Posts ({posts.filter(p => p.type !== 'article').length})</option>
                          <option value="crossfit">CrossFit ({posts.filter(p => p.category === 'crossfit' && p.type !== 'article').length})</option>
                          <option value="karate">Karate ({posts.filter(p => p.category === 'karate' && p.type !== 'article').length})</option>
                          <option value="zumba">Zumba ({posts.filter(p => p.category === 'zumba' && p.type !== 'article').length})</option>
                          <option value="general">General ({posts.filter(p => p.category === 'general' && p.type !== 'article').length})</option>
                          <option value="normal">Normal ({posts.filter(p => p.type === 'normal').length})</option>
                          <option value="trending">Trending ({posts.filter(p => p.type === 'trending').length})</option>
                          <option value="featured">Featured ({posts.filter(p => p.type === 'featured').length})</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by title, description, or category" 
                          value={postSearch}
                          onChange={(e) => setPostSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowPostForm(!showPostForm)
                          setEditingPost(null)
                          setPostForm({ title: '', description: '', youtubeUrl: '', category: 'general' })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showPostForm ? 'Cancel' : 'Add Video Post'}
                      </button>
                    </div>
                    {showPostForm && (
                      <form onSubmit={handlePostSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Title *</label>
                            <input 
                              type="text" 
                              placeholder="Enter video title" 
                              value={postForm.title}
                              onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>YouTube URL *</label>
                            <input 
                              type="url" 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              value={postForm.youtubeUrl}
                              onChange={(e) => setPostForm({...postForm, youtubeUrl: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Category *</label>
                            <select 
                              value={postForm.category}
                              onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="general">General</option>
                              <option value="crossfit">CrossFit</option>
                              <option value="karate">Karate</option>
                              <option value="zumba">Zumba</option>
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Type *</label>
                            <select 
                              value={postForm.type}
                              onChange={(e) => setPostForm({...postForm, type: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="normal">Normal</option>
                              <option value="trending">Trending</option>
                              <option value="featured">Featured</option>
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Description *</label>
                            <textarea 
                              placeholder="Enter video description" 
                              value={postForm.description}
                              onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                            />
                          </div>
                        </div>
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                          {editingPost ? 'Update Post' : 'Create Post'}
                        </button>
                      </form>
                    )}
                    
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0 }}><strong>Showing: {getFilteredPosts().length} / {posts.filter(p => p.type !== 'article').length} Video Posts</strong></p>
                      <button 
                        onClick={() => {
                          setPostFilter('all')
                          setPostSearch('')
                        }}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPosts().map((post) => (
                            <tr key={post._id}>
                              <td>{post.title}</td>
                              <td>
                                <span style={{ 
                                  backgroundColor: post.category === 'crossfit' ? '#ff5722' : post.category === 'karate' ? '#2196f3' : post.category === 'zumba' ? '#9c27b0' : '#666',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {post.category}
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  backgroundColor: post.type === 'trending' ? '#ff9800' : post.type === 'featured' ? '#e91e63' : '#6c757d',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {post.type}
                                </span>
                              </td>
                              <td>{post.description.substring(0, 50)}...</td>
                              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editPost(post)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deletePost(post._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'post-approval' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Post Approval Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Pending Posts: {pendingPosts.length}</span>
                        <button 
                          onClick={() => {
                            fetchPendingPosts()
                            fetchPostHistory()
                          }}
                          style={{
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {pendingPosts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <i className="fas fa-check-circle" style={{ fontSize: '48px', marginBottom: '20px', color: '#28a745' }}></i>
                        <h4>No Pending Posts</h4>
                        <p>All posts have been reviewed and approved.</p>
                      </div>
                    ) : (
                      <div className="row">
                        {pendingPosts.map((post) => (
                          <div key={post._id} className="col-md-6 col-lg-4" style={{ marginBottom: '20px' }}>
                            <div style={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                              <div style={{ marginBottom: '15px' }}>
                                <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>{post.title}</h5>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                  <span style={{ 
                                    backgroundColor: post.category === 'crossfit' ? '#ff5722' : post.category === 'karate' ? '#2196f3' : post.category === 'zumba' ? '#9c27b0' : '#666',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase'
                                  }}>
                                    {post.category}
                                  </span>
                                  <span style={{ 
                                    backgroundColor: post.type === 'article' ? '#6f42c1' : '#17a2b8',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase'
                                  }}>
                                    {post.type}
                                  </span>
                                </div>
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                                  {post.type === 'article' ? post.excerpt : post.description}
                                </p>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                  <div>By: {post.instructorName || 'Admin'}</div>
                                  <div>Created: {new Date(post.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                              
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                <button 
                                  onClick={() => handlePostApproval(post._id, 'approved')}
                                  style={{
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    flex: 1
                                  }}
                                >
                                  <i className="fas fa-check"></i> Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    const reason = prompt('Enter rejection reason (optional):')
                                    if (reason !== null) {
                                      handlePostApproval(post._id, 'rejected', reason)
                                    }
                                  }}
                                  style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    flex: 1
                                  }}
                                >
                                  <i className="fas fa-times"></i> Reject
                                </button>
                              </div>
                              
                              {post.type !== 'article' && post.youtubeUrl && (
                                <div style={{ marginTop: '15px' }}>
                                  <a 
                                    href={post.youtubeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-block',
                                      backgroundColor: '#ff0000',
                                      color: 'white',
                                      padding: '6px 12px',
                                      borderRadius: '4px',
                                      textDecoration: 'none',
                                      fontSize: '12px'
                                    }}
                                  >
                                    <i className="fab fa-youtube"></i> View Video
                                  </a>
                                </div>
                              )}
                              
                              {post.type === 'article' && (
                                <div style={{ marginTop: '15px' }}>
                                  <button 
                                    onClick={() => {
                                      const modal = document.createElement('div')
                                      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px'
                                      modal.innerHTML = `
                                        <div style="background:white;border-radius:8px;padding:30px;max-width:800px;max-height:80vh;overflow-y:auto;position:relative">
                                          <button onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#666">×</button>
                                          <h3 style="margin:0 0 20px 0;color:#333">${post.title}</h3>
                                          <div style="color:#666;font-size:14px;margin-bottom:20px">${post.excerpt}</div>
                                          <div style="line-height:1.6;color:#333">${post.content}</div>
                                        </div>
                                      `
                                      document.body.appendChild(modal)
                                    }}
                                    style={{
                                      backgroundColor: '#6f42c1',
                                      color: 'white',
                                      border: 'none',
                                      padding: '6px 12px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    <i className="fas fa-eye"></i> Preview Article
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: '40px' }}>
                      <h4 style={{ marginBottom: '20px', color: '#333' }}>Post Approval History</h4>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                            <tr>
                              <th>Title</th>
                              <th>Author</th>
                              <th>Category</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Created</th>
                              <th>Approved</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {postHistory.map((post) => (
                              <tr key={post._id}>
                                <td style={{ maxWidth: '200px' }}>
                                  <div style={{ fontWeight: '600' }}>{post.title}</div>
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    {post.type === 'article' ? post.excerpt?.substring(0, 50) : post.description?.substring(0, 50)}...
                                  </div>
                                </td>
                                <td>{post.instructorName || post.instructorId?.name || 'Admin'}</td>
                                <td>
                                  <span style={{ 
                                    backgroundColor: post.category === 'crossfit' ? '#ff5722' : post.category === 'karate' ? '#2196f3' : post.category === 'zumba' ? '#9c27b0' : '#666',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase'
                                  }}>
                                    {post.category}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ 
                                    backgroundColor: post.type === 'article' ? '#6f42c1' : '#17a2b8',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase'
                                  }}>
                                    {post.type}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ 
                                    backgroundColor: post.approvalStatus === 'approved' ? '#28a745' : post.approvalStatus === 'rejected' ? '#dc3545' : '#ffc107',
                                    color: post.approvalStatus === 'pending' ? '#000' : 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    fontWeight: '600'
                                  }}>
                                    {post.approvalStatus || 'approved'}
                                  </span>
                                </td>
                                <td style={{ fontSize: '12px' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td style={{ fontSize: '12px' }}>
                                  {post.approvedAt ? new Date(post.approvedAt).toLocaleDateString() : '-'}
                                </td>
                                <td style={{ fontSize: '12px', maxWidth: '150px' }}>
                                  {post.rejectionReason || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'bookings' && (
                  <>
                    <h3 style={{ marginBottom: '30px', color: '#333' }}>Class Bookings</h3>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Member</th>
                            <th>Class</th>
                            <th>Schedule</th>
                            <th>Contact</th>
                            <th>Booking Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>{booking.memberName}</td>
                              <td>{booking.className}</td>
                              <td>{booking.classDay} {booking.classTime}</td>
                              <td>
                                <div style={{ fontSize: '12px' }}>
                                  <div>{booking.memberEmail}</div>
                                  <div>{booking.memberPhone}</div>
                                </div>
                              </td>
                              <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                              <td>
                                <span style={{ 
                                  backgroundColor: booking.status === 'confirmed' ? '#d4edda' : booking.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                                  color: booking.status === 'confirmed' ? '#155724' : booking.status === 'cancelled' ? '#721c24' : '#856404',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {booking.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                  {booking.status === 'pending' && (
                                    <>
                                      <button 
                                        onClick={async () => {
                                          try {
                                            await fetch(`/api/bookings/${booking._id}`, {
                                              method: 'PUT',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ status: 'confirmed' })
                                            })
                                            fetchBookings()
                                            showToast('Booking approved successfully', 'success')
                                          } catch (error) {
                                            showToast('Failed to approve booking', 'error')
                                          }
                                        }}
                                        style={{
                                          backgroundColor: '#28a745',
                                          color: 'white',
                                          border: 'none',
                                          padding: '4px 8px',
                                          borderRadius: '3px',
                                          cursor: 'pointer',
                                          fontSize: '11px'
                                        }}
                                      >
                                        Approve
                                      </button>
                                      <button 
                                        onClick={async () => {
                                          try {
                                            await fetch(`/api/bookings/${booking._id}`, {
                                              method: 'PUT',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ status: 'cancelled' })
                                            })
                                            fetchBookings()
                                            showToast('Booking rejected successfully', 'success')
                                          } catch (error) {
                                            showToast('Failed to reject booking', 'error')
                                          }
                                        }}
                                        style={{
                                          backgroundColor: '#dc3545',
                                          color: 'white',
                                          border: 'none',
                                          padding: '4px 8px',
                                          borderRadius: '3px',
                                          cursor: 'pointer',
                                          fontSize: '11px'
                                        }}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  <button 
                                    onClick={() => {
                                      setEditingBooking(booking)
                                      setBookingEditForm({
                                        memberName: booking.memberName,
                                        memberEmail: booking.memberEmail,
                                        memberPhone: booking.memberPhone,
                                        status: booking.status
                                      })
                                      setShowBookingEditModal(true)
                                    }}
                                    style={{
                                      backgroundColor: '#17a2b8',
                                      color: 'white',
                                      border: 'none',
                                      padding: '4px 8px',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm('Are you sure you want to delete this booking?')) {
                                        try {
                                          await fetch(`/api/bookings/${booking._id}`, { method: 'DELETE' })
                                          fetchBookings()
                                          showToast('Booking deleted successfully', 'success')
                                        } catch (error) {
                                          showToast('Failed to delete booking', 'error')
                                        }
                                      }
                                    }}
                                    style={{
                                      backgroundColor: '#6c757d',
                                      color: 'white',
                                      border: 'none',
                                      padding: '4px 8px',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontSize: '11px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Booking Edit Modal */}
                    {showBookingEditModal && (
                      <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 9999
                      }}>
                        <div style={{
                          backgroundColor: 'white', borderRadius: '15px', padding: '30px',
                          maxWidth: '500px', width: '90%'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Edit Booking</h3>
                            <button onClick={() => setShowBookingEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>×</button>
                          </div>
                          
                          <form onSubmit={async (e) => {
                            e.preventDefault()
                            try {
                              await fetch(`/api/bookings/${editingBooking._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(bookingEditForm)
                              })
                              fetchBookings()
                              setShowBookingEditModal(false)
                              showToast('Booking updated successfully', 'success')
                            } catch (error) {
                              showToast('Failed to update booking', 'error')
                            }
                          }}>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Member Name</label>
                              <input 
                                type="text" 
                                value={bookingEditForm.memberName}
                                onChange={(e) => setBookingEditForm({...bookingEditForm, memberName: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email</label>
                              <input 
                                type="email" 
                                value={bookingEditForm.memberEmail}
                                onChange={(e) => setBookingEditForm({...bookingEditForm, memberEmail: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone</label>
                              <input 
                                type="tel" 
                                value={bookingEditForm.memberPhone}
                                onChange={(e) => setBookingEditForm({...bookingEditForm, memberPhone: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Status</label>
                              <select 
                                value={bookingEditForm.status}
                                onChange={(e) => setBookingEditForm({...bookingEditForm, status: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Update Booking
                              </button>
                              <button type="button" onClick={() => setShowBookingEditModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'notifications' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Class Notifications</h3>
                      <button 
                        onClick={() => {
                          setShowNotificationForm(!showNotificationForm)
                          setNotificationForm({ title: '', message: '', classId: '', className: '' })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showNotificationForm ? 'Cancel' : 'Send Notification'}
                      </button>
                    </div>
                    {showNotificationForm && (
                      <form onSubmit={handleNotificationSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Title *</label>
                            <input 
                              type="text" 
                              placeholder="Enter notification title" 
                              value={notificationForm.title}
                              onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Select Class *</label>
                            <select 
                              value={notificationForm.classId}
                              onChange={(e) => {
                                const cls = classes.find(c => c._id === e.target.value)
                                setNotificationForm({...notificationForm, classId: e.target.value, className: cls?.name || ''})
                              }}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="">Select Class</option>
                              {classes.map(cls => (
                                <option key={cls._id} value={cls._id}>{cls.name} ({cls.day} {cls.time})</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Message *</label>
                            <textarea 
                              placeholder="Enter notification message" 
                              value={notificationForm.message}
                              onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '120px' }}
                            />
                          </div>
                        </div>
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                          Send to Class Members
                        </button>
                      </form>
                    )}
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Title</th>
                            <th>Class</th>
                            <th>Message</th>
                            <th>Date Sent</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((notification) => (
                            <tr key={notification._id}>
                              <td>{notification.title}</td>
                              <td>{notification.className}</td>
                              <td>{notification.message.substring(0, 50)}...</td>
                              <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                              <td>
                                <span style={{ 
                                  backgroundColor: notification.isActive ? '#d4edda' : '#f8d7da',
                                  color: notification.isActive ? '#155724' : '#721c24',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '12px'
                                }}>
                                  {notification.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'articles' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Article Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={articleFilter}
                          onChange={(e) => setArticleFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Articles ({posts.filter(p => p.type === 'article').length})</option>
                          <option value="published">Published ({posts.filter(p => p.type === 'article' && p.isPublished).length})</option>
                          <option value="draft">Draft ({posts.filter(p => p.type === 'article' && !p.isPublished).length})</option>
                          <option value="general">General ({posts.filter(p => p.type === 'article' && p.category === 'general').length})</option>
                          <option value="fitness">Fitness ({posts.filter(p => p.type === 'article' && p.category === 'fitness').length})</option>
                          <option value="nutrition">Nutrition ({posts.filter(p => p.type === 'article' && p.category === 'nutrition').length})</option>
                          <option value="crossfit">CrossFit ({posts.filter(p => p.type === 'article' && p.category === 'crossfit').length})</option>
                          <option value="karate">Karate ({posts.filter(p => p.type === 'article' && p.category === 'karate').length})</option>
                          <option value="zumba">Zumba ({posts.filter(p => p.type === 'article' && p.category === 'zumba').length})</option>
                          <option value="health">Health ({posts.filter(p => p.type === 'article' && p.category === 'health').length})</option>
                          <option value="lifestyle">Lifestyle ({posts.filter(p => p.type === 'article' && p.category === 'lifestyle').length})</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by title, content, category, or tags" 
                          value={articleSearch}
                          onChange={(e) => setArticleSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowArticleForm(!showArticleForm)
                          setEditingArticle(null)
                          setArticleForm({
                            title: '',
                            content: '',
                            excerpt: '',
                            category: 'general',
                            featuredImage: '',
                            tags: [''],
                            isPublished: true
                          })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showArticleForm ? 'Cancel' : 'Add Article'}
                      </button>
                    </div>
                    {showArticleForm && (
                      <form onSubmit={handleArticleSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Title *</label>
                            <input 
                              type="text" 
                              placeholder="Enter article title" 
                              value={articleForm.title}
                              onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Category *</label>
                            <select 
                              value={articleForm.category}
                              onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="general">General</option>
                              <option value="fitness">Fitness</option>
                              <option value="nutrition">Nutrition</option>
                              <option value="crossfit">CrossFit</option>
                              <option value="karate">Karate</option>
                              <option value="zumba">Zumba</option>
                              <option value="health">Health</option>
                              <option value="lifestyle">Lifestyle</option>
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Excerpt *</label>
                            <textarea 
                              placeholder="Brief description of the article" 
                              value={articleForm.excerpt}
                              onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Featured Image:</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (e) => {
                                    setArticleForm({...articleForm, featuredImage: e.target.result})
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                            />
                            {articleForm.featuredImage && (
                              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                                <img 
                                  src={articleForm.featuredImage} 
                                  alt="Preview" 
                                  style={{ width: '100%', maxWidth: '200px', height: '120px', objectFit: 'cover', border: '2px solid #f36100', borderRadius: '8px' }}
                                />
                              </div>
                            )}
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                  type="checkbox" 
                                  checked={articleForm.isPublished}
                                  onChange={(e) => setArticleForm({...articleForm, isPublished: e.target.checked})}
                                  style={{ marginRight: '10px' }}
                                />
                                Publish Article
                              </label>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tags:</label>
                              {articleForm.tags.map((tag, index) => (
                                <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                                  <input 
                                    type="text" 
                                    placeholder="Tag" 
                                    value={tag}
                                    onChange={(e) => {
                                      const newTags = [...articleForm.tags]
                                      newTags[index] = e.target.value
                                      setArticleForm({...articleForm, tags: newTags})
                                    }}
                                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginRight: '5px' }}
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newTags = articleForm.tags.filter((_, i) => i !== index)
                                      setArticleForm({...articleForm, tags: newTags})
                                    }}
                                    style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button 
                                type="button"
                                onClick={() => setArticleForm({...articleForm, tags: [...articleForm.tags, '']})}
                                style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                              >
                                + Add Tag
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Content *</label>
                          <textarea 
                            placeholder="Write your article content here..." 
                            value={articleForm.content}
                            onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                            required
                            style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '300px', fontFamily: 'monospace' }}
                          />
                          <small style={{ color: '#666', fontSize: '12px' }}>You can use basic HTML tags for formatting</small>
                        </div>
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                          {editingArticle ? 'Update Article' : 'Create Article'}
                        </button>
                      </form>
                    )}
                    
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0 }}><strong>Showing: {getFilteredArticles().length} / {posts.filter(p => p.type === 'article').length} Articles</strong></p>
                      <button 
                        onClick={() => {
                          setArticleFilter('all')
                          setArticleSearch('')
                        }}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                    
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Tags</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredArticles().map((article) => (
                            <tr key={article._id}>
                              <td>
                                <div>
                                  <strong>{article.title}</strong>
                                  {article.featuredImage && <div style={{ fontSize: '11px', color: '#666' }}>📷 Has Image</div>}
                                </div>
                              </td>
                              <td>
                                <span style={{ 
                                  backgroundColor: article.category === 'crossfit' ? '#ff5722' : article.category === 'karate' ? '#2196f3' : article.category === 'zumba' ? '#9c27b0' : article.category === 'fitness' ? '#4caf50' : article.category === 'nutrition' ? '#ff9800' : '#666',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {article.category}
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  backgroundColor: article.isPublished ? '#d4edda' : '#f8d7da',
                                  color: article.isPublished ? '#155724' : '#721c24',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {article.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td>
                                <div style={{ fontSize: '11px' }}>
                                  {article.tags && article.tags.slice(0, 2).map(tag => (
                                    <span key={tag} style={{ 
                                      backgroundColor: '#e3f2fd',
                                      color: '#1976d2',
                                      padding: '2px 6px',
                                      borderRadius: '8px',
                                      marginRight: '3px',
                                      fontSize: '10px'
                                    }}>
                                      {tag}
                                    </span>
                                  ))}
                                  {article.tags && article.tags.length > 2 && (
                                    <span style={{ fontSize: '9px', color: '#666' }}>+{article.tags.length - 2}</span>
                                  )}
                                </div>
                              </td>
                              <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editArticle(article)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deletePost(article._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'diets' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Diet Plan Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select 
                          value={dietFilter}
                          onChange={(e) => setDietFilter(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
                        >
                          <option value="all">All Diet Plans ({diets.length})</option>
                          {members.map(member => (
                            <option key={member._id} value={member._id}>
                              {member.fullName || member.name} ({diets.filter(d => d.memberId === member._id).length})
                            </option>
                          ))}
                          <option value="1 week">1 Week ({diets.filter(d => d.duration === '1 week').length})</option>
                          <option value="2 weeks">2 Weeks ({diets.filter(d => d.duration === '2 weeks').length})</option>
                          <option value="1 month">1 Month ({diets.filter(d => d.duration === '1 month').length})</option>
                          <option value="3 months">3 Months ({diets.filter(d => d.duration === '3 months').length})</option>
                          <option value="6 months">6 Months ({diets.filter(d => d.duration === '6 months').length})</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Search by member, plan name, or duration" 
                          value={dietSearch}
                          onChange={(e) => setDietSearch(e.target.value)}
                          style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setShowDietForm(!showDietForm)
                          setEditingDiet(null)
                          setDietForm({
                            memberId: '',
                            memberName: '',
                            planName: '',
                            description: '',
                            meals: [{ name: '', time: '', foods: [''] }],
                            calories: 0,
                            duration: '',
                            notes: ''
                          })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showDietForm ? 'Cancel' : 'Assign Diet Plan'}
                      </button>
                    </div>
                    {showDietForm && (
                      <form onSubmit={handleDietSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Select Member *</label>
                            <select 
                              value={dietForm.memberId}
                              onChange={(e) => {
                                const member = members.find(m => m._id === e.target.value)
                                setDietForm({...dietForm, memberId: e.target.value, memberName: member?.fullName || member?.name || ''})
                              }}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="">Select Member</option>
                              {members.map(member => (
                                <option key={member._id} value={member._id}>{member.fullName || member.name}</option>
                              ))}
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Plan Name *</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Weight Loss Plan" 
                              value={dietForm.planName}
                              onChange={(e) => setDietForm({...dietForm, planName: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Daily Calories</label>
                            <input 
                              type="number" 
                              placeholder="e.g., 2000" 
                              value={dietForm.calories}
                              onChange={(e) => setDietForm({...dietForm, calories: parseInt(e.target.value) || 0})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Duration</label>
                            <input 
                              type="text" 
                              placeholder="e.g., 4 weeks" 
                              value={dietForm.duration}
                              onChange={(e) => setDietForm({...dietForm, duration: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Description *</label>
                            <textarea 
                              placeholder="Enter diet plan description" 
                              value={dietForm.description}
                              onChange={(e) => setDietForm({...dietForm, description: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '100px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Notes</label>
                            <textarea 
                              placeholder="Additional notes" 
                              value={dietForm.notes}
                              onChange={(e) => setDietForm({...dietForm, notes: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>Meals:</label>
                          {dietForm.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
                              <div className="row">
                                <div className="col-md-4">
                                  <input 
                                    type="text" 
                                    placeholder="Meal name (e.g., Breakfast)" 
                                    value={meal.name}
                                    onChange={(e) => {
                                      const newMeals = [...dietForm.meals]
                                      newMeals[mealIndex].name = e.target.value
                                      setDietForm({...dietForm, meals: newMeals})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input 
                                    type="time" 
                                    value={meal.time}
                                    onChange={(e) => {
                                      const newMeals = [...dietForm.meals]
                                      newMeals[mealIndex].time = e.target.value
                                      setDietForm({...dietForm, meals: newMeals})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                                  />
                                </div>
                                <div className="col-md-5">
                                  {meal.foods.map((food, foodIndex) => (
                                    <div key={foodIndex} style={{ display: 'flex', marginBottom: '5px' }}>
                                      <input 
                                        type="text" 
                                        placeholder="Food item" 
                                        value={food}
                                        onChange={(e) => {
                                          const newMeals = [...dietForm.meals]
                                          newMeals[mealIndex].foods[foodIndex] = e.target.value
                                          setDietForm({...dietForm, meals: newMeals})
                                        }}
                                        style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', marginRight: '5px' }}
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const newMeals = [...dietForm.meals]
                                          newMeals[mealIndex].foods = newMeals[mealIndex].foods.filter((_, i) => i !== foodIndex)
                                          setDietForm({...dietForm, meals: newMeals})
                                        }}
                                        style={{ padding: '6px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newMeals = [...dietForm.meals]
                                      newMeals[mealIndex].foods.push('')
                                      setDietForm({...dietForm, meals: newMeals})
                                    }}
                                    style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px' }}
                                  >
                                    + Add Food
                                  </button>
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newMeals = dietForm.meals.filter((_, i) => i !== mealIndex)
                                  setDietForm({...dietForm, meals: newMeals})
                                }}
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', marginTop: '5px' }}
                              >
                                Remove Meal
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => {
                              setDietForm({...dietForm, meals: [...dietForm.meals, { name: '', time: '', foods: [''] }]})
                            }}
                            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px' }}
                          >
                            + Add Meal
                          </button>
                        </div>
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                          {editingDiet ? 'Update Diet Plan' : 'Assign Diet Plan'}
                        </button>
                      </form>
                    )}
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Member</th>
                            <th>Plan Name</th>
                            <th>Calories</th>
                            <th>Duration</th>
                            <th>Meals</th>
                            <th>Assigned Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diets.map((diet) => (
                            <tr key={diet._id}>
                              <td>{diet.memberName}</td>
                              <td><strong>{diet.planName}</strong></td>
                              <td>{diet.calories} cal</td>
                              <td>{diet.duration}</td>
                              <td>{diet.meals.length} meals</td>
                              <td>{new Date(diet.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editDiet(diet)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteDiet(diet._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'roles' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Instructor Role Management</h3>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Instructor</th>
                            <th>Email</th>
                            <th>Manage Classes</th>
                            <th>View Reports</th>
                            <th>Manage Members</th>
                            <th>View Payments</th>
                          </tr>
                        </thead>
                        <tbody>
                          {instructors.map(instructor => (
                            <tr key={instructor._id}>
                              <td>{instructor.name}</td>
                              <td>{instructor.email}</td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={instructor.privileges?.canManageClasses || false}
                                  onChange={async (e) => {
                                    try {
                                      const updatedPrivileges = {
                                        canManageClasses: false,
                                        canViewReports: false,
                                        canManageMembers: false,
                                        canViewPayments: false,
                                        ...instructor.privileges,
                                        canManageClasses: e.target.checked
                                      };
                                      const response = await fetch(`/api/instructors/${instructor._id}/privileges`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ privileges: updatedPrivileges })
                                      });
                                      if (response.ok) {
                                        fetchInstructors();
                                        showToast('Privileges updated successfully', 'success');
                                      } else {
                                        showToast('Failed to update privileges', 'error');
                                      }
                                    } catch (error) {
                                      console.error('Error:', error);
                                      showToast('Error updating privileges', 'error');
                                    }
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={instructor.privileges?.canViewReports || false}
                                  onChange={async (e) => {
                                    try {
                                      const updatedPrivileges = {
                                        canManageClasses: false,
                                        canViewReports: false,
                                        canManageMembers: false,
                                        canViewPayments: false,
                                        ...instructor.privileges,
                                        canViewReports: e.target.checked
                                      };
                                      const response = await fetch(`/api/instructors/${instructor._id}/privileges`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ privileges: updatedPrivileges })
                                      });
                                      if (response.ok) {
                                        fetchInstructors();
                                        showToast('Privileges updated successfully', 'success');
                                      } else {
                                        showToast('Failed to update privileges', 'error');
                                      }
                                    } catch (error) {
                                      console.error('Error:', error);
                                      showToast('Error updating privileges', 'error');
                                    }
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={instructor.privileges?.canManageMembers || false}
                                  onChange={async (e) => {
                                    try {
                                      const updatedPrivileges = {
                                        canManageClasses: false,
                                        canViewReports: false,
                                        canManageMembers: false,
                                        canViewPayments: false,
                                        ...instructor.privileges,
                                        canManageMembers: e.target.checked
                                      };
                                      const response = await fetch(`/api/instructors/${instructor._id}/privileges`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ privileges: updatedPrivileges })
                                      });
                                      if (response.ok) {
                                        fetchInstructors();
                                        showToast('Privileges updated successfully', 'success');
                                      } else {
                                        showToast('Failed to update privileges', 'error');
                                      }
                                    } catch (error) {
                                      console.error('Error:', error);
                                      showToast('Error updating privileges', 'error');
                                    }
                                  }}
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={instructor.privileges?.canViewPayments || false}
                                  onChange={async (e) => {
                                    try {
                                      const updatedPrivileges = {
                                        canManageClasses: false,
                                        canViewReports: false,
                                        canManageMembers: false,
                                        canViewPayments: false,
                                        ...instructor.privileges,
                                        canViewPayments: e.target.checked
                                      };
                                      const response = await fetch(`/api/instructors/${instructor._id}/privileges`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ privileges: updatedPrivileges })
                                      });
                                      if (response.ok) {
                                        fetchInstructors();
                                        showToast('Privileges updated successfully', 'success');
                                      } else {
                                        showToast('Failed to update privileges', 'error');
                                      }
                                    } catch (error) {
                                      console.error('Error:', error);
                                      showToast('Error updating privileges', 'error');
                                    }
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'reports' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Reports Module</h3>
                    </div>
                    <iframe 
                      src="/reports" 
                      style={{ 
                        width: '100%', 
                        height: '800px', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }}
                      title="Reports Module"
                    />
                  </>
                )}

                {activeTab === 'rules' && <RulesTab />}

                {activeTab === 'password' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Change Admin Password</h3>
                    </div>

                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <div style={{ backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '8px' }}>
                          <form onSubmit={handlePasswordChange}>
                            <div style={{ marginBottom: '20px' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                                <i className="fas fa-lock me-2"></i>Current Password *
                              </label>
                              <input 
                                type="password" 
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                required
                                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                                placeholder="Enter current password"
                              />
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                                <i className="fas fa-key me-2"></i>New Password *
                              </label>
                              <input 
                                type="password" 
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                required
                                minLength="6"
                                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                                placeholder="Enter new password (min 6 characters)"
                              />
                            </div>
                            
                            <div style={{ marginBottom: '25px' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                                <i className="fas fa-check-circle me-2"></i>Confirm New Password *
                              </label>
                              <input 
                                type="password" 
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                required
                                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '16px' }}
                                placeholder="Confirm new password"
                              />
                            </div>
                            
                            <button 
                              type="submit"
                              style={{
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                width: '100%'
                              }}
                            >
                              <i className="fas fa-save me-2"></i>
                              Update Password
                            </button>
                          </form>
                          
                          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '6px', padding: '15px', marginTop: '20px' }}>
                            <h6 style={{ color: '#856404', marginBottom: '10px' }}>
                              <i className="fas fa-info-circle me-2"></i>Password Requirements:
                            </h6>
                            <ul style={{ color: '#856404', fontSize: '14px', marginBottom: 0, paddingLeft: '20px' }}>
                              <li>Minimum 6 characters long</li>
                              <li>Use a strong, unique password</li>
                              <li>Don't share your password with others</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'contact' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Contact Information Management</h3>
                      <button 
                        onClick={saveContactInfo}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        Save Changes
                      </button>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                          <h5 style={{ color: '#333', marginBottom: '15px' }}><i className="fas fa-info-circle"></i> Basic Information</h5>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Title/Slogan:</label>
                            <input 
                              type="text" 
                              value={contactInfo.title}
                              onChange={(e) => setContactInfo({...contactInfo, title: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description:</label>
                            <textarea 
                              value={contactInfo.description}
                              onChange={(e) => setContactInfo({...contactInfo, description: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Address:</label>
                            <textarea 
                              value={contactInfo.address}
                              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone Number:</label>
                            <input 
                              type="text" 
                              value={contactInfo.phone}
                              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email Address:</label>
                            <input 
                              type="email" 
                              value={contactInfo.email}
                              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Website:</label>
                            <input 
                              type="text" 
                              value={contactInfo.website}
                              onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                          <h5 style={{ color: '#333', marginBottom: '15px' }}><i className="fas fa-share-alt"></i> Social Media Links</h5>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Facebook:</label>
                            <input 
                              type="url" 
                              value={contactInfo.socialMedia.facebook}
                              onChange={(e) => setContactInfo({...contactInfo, socialMedia: {...contactInfo.socialMedia, facebook: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Instagram:</label>
                            <input 
                              type="url" 
                              value={contactInfo.socialMedia.instagram}
                              onChange={(e) => setContactInfo({...contactInfo, socialMedia: {...contactInfo.socialMedia, instagram: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>YouTube:</label>
                            <input 
                              type="url" 
                              value={contactInfo.socialMedia.youtube}
                              onChange={(e) => setContactInfo({...contactInfo, socialMedia: {...contactInfo.socialMedia, youtube: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                        
                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                          <h5 style={{ color: '#333', marginBottom: '15px' }}><i className="fas fa-clock"></i> Business Hours</h5>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Weekdays (Mon-Fri):</label>
                            <input 
                              type="text" 
                              value={contactInfo.businessHours.weekdays}
                              onChange={(e) => setContactInfo({...contactInfo, businessHours: {...contactInfo.businessHours, weekdays: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Weekends (Sat-Sun):</label>
                            <input 
                              type="text" 
                              value={contactInfo.businessHours.weekends}
                              onChange={(e) => setContactInfo({...contactInfo, businessHours: {...contactInfo.businessHours, weekends: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-12">
                        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                          <h5 style={{ color: '#333', marginBottom: '15px' }}><i className="fas fa-map-marker-alt"></i> Map Location</h5>
                          
                          <div className="row">
                            <div className="col-md-6">
                              <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Latitude:</label>
                                <input 
                                  type="number" 
                                  step="any"
                                  value={contactInfo.mapLocation.latitude}
                                  onChange={(e) => setContactInfo({...contactInfo, mapLocation: {...contactInfo.mapLocation, latitude: parseFloat(e.target.value)}})}
                                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Longitude:</label>
                                <input 
                                  type="number" 
                                  step="any"
                                  value={contactInfo.mapLocation.longitude}
                                  onChange={(e) => setContactInfo({...contactInfo, mapLocation: {...contactInfo.mapLocation, longitude: parseFloat(e.target.value)}})}
                                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Google Maps Embed URL:</label>
                            <textarea 
                              value={contactInfo.mapLocation.embedUrl}
                              onChange={(e) => setContactInfo({...contactInfo, mapLocation: {...contactInfo.mapLocation, embedUrl: e.target.value}})}
                              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                              placeholder="Paste Google Maps embed URL here"
                            />
                          </div>
                          
                          <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', padding: '10px', marginBottom: '15px' }}>
                            <small style={{ color: '#856404', fontSize: '12px' }}>
                              <strong><i className="fas fa-info-circle me-1"></i>How to get embed URL:</strong><br/>
                              1. Go to Google Maps and search for your location<br/>
                              2. Click "Share" → "Embed a map"<br/>
                              3. Copy the iframe src URL and paste above
                            </small>
                          </div>
                          
                          {contactInfo.mapLocation.embedUrl && (
                            <div style={{ marginTop: '15px' }}>
                              <h6 style={{ marginBottom: '10px' }}>Map Preview:</h6>
                              <iframe
                                src={contactInfo.mapLocation.embedUrl}
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: '8px' }}
                                allowFullScreen
                                loading="lazy"
                              ></iframe>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
                      <h5 style={{ color: '#1976d2', marginBottom: '15px' }}><i className="fas fa-eye"></i> Preview</h5>
                      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '2px solid #f36100' }}>
                        <h4 style={{ color: '#f36100', marginBottom: '10px' }}>{contactInfo.title}</h4>
                        <p style={{ color: '#666', marginBottom: '15px' }}>{contactInfo.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '14px' }}>
                          <div><i className="fas fa-map-marker-alt" style={{ color: '#f36100', marginRight: '8px' }}></i>{contactInfo.address}</div>
                          <div><i className="fas fa-phone" style={{ color: '#f36100', marginRight: '8px' }}></i>{contactInfo.phone}</div>
                          <div><i className="fas fa-envelope" style={{ color: '#f36100', marginRight: '8px' }}></i>{contactInfo.email}</div>
                        </div>
                        <div style={{ marginTop: '15px', fontSize: '14px' }}>
                          <strong>Business Hours:</strong><br/>
                          Weekdays: {contactInfo.businessHours.weekdays}<br/>
                          Weekends: {contactInfo.businessHours.weekends}
                        </div>
                        <div style={{ marginTop: '15px', fontSize: '14px' }}>
                          <strong>Location:</strong><br/>
                          Lat: {contactInfo.mapLocation.latitude}, Lng: {contactInfo.mapLocation.longitude}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'exercises' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Exercise Plans</h3>
                      <button 
                        onClick={() => {
                          setShowExerciseForm(!showExerciseForm)
                          setEditingExercise(null)
                          setExerciseForm({
                            memberId: '', memberName: '', planName: '', description: '',
                            exercises: [{ name: '', sets: '', reps: '', weight: '', rest: '' }],
                            duration: '', difficulty: 'beginner', notes: ''
                          })
                        }}
                        style={{ backgroundColor: '#f36100', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        {showExerciseForm ? 'Cancel' : 'Assign Exercise Plan'}
                      </button>
                    </div>
                    
                    {showExerciseForm && (
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        try {
                          const url = editingExercise ? `/api/exercises/${editingExercise._id}` : '/api/exercises'
                          const method = editingExercise ? 'PUT' : 'POST'
                          const response = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(exerciseForm)
                          })
                          if (response.ok) {
                            fetchExercises()
                            setShowExerciseForm(false)
                            setEditingExercise(null)
                            showToast(editingExercise ? 'Exercise plan updated!' : 'Exercise plan assigned!', 'success')
                          }
                        } catch (error) {
                          showToast('Error saving exercise plan', 'error')
                        }
                      }} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Member *</label>
                            <select 
                              value={exerciseForm.memberId}
                              onChange={(e) => {
                                const member = members.find(m => m._id === e.target.value)
                                setExerciseForm({...exerciseForm, memberId: e.target.value, memberName: member?.fullName || ''})
                              }}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="">Select Member</option>
                              {members.map(member => (
                                <option key={member._id} value={member._id}>{member.fullName || member.name}</option>
                              ))}
                            </select>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Plan Name *</label>
                            <input 
                              type="text" 
                              placeholder="Enter plan name" 
                              value={exerciseForm.planName}
                              onChange={(e) => setExerciseForm({...exerciseForm, planName: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Duration</label>
                            <input 
                              type="text" 
                              placeholder="e.g., 4 weeks" 
                              value={exerciseForm.duration}
                              onChange={(e) => setExerciseForm({...exerciseForm, duration: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Difficulty</label>
                            <select 
                              value={exerciseForm.difficulty}
                              onChange={(e) => setExerciseForm({...exerciseForm, difficulty: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description</label>
                            <textarea 
                              placeholder="Plan description" 
                              value={exerciseForm.description}
                              onChange={(e) => setExerciseForm({...exerciseForm, description: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Notes</label>
                            <textarea 
                              placeholder="Additional notes" 
                              value={exerciseForm.notes}
                              onChange={(e) => setExerciseForm({...exerciseForm, notes: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
                            />
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Exercises:</label>
                          {exerciseForm.exercises.map((exercise, index) => (
                            <div key={index} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
                              <div className="row">
                                <div className="col-md-3">
                                  <input 
                                    type="text" 
                                    placeholder="Exercise name" 
                                    value={exercise.name}
                                    onChange={(e) => {
                                      const newExercises = [...exerciseForm.exercises]
                                      newExercises[index].name = e.target.value
                                      setExerciseForm({...exerciseForm, exercises: newExercises})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px' }}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input 
                                    type="text" 
                                    placeholder="Sets" 
                                    value={exercise.sets}
                                    onChange={(e) => {
                                      const newExercises = [...exerciseForm.exercises]
                                      newExercises[index].sets = e.target.value
                                      setExerciseForm({...exerciseForm, exercises: newExercises})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px' }}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input 
                                    type="text" 
                                    placeholder="Reps" 
                                    value={exercise.reps}
                                    onChange={(e) => {
                                      const newExercises = [...exerciseForm.exercises]
                                      newExercises[index].reps = e.target.value
                                      setExerciseForm({...exerciseForm, exercises: newExercises})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px' }}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input 
                                    type="text" 
                                    placeholder="Weight" 
                                    value={exercise.weight}
                                    onChange={(e) => {
                                      const newExercises = [...exerciseForm.exercises]
                                      newExercises[index].weight = e.target.value
                                      setExerciseForm({...exerciseForm, exercises: newExercises})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px' }}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <input 
                                    type="text" 
                                    placeholder="Rest" 
                                    value={exercise.rest}
                                    onChange={(e) => {
                                      const newExercises = [...exerciseForm.exercises]
                                      newExercises[index].rest = e.target.value
                                      setExerciseForm({...exerciseForm, exercises: newExercises})
                                    }}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px' }}
                                  />
                                </div>
                                <div className="col-md-1">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newExercises = exerciseForm.exercises.filter((_, i) => i !== index)
                                      setExerciseForm({...exerciseForm, exercises: newExercises})
                                    }}
                                    style={{ padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => setExerciseForm({...exerciseForm, exercises: [...exerciseForm.exercises, { name: '', sets: '', reps: '', weight: '', rest: '' }]})}
                            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            + Add Exercise
                          </button>
                        </div>
                        
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                          {editingExercise ? 'Update Plan' : 'Assign Plan'}
                        </button>
                      </form>
                    )}
                    
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Member</th>
                            <th>Plan Name</th>
                            <th>Difficulty</th>
                            <th>Duration</th>
                            <th>Exercises</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercises.map((exercise) => (
                            <tr key={exercise._id}>
                              <td>{exercise.memberName}</td>
                              <td>{exercise.planName}</td>
                              <td>
                                <span style={{ 
                                  backgroundColor: exercise.difficulty === 'beginner' ? '#28a745' : exercise.difficulty === 'intermediate' ? '#ffc107' : '#dc3545',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {exercise.difficulty}
                                </span>
                              </td>
                              <td>{exercise.duration}</td>
                              <td>{exercise.exercises?.length || 0} exercises</td>
                              <td>{new Date(exercise.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => {
                                      setEditingExercise(exercise)
                                      setExerciseForm({
                                        memberId: exercise.memberId || '',
                                        memberName: exercise.memberName || '',
                                        planName: exercise.planName || '',
                                        description: exercise.description || '',
                                        exercises: exercise.exercises || [{ name: '', sets: '', reps: '', weight: '', rest: '' }],
                                        duration: exercise.duration || '',
                                        difficulty: exercise.difficulty || 'beginner',
                                        notes: exercise.notes || ''
                                      })
                                      setShowExerciseForm(true)
                                    }}
                                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm('Delete this exercise plan?')) {
                                        try {
                                          await fetch(`/api/exercises/${exercise._id}`, { method: 'DELETE' })
                                          fetchExercises()
                                          showToast('Exercise plan deleted', 'success')
                                        } catch (error) {
                                          showToast('Error deleting plan', 'error')
                                        }
                                      }
                                    }}
                                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {activeTab === 'quotes' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Inspirational Quotes</h3>
                      <button 
                        onClick={() => {
                          setShowQuoteForm(!showQuoteForm)
                          setEditingQuote(null)
                          setQuoteForm({ text: '', author: '', position: '', category: 'motivation', isActive: true })
                        }}
                        style={{
                          backgroundColor: '#f36100',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showQuoteForm ? 'Cancel' : 'Add Quote'}
                      </button>
                    </div>
                    {showQuoteForm && (
                      <form onSubmit={handleQuoteSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                        <div className="row">
                          <div className="col-md-8">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Quote Text *</label>
                            <textarea 
                              placeholder="Enter inspirational quote" 
                              value={quoteForm.text}
                              onChange={(e) => setQuoteForm({...quoteForm, text: e.target.value})}
                              required
                              style={{ width: '100%', padding: '15px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '120px' }}
                            />
                          </div>
                          <div className="col-md-4">
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Author *</label>
                            <input 
                              type="text" 
                              placeholder="Author name" 
                              value={quoteForm.author}
                              onChange={(e) => setQuoteForm({...quoteForm, author: e.target.value})}
                              required
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Position/Title</label>
                            <input 
                              type="text" 
                              placeholder="e.g., Professional CrossFit Athlete" 
                              value={quoteForm.position}
                              onChange={(e) => setQuoteForm({...quoteForm, position: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Category</label>
                            <select 
                              value={quoteForm.category}
                              onChange={(e) => setQuoteForm({...quoteForm, category: e.target.value})}
                              style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                            >
                              <option value="motivation">Motivation</option>
                              <option value="fitness">Fitness</option>
                              <option value="success">Success</option>
                              <option value="discipline">Discipline</option>
                            </select>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                              <input 
                                type="checkbox" 
                                checked={quoteForm.isActive}
                                onChange={(e) => setQuoteForm({...quoteForm, isActive: e.target.checked})}
                                style={{ marginRight: '10px' }}
                              />
                              Active Quote
                            </label>
                          </div>
                        </div>
                        <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', cursor: 'pointer' }}>
                          {editingQuote ? 'Update Quote' : 'Add Quote'}
                        </button>
                      </form>
                    )}
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                          <tr>
                            <th>Quote</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quotes.map((quote) => (
                            <tr key={quote._id}>
                              <td style={{ maxWidth: '300px' }}>
                                <div style={{ fontSize: '14px', fontStyle: 'italic' }}>
                                  "{quote.text.substring(0, 100)}{quote.text.length > 100 ? '...' : ''}"
                                </div>
                              </td>
                              <td>
                                <strong>{quote.author}</strong>
                                {quote.position && <div style={{ fontSize: '12px', color: '#666' }}>{quote.position}</div>}
                              </td>
                              <td>
                                <span style={{ 
                                  backgroundColor: quote.category === 'motivation' ? '#28a745' : quote.category === 'fitness' ? '#ff5722' : quote.category === 'success' ? '#ffc107' : '#6c757d',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  textTransform: 'uppercase'
                                }}>
                                  {quote.category}
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  backgroundColor: quote.isActive ? '#d4edda' : '#f8d7da',
                                  color: quote.isActive ? '#155724' : '#721c24',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px'
                                }}>
                                  {quote.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button 
                                    onClick={() => editQuote(quote)}
                                    style={{
                                      backgroundColor: '#28a745',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => deleteQuote(quote._id)}
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 10px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '12px'
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'events' && (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h4 style={{ color: '#333', marginBottom: '20px' }}>Event Management</h4>
            <p style={{ color: '#666', marginBottom: '30px' }}>Create and manage academy events, competitions, and workshops</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/admin/events" className="btn btn-outline-primary" target="_blank">
                <i className="fas fa-calendar-alt me-2"></i>
                Manage Events
              </a>
              <a href="/dashboard" className="btn btn-outline-success">
                <i className="fas fa-chart-line me-2"></i>
                Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
      <Toast />
    </>
  )
}
