const router = require('express').Router();
const Event = require('../../models/Event');
const Ride = require('../../models/Ride');
const Inspire = require('../../models/Inspire');
const Podcast = require('../../models/Podcast');
const auth = require('../../middleware/auth');
const ApiResponse = require('../../utils/ApiResponse');

const TYPES = { events: Event, rides: Ride, inspires: Inspire, podcasts: Podcast };

const buildProjection = (lang) => {
  if (!lang || !['en', 'ar'].includes(lang)) return {};
  const other = lang === 'en' ? 'ar' : 'en';
  return { [`title_${other}`]: 0, [`destination_${other}`]: 0, [`theme_${other}`]: 0 };
};

// GET /api/journey/timeline?year=2024&lang=en&type=events
router.get('/', async (req, res) => {
  const api = new ApiResponse(res);
  const { year, lang, type } = req.query;

  if (!year || isNaN(year))
    return api.error({ message: 'year query param is required and must be a number', statusCode: 400 });

  const filter = { year: parseInt(year) };
  const projection = buildProjection(lang);

  try {
    // single type requested
    if (type) {
      if (!TYPES[type])
        return api.error({ message: `Invalid type. Allowed: ${Object.keys(TYPES).join(', ')}`, statusCode: 400 });

      const data = await TYPES[type].find(filter, projection).sort({ date: 1 });
      return api.success({ data: { year: parseInt(year), [type]: data }, message: 'Timeline fetched' });
    }

    // all types in parallel
    const [events, rides, inspires, podcasts] = await Promise.all([
      Event.find(filter, projection).sort({ date: 1 }),
      Ride.find(filter, projection).sort({ date: 1 }),
      Inspire.find(filter, projection).sort({ date: 1 }),
      Podcast.find(filter, projection).sort({ date: 1 }),
    ]);

    return api.success({
      data: { year: parseInt(year), events, rides, inspires, podcasts },
      message: 'Timeline fetched',
    });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

// GET /api/journey/timeline/years — returns all distinct years that have data
router.get('/years', async (req, res) => {
  const api = new ApiResponse(res);
  try {
    const [e, r, i, p] = await Promise.all([
      Event.distinct('year'),
      Ride.distinct('year'),
      Inspire.distinct('year'),
      Podcast.distinct('year'),
    ]);
    const years = [...new Set([...e, ...r, ...i, ...p])].filter(Boolean).sort((a, b) => b - a);
    return api.success({ data: years, message: 'Available years fetched' });
  } catch (err) {
    return api.error({ message: err.message });
  }
});

module.exports = router;
