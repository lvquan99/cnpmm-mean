const mongoose = require('mongoose')

let count = 0

const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections

  // The MongoDB driver also has its own buffering mechanism that kicks in when the driver is disconnected.
  // Set this option to 0 and set bufferCommands to false on your schemas 
  // if you want your database operations to fail immediately when the driver is not connected, 
  // as opposed to waiting for reconnection.
  bufferMaxEntries: 0,

  //  if you specify useNewUrlParser: true, you must specify a port in your connection string, 
  // like mongodb://localhost:27017/dbname. The new url parser does not support connection strings 
  // that do not have a port, like mongodb://localhost/dbname.
  useNewUrlParser: true,

  // False by default. Set to true to opt in to using the MongoDB driver's new connection management engine.
  // You should set this option to true, except for the unlikely case that it prevents you from maintaining
  //a stable connection.
  useUnifiedTopology: true,
}

const connectWithRetry = async () => {
  console.log('MongoDB connection with retry')
  try {
    await mongoose.connect('mongodb://localhost:27017/share_ute', options)
    console.log('MongoDB is connected')
  }
  catch (error) {
    console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', count++);
    setTimeout(connectWithRetry, 5000)
  }
}

connectWithRetry()

exports.mongoose = mongoose;