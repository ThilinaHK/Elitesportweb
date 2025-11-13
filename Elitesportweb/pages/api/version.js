import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const versionPath = path.join(process.cwd(), 'version.json')
      const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'))
      res.status(200).json(versionData)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read version' })
    }
  } else if (req.method === 'POST') {
    try {
      const versionPath = path.join(process.cwd(), 'version.json')
      const currentVersion = JSON.parse(fs.readFileSync(versionPath, 'utf8'))
      
      const newVersion = {
        ...currentVersion,
        build: currentVersion.build + 1,
        lastUpdated: new Date().toISOString().split('T')[0],
        ...req.body
      }
      
      fs.writeFileSync(versionPath, JSON.stringify(newVersion, null, 2))
      res.status(200).json(newVersion)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update version' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}