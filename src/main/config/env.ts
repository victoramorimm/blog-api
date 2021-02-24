export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/blog-ts-api',
  port: process.env.PORT || 5050
}
