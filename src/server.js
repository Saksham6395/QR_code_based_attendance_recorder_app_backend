const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await pool.query('SELECT 1'); // test DB
    console.log('✅ Database reachable');

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
