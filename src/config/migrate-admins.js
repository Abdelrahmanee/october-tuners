require('dotenv').config();
const mongoose = require('mongoose');

const migrate = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected');

    // Get the db instance
    const database = mongoose.connection.db;
    
    // Check if admins collection exists
    const collections = await database.listCollections({ name: 'admins' }).toArray();
    if (collections.length === 0) {
      console.log('No admins collection found. Nothing to migrate.');
      process.exit(0);
    }

    const admins = await database.collection('admins').find({}).toArray();
    if (admins.length > 0) {
      const usersToInsert = admins.map(admin => {
        return {
          ...admin,
          role: 'admin'
        };
      });

      await database.collection('users').insertMany(usersToInsert);
      console.log(`Migrated ${admins.length} admins to users collection.`);
    } else {
      console.log('Admins collection is empty.');
    }

    // Optionally rename or drop the old admins collection
    // await database.collection('admins').drop();
    console.log('Migration complete. You can safely drop the admins collection later.');
    
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
};

migrate();
