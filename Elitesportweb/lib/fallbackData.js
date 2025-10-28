// Fallback data when MongoDB is unavailable
export const fallbackMembers = [
  { _id: '1', memberId: 'ESA12345', fullName: 'John Doe', email: 'john@example.com', phone: '0771234567', status: 'active' },
  { _id: '2', memberId: 'ESA12346', fullName: 'Jane Smith', email: 'jane@example.com', phone: '0771234568', status: 'active' }
]

export const fallbackInstructors = [
  { _id: '1', name: 'Mike Johnson', specialization: ['crossfit'], experience: 5, email: 'mike@elite.com', phone: '0771234569' },
  { _id: '2', name: 'Sarah Wilson', specialization: ['karate'], experience: 8, email: 'sarah@elite.com', phone: '0771234570' },
  { _id: '3', name: 'David Brown', specialization: ['zumba'], experience: 3, email: 'david@elite.com', phone: '0771234571' }
]

export const fallbackClasses = [
  { _id: '1', name: 'CrossFit Basics', instructor: 'Mike Johnson', time: '09:00 AM', duration: 60, category: 'crossfit' },
  { _id: '2', name: 'Karate Training', instructor: 'Sarah Wilson', time: '10:30 AM', duration: 90, category: 'karate' },
  { _id: '3', name: 'Zumba Dance', instructor: 'David Brown', time: '06:00 PM', duration: 45, category: 'zumba' }
]

export const fallbackPosts = [
  { _id: '1', title: 'CrossFit Workout Basics', videoId: 'dQw4w9WgXcQ', category: 'crossfit', type: 'trending', isActive: true },
  { _id: '2', title: 'Karate Kata Forms', videoId: 'dQw4w9WgXcQ', category: 'karate', type: 'featured', isActive: true },
  { _id: '3', title: 'Zumba Dance Moves', videoId: 'dQw4w9WgXcQ', category: 'zumba', type: 'normal', isActive: true }
]