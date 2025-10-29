import dbConnect from '../../lib/mongodb'

export default async function handler(req, res) {
  try {
    await dbConnect()
    
    if (req.method === 'GET') {
      // Get contact information
      const contactInfo = await db.collection('contactInfo').findOne({})
      
      if (!contactInfo) {
        // Return default contact info if none exists
        const defaultContactInfo = {
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
        }
        return res.status(200).json(defaultContactInfo)
      }
      
      res.status(200).json(contactInfo)
    } 
    else if (req.method === 'PUT') {
      // Update contact information
      const contactData = req.body
      
      const result = await db.collection('contactInfo').replaceOne(
        {},
        {
          ...contactData,
          updatedAt: new Date()
        },
        { upsert: true }
      )
      
      res.status(200).json({ message: 'Contact information updated successfully', result })
    } 
    else {
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Contact info API error:', error)
    
    // Return fallback data on error
    if (req.method === 'GET') {
      const fallbackContactInfo = {
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
      }
      return res.status(200).json(fallbackContactInfo)
    }
    
    res.status(500).json({ error: 'Internal server error' })
  }
}