import express from 'express'
import { load } from 'cheerio'

const router = express.Router()

router.get('/', async (req, res) => {
  const url = req.query.url as string
  if (!url) return res.status(400).json({ error: 'Missing url parameter' })

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch page: ${response.status}`)
    const html = await response.text()
    const $ = load(html)

    let titles: string[] = []

    if (url.includes('channelnewsasia.com') || url.includes('cna.')) {
      titles = $('.h6__link.list-object__heading-link')
        .map((_, el) => $(el).text().trim())
        .get()
        .slice(0, 6)
    } else if (url.includes('lionsbefrienders.org.sg')) {
      const unwantedExact = new Set([
        'Workshop & Trainings',
        'About Us',
        'Course Overview',
      ])

      const selectors = [
        '.e-n-accordion-item-title-text',
        '.elementor-accordion .elementor-tab-title',
        '.elementor-accordion-title'
      ]

      const rawTitles: string[] = []
      for (const sel of selectors) {
        $(sel).each((_, el) => rawTitles.push($(el).text().trim()))
      }

      if (rawTitles.length === 0) {
        $('ol li, ul li').each((_, el) => rawTitles.push($(el).text().trim()))
      }

      titles = rawTitles
        .map(t => t.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .filter(t => !unwantedExact.has(t))
        .filter(t => /^\d+\.\s/.test(t) || t.length > 25)
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .slice(0, 10)

    } else if (url.includes('moh.gov.sg')) {
      const unwanted = ['Government officials', 'Other pages', 'Ministry of Health']
      titles = $('h2')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(t => t && !unwanted.some(u => t.includes(u)))
        .slice(0, 6)
    } else {
      // fallback – just grab h1/h2/h3
      titles = $('h1, h2, h3')
        .map((_, el) => $(el).text().trim())
        .get()
        .slice(0, 6)
    }

    res.json({ titles })
  } catch (err) {
    console.error('Scrape error:', err)
    res.status(500).json({ error: 'Failed to scrape titles' })
  }
})

export default router
