const User = require('../models/User');
const Event = require('../models/Event');
const Ride = require('../models/Ride');
const Inspire = require('../models/Inspire');
const Podcast = require('../models/Podcast');
const Logo = require('../models/Logo');
const { ROLES } = require('../constants/roles');

const seed = async () => {
  try {
    // Admin — only seed if no admin exists
    const adminExists = await User.findOne({ email: 'admin@octobertuners.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@octobertuners.com',
        password: 'Admin@123',
        role: ROLES.ADMIN
      });
      console.log('✔ Admin seeded');
    }

    // Logos
    const logoCount = await Logo.countDocuments();
    if (logoCount === 0) {
      await Logo.insertMany([
        { name: 'Shell', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png' },
        { name: 'Castrol', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/cinquanta/Castrol_logo.svg/2560px-Castrol_logo.svg.png' },
        { name: 'Bridgestone', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bridgestone_Logo.svg/2560px-Bridgestone_Logo.svg.png' },
      ]);
      console.log('✔ Logos seeded');
    }

    // Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        {
          year: 2023,
          category: 'Summer Events',
          destination_en: 'Cairo',
          destination_ar: 'القاهرة',
          date: new Date('2023-07-10'),
          title_en: 'Summer Drift 2023',
          title_ar: 'سمر درفت 2023',
          carsJoined: 110,
          exhibitors: 12,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png', name: 'Shell' }],
          sponsorsDisplayStyle: 'marquee',
          youtubeMain: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          reels: ['https://www.youtube.com/shorts/pESVmIVFoFY'],
          gallery: [
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          ],
          theme_en: 'Desert Heat',
          theme_ar: 'حرارة الصحراء',
          colorPalette: ['#FF4500', '#FFD700'],
        },
        {
          year: 2024,
          category: 'OT Market',
          destination_en: 'Alexandria',
          destination_ar: 'الإسكندرية',
          date: new Date('2024-04-20'),
          title_en: 'OT Market Spring 2024',
          title_ar: 'سوق أوكتوبر ربيع 2024',
          carsJoined: 200,
          exhibitors: 30,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/cinquanta/Castrol_logo.svg/2560px-Castrol_logo.svg.png', name: 'Castrol' }],
          sponsorsDisplayStyle: 'carousel',
          youtubeMain: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
          reels: ['https://www.youtube.com/shorts/H7zt0WARQEM'],
          gallery: [
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
            'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
          ],
          theme_en: 'Spring Vibes',
          theme_ar: 'أجواء الربيع',
          colorPalette: ['#00C896', '#1A1A2E'],
        },
        {
          year: 2024,
          category: 'Christmas',
          destination_en: 'New Cairo',
          destination_ar: 'القاهرة الجديدة',
          date: new Date('2024-12-24'),
          title_en: 'Christmas Cruise 2024',
          title_ar: 'كريسماس كروز 2024',
          carsJoined: 150,
          exhibitors: 20,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bridgestone_Logo.svg/2560px-Bridgestone_Logo.svg.png', name: 'Bridgestone' }],
          sponsorsDisplayStyle: 'marquee',
          youtubeMain: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          reels: ['https://www.youtube.com/shorts/CevxZvSJLk8'],
          gallery: [
            'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800',
          ],
          theme_en: 'Winter Wonderland',
          theme_ar: 'أرض الشتاء الساحرة',
          colorPalette: ['#C0392B', '#2ECC71'],
        },
      ]);
      console.log('✔ Events seeded');
    }

    // Rides
    const rideCount = await Ride.countDocuments();
    if (rideCount === 0) {
      await Ride.insertMany([
        {
          year: 2023,
          destination_en: 'Ain Sokhna',
          destination_ar: 'العين السخنة',
          date: new Date('2023-09-15'),
          title_en: 'Red Sea Ride 2023',
          title_ar: 'رايد البحر الأحمر 2023',
          carsJoined: 75,
          exhibitors: 5,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png', name: 'Shell' }],
          sponsorsDisplayStyle: 'marquee',
          youtubeMain: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
          reels: ['https://www.youtube.com/shorts/5qap5aO4i9A'],
          gallery: [
            'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800',
            'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800',
          ],
        },
        {
          year: 2024,
          destination_en: 'North Coast',
          destination_ar: 'الساحل الشمالي',
          date: new Date('2024-08-05'),
          title_en: 'North Coast Ride 2024',
          title_ar: 'رايد الساحل الشمالي 2024',
          carsJoined: 90,
          exhibitors: 8,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/cinquanta/Castrol_logo.svg/2560px-Castrol_logo.svg.png', name: 'Castrol' }],
          sponsorsDisplayStyle: 'carousel',
          youtubeMain: 'https://www.youtube.com/watch?v=ZyhrYis509A',
          reels: ['https://www.youtube.com/shorts/UBVbTkDCiOk'],
          gallery: [
            'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800',
            'https://images.unsplash.com/photo-1496144300411-8dd31ce145ba?w=800',
          ],
        },
      ]);
      console.log('✔ Rides seeded');
    }

    // Inspires
    const inspireCount = await Inspire.countDocuments();
    if (inspireCount === 0) {
      await Inspire.insertMany([
        {
          year: 2023,
          date: new Date('2023-11-01'),
          title_en: 'Inspire Vol. 1',
          title_ar: 'إنسباير الجزء الأول',
          carsJoined: 50,
          exhibitors: 6,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bridgestone_Logo.svg/2560px-Bridgestone_Logo.svg.png', name: 'Bridgestone' }],
          sponsorsDisplayStyle: 'marquee',
          youtubeMain: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          reels: ['https://www.youtube.com/shorts/BflKr8K1RXo'],
          gallery: [
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
          ],
        },
        {
          year: 2024,
          date: new Date('2024-03-20'),
          title_en: 'Inspire Vol. 2',
          title_ar: 'إنسباير الجزء الثاني',
          carsJoined: 65,
          exhibitors: 9,
          sponsors: [{ logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png', name: 'Shell' }],
          sponsorsDisplayStyle: 'carousel',
          youtubeMain: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
          reels: ['https://www.youtube.com/shorts/MtN1YnoL46Q'],
          gallery: [
            'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800',
            'https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=800',
          ],
        },
      ]);
      console.log('✔ Inspires seeded');
    }

    // Podcasts
    const podcastCount = await Podcast.countDocuments();
    if (podcastCount === 0) {
      await Podcast.insertMany([
        {
          year: 2023,
          title_en: 'OT Podcast Episode 1',
          title_ar: 'بودكاست أوكتوبر تيونرز الحلقة الأولى',
          youtubeUrl: 'https://www.youtube.com/watch?v=HQmmM_qwG4k',
          date: new Date('2023-10-01'),
        },
        {
          year: 2024,
          title_en: 'OT Podcast Episode 2',
          title_ar: 'بودكاست أوكتوبر تيونرز الحلقة الثانية',
          youtubeUrl: 'https://www.youtube.com/watch?v=tgbNymZ7vqY',
          date: new Date('2024-02-14'),
        },
      ]);
      console.log('✔ Podcasts seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seed;
