import { useState, useEffect } from 'react'

export default function DietPlanManager({ showToast }) {
  const [diets, setDiets] = useState([])
  const [classes, setClasses] = useState([])
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDietForm, setShowDietForm] = useState(false)
  const [editingDiet, setEditingDiet] = useState(null)
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [dietFilter, setDietFilter] = useState('all')
  const [dietSearch, setDietSearch] = useState('')
  
  const [dietForm, setDietForm] = useState({
    memberId: '',
    memberName: '',
    classId: '',
    className: '',
    planName: '',
    description: '',
    meals: [{ name: 'Breakfast', time: '08:00', foods: [''] }],
    calories: 0,
    duration: '1 week',
    notes: '',
    status: 'active'
  })

  useEffect(() => {
    fetchDiets()
    fetchClasses()
    fetchMembers()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchMembersByClass(selectedClass)
    } else {
      setFilteredMembers(members)
    }
  }, [selectedClass, members])

  const fetchDiets = async () => {
    try {
      const response = await fetch('/api/diet-plans')
      const data = await response.json()
      setDiets(data)
    } catch (error) {
      console.error('Error fetching diets:', error)
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

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const fetchMembersByClass = async (classId) => {
    try {
      const response = await fetch(`/api/members-by-class?classId=${classId}`)
      const data = await response.json()
      setFilteredMembers(data.members || [])
    } catch (error) {
      console.error('Error fetching members by class:', error)
      setFilteredMembers([])
    }
  }

  const handleDietSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingDiet ? `/api/diets/${editingDiet._id}` : '/api/diet-plans'
      const method = editingDiet ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dietForm,
          meals: dietForm.meals.filter(meal => meal.name && meal.foods.some(food => food.trim()))
        })
      })
      
      if (response.ok) {
        fetchDiets()
        setShowDietForm(false)
        setEditingDiet(null)
        resetDietForm()
        showToast(editingDiet ? 'Diet plan updated successfully!' : 'Diet plan assigned successfully!', 'success')
      } else {
        const error = await response.json()
        showToast(error.error || 'Error saving diet plan', 'error')
      }
    } catch (error) {
      console.error('Error saving diet plan:', error)
      showToast('Error saving diet plan', 'error')
    }
  }

  const resetDietForm = () => {
    setDietForm({
      memberId: '',
      memberName: '',
      classId: '',
      className: '',
      planName: '',
      description: '',
      meals: [{ name: 'Breakfast', time: '08:00', foods: [''] }],
      calories: 0,
      duration: '1 week',
      notes: '',
      status: 'active'
    })
  }

  const editDiet = (diet) => {
    setEditingDiet(diet)
    setDietForm({
      memberId: diet.memberId || '',
      memberName: diet.memberName || '',
      classId: diet.classId || '',
      className: diet.className || '',
      planName: diet.planName || '',
      description: diet.description || '',
      meals: diet.meals || [{ name: 'Breakfast', time: '08:00', foods: [''] }],
      calories: diet.calories || 0,
      duration: diet.duration || '1 week',
      notes: diet.notes || '',
      status: diet.status || 'active'
    })
    setShowDietForm(true)
  }

  const deleteDiet = async (id) => {
    if (confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await fetch(`/api/diets/${id}`, { method: 'DELETE' })
        fetchDiets()
        showToast('Diet plan deleted successfully', 'success')
      } catch (error) {
        console.error('Error deleting diet plan:', error)
        showToast('Error deleting diet plan', 'error')
      }
    }
  }

  const addMeal = () => {
    setDietForm({
      ...dietForm,
      meals: [...dietForm.meals, { name: '', time: '', foods: [''] }]
    })
  }

  const removeMeal = (index) => {
    const newMeals = dietForm.meals.filter((_, i) => i !== index)
    setDietForm({ ...dietForm, meals: newMeals })
  }

  const updateMeal = (index, field, value) => {
    const newMeals = [...dietForm.meals]
    newMeals[index][field] = value
    setDietForm({ ...dietForm, meals: newMeals })
  }

  const addFood = (mealIndex) => {
    const newMeals = [...dietForm.meals]
    newMeals[mealIndex].foods.push('')
    setDietForm({ ...dietForm, meals: newMeals })
  }

  const removeFood = (mealIndex, foodIndex) => {
    const newMeals = [...dietForm.meals]
    newMeals[mealIndex].foods = newMeals[mealIndex].foods.filter((_, i) => i !== foodIndex)
    setDietForm({ ...dietForm, meals: newMeals })
  }

  const updateFood = (mealIndex, foodIndex, value) => {
    const newMeals = [...dietForm.meals]
    newMeals[mealIndex].foods[foodIndex] = value
    setDietForm({ ...dietForm, meals: newMeals })
  }

  const getFilteredDiets = () => {
    let filtered = diets

    if (dietFilter !== 'all') {
      if (['1 week', '2 weeks', '1 month', '3 months', '6 months'].includes(dietFilter)) {
        filtered = filtered.filter(d => d.duration === dietFilter)
      } else if (['active', 'completed', 'paused'].includes(dietFilter)) {
        filtered = filtered.filter(d => d.status === dietFilter)
      } else {
        // Filter by class
        filtered = filtered.filter(d => d.classId === dietFilter)
      }
    }

    if (dietSearch) {
      const searchTerm = dietSearch.toLowerCase()
      filtered = filtered.filter(d => 
        (d.memberName || '').toLowerCase().includes(searchTerm) ||
        (d.planName || '').toLowerCase().includes(searchTerm) ||
        (d.description || '').toLowerCase().includes(searchTerm) ||
        (d.className || '').toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Diet Plan Management</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
          >
            <option value="all">All Plans ({diets.length})</option>
            <option value="active">Active ({diets.filter(d => d.status === 'active').length})</option>
            <option value="completed">Completed ({diets.filter(d => d.status === 'completed').length})</option>
            <option value="paused">Paused ({diets.filter(d => d.status === 'paused').length})</option>
            <option value="1 week">1 Week ({diets.filter(d => d.duration === '1 week').length})</option>
            <option value="2 weeks">2 Weeks ({diets.filter(d => d.duration === '2 weeks').length})</option>
            <option value="1 month">1 Month ({diets.filter(d => d.duration === '1 month').length})</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} ({diets.filter(d => d.classId === cls._id).length})
              </option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Search by member, plan name, or description" 
            value={dietSearch}
            onChange={(e) => setDietSearch(e.target.value)}
            style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px', minWidth: '250px' }}
          />
        </div>
        <button 
          onClick={() => {
            setShowDietForm(!showDietForm)
            setEditingDiet(null)
            resetDietForm()
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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Filter by Class (Optional)</label>
              <select 
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value)
                  const cls = classes.find(c => c._id === e.target.value)
                  setDietForm({
                    ...dietForm,
                    classId: e.target.value,
                    className: cls?.name || '',
                    memberId: '',
                    memberName: ''
                  })
                }}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">All Members</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name} ({cls.category})</option>
                ))}
              </select>

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Select Member *</label>
              <select 
                value={dietForm.memberId}
                onChange={(e) => {
                  const member = filteredMembers.find(m => m._id === e.target.value)
                  setDietForm({
                    ...dietForm,
                    memberId: e.target.value,
                    memberName: member?.fullName || member?.name || ''
                  })
                }}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Member</option>
                {filteredMembers.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.fullName || member.name} ({member.membershipType})
                  </option>
                ))}
              </select>

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Plan Name *</label>
              <input 
                type="text" 
                placeholder="e.g., Weight Loss Plan, Muscle Gain Plan" 
                value={dietForm.planName}
                onChange={(e) => setDietForm({...dietForm, planName: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
              />

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Description *</label>
              <textarea 
                placeholder="Describe the diet plan goals and guidelines" 
                value={dietForm.description}
                onChange={(e) => setDietForm({...dietForm, description: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
              />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Duration *</label>
              <select 
                value={dietForm.duration}
                onChange={(e) => setDietForm({...dietForm, duration: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="1 week">1 Week</option>
                <option value="2 weeks">2 Weeks</option>
                <option value="1 month">1 Month</option>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
              </select>

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Target Calories (per day)</label>
              <input 
                type="number" 
                placeholder="e.g., 2000" 
                value={dietForm.calories}
                onChange={(e) => setDietForm({...dietForm, calories: parseInt(e.target.value) || 0})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
              />

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Status</label>
              <select 
                value={dietForm.status}
                onChange={(e) => setDietForm({...dietForm, status: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>

              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Notes</label>
              <textarea 
                placeholder="Additional notes or instructions" 
                value={dietForm.notes}
                onChange={(e) => setDietForm({...dietForm, notes: e.target.value})}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h5 style={{ margin: 0, color: '#333' }}>Meal Plan</h5>
              <button 
                type="button"
                onClick={addMeal}
                style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                + Add Meal
              </button>
            </div>

            {dietForm.meals.map((meal, mealIndex) => (
              <div key={mealIndex} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h6 style={{ margin: 0, color: '#333' }}>Meal {mealIndex + 1}</h6>
                  {dietForm.meals.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeMeal(mealIndex)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <input 
                      type="text" 
                      placeholder="Meal name (e.g., Breakfast)" 
                      value={meal.name}
                      onChange={(e) => updateMeal(mealIndex, 'name', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <input 
                      type="time" 
                      value={meal.time}
                      onChange={(e) => updateMeal(mealIndex, 'time', e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="button"
                      onClick={() => addFood(mealIndex)}
                      style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}
                    >
                      + Add Food
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Foods:</label>
                  {meal.foods.map((food, foodIndex) => (
                    <div key={foodIndex} style={{ display: 'flex', marginBottom: '5px' }}>
                      <input 
                        type="text" 
                        placeholder="Food item (e.g., 2 slices whole wheat bread)" 
                        value={food}
                        onChange={(e) => updateFood(mealIndex, foodIndex, e.target.value)}
                        style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', marginRight: '5px' }}
                      />
                      {meal.foods.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeFood(mealIndex, foodIndex)}
                          style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
            {editingDiet ? 'Update Diet Plan' : 'Assign Diet Plan'}
          </button>
        </form>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0 }}><strong>Showing: {getFilteredDiets().length} / {diets.length} Diet Plans</strong></p>
        <button 
          onClick={() => {
            setDietFilter('all')
            setDietSearch('')
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Loading diet plans...</p>
        </div>
      ) : getFilteredDiets().length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>{diets.length === 0 ? 'No diet plans assigned yet.' : 'No diet plans found matching your search.'}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
              <tr>
                <th>Member</th>
                <th>Plan Name</th>
                <th>Class</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Meals</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredDiets().map((diet) => (
                <tr key={diet._id}>
                  <td>
                    <strong>{diet.memberName}</strong>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {diet.description.substring(0, 30)}...
                    </div>
                  </td>
                  <td>{diet.planName}</td>
                  <td>
                    {diet.className ? (
                      <span style={{ 
                        backgroundColor: '#e3f2fd', 
                        color: '#1976d2', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {diet.className}
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>General</span>
                    )}
                  </td>
                  <td>{diet.duration}</td>
                  <td>{diet.calories ? `${diet.calories} cal` : 'N/A'}</td>
                  <td>{diet.meals?.length || 0} meals</td>
                  <td>
                    <span style={{ 
                      backgroundColor: diet.status === 'active' ? '#d4edda' : diet.status === 'completed' ? '#cce5ff' : '#fff3cd',
                      color: diet.status === 'active' ? '#155724' : diet.status === 'completed' ? '#004085' : '#856404',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {diet.status}
                    </span>
                  </td>
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
      )}
    </>
  )
}