import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../db/client'
const getLink = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query['slug']
  if (!slug || typeof slug !== 'string') {
    res.statusCode = 404
    res.send(JSON.stringify({ message: 'Please use slug' }))
    return
  }
  const linkData = await prisma.shortLink.findUnique({
    where: {
      tag: slug,
    },
  })
  if (!linkData) {
    res.statusCode = 404
    res.send(JSON.stringify({ message: 'Link not found' }))
    return
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=1000000000, stale-while-revalidate')

  return res.json(linkData)
}
export default getLink
