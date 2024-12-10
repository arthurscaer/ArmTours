module.exports = {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:8002', 
    db: {
      host: process.env.DB_HOST || '172.18.0.2', 
      port: process.env.DB_PORT || '3307',     
      user: process.env.DB_USER || 'my_user',  
      password: process.env.DB_PASSWORD || 'my_password', 
      database: process.env.DB_NAME || 'my_database' 
    }
};
