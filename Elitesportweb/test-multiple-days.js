// Test script to verify multiple days functionality
const testClass = {
  name: 'CrossFit Basics',
  category: 'crossfit',
  instructor: 'John Doe',
  days: ['Monday', 'Wednesday', 'Friday'],
  time: '18:00',
  duration: 60,
  capacity: 20,
  description: 'Basic CrossFit training for beginners',
  isOnline: false,
  admissionFee: 1000,
  fees: {
    monthly: 5000,
    sixMonthly: 25000,
    annually: 45000
  }
}

console.log('Test Class with Multiple Days:')
console.log('Name:', testClass.name)
console.log('Days:', testClass.days.join(', '))
console.log('Time:', testClass.time)
console.log('Full Schedule:', `${testClass.days.join(', ')} at ${testClass.time}`)

// Test backward compatibility
const legacyClass = {
  name: 'Karate Advanced',
  category: 'karate',
  instructor: 'Jane Smith',
  day: 'Tuesday', // Legacy single day field
  time: '19:00',
  duration: 90,
  capacity: 15
}

console.log('\nLegacy Class (single day):')
console.log('Name:', legacyClass.name)
console.log('Day:', legacyClass.day)
console.log('Days fallback:', legacyClass.days ? legacyClass.days.join(', ') : legacyClass.day)