export default async function handler(req, res) {
  if (req.method === 'GET') {
    const rules = {
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
    };
    res.status(200).json(rules);
  }

  if (req.method === 'PUT') {
    const { doorAccess, paymentReminders } = req.body;
    // In real app, save to database
    res.status(200).json({ success: true, message: 'Rules updated successfully' });
  }
}