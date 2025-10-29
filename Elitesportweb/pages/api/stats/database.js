import dbConnect from '../../../lib/mongodb'
import Member from '../../../models/Member'
import Class from '../../../models/Class'
import Instructor from '../../../models/Instructor'
import Payment from '../../../models/Payment'
import Event from '../../../models/Event'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const [
      membersCount,
      classesCount,
      instructorsCount,
      paymentsCount,
      eventsCount,
      totalPayments,
      recentMembers,
      activeEvents
    ] = await Promise.all([
      Member.countDocuments(),
      Class.countDocuments(),
      Instructor.countDocuments(),
      Payment.countDocuments(),
      Event.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Member.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      Event.countDocuments({ status: 'active', date: { $gte: new Date() } })
    ])

    const stats = {
      collections: {
        members: membersCount,
        classes: classesCount,
        instructors: instructorsCount,
        payments: paymentsCount,
        events: eventsCount
      },
      totals: {
        revenue: totalPayments[0]?.total || 0,
        recentMembers,
        activeEvents
      },
      storage: {
        estimatedSize: (membersCount * 2 + classesCount * 1 + instructorsCount * 1.5 + paymentsCount * 0.5 + eventsCount * 1.2).toFixed(2) + ' KB'
      }
    }

    res.status(200).json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch database stats' })
  }
}