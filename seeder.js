const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// Load env vars
dotenv.config({ path : './config/config.env' })

//Load models
const Bootcamp = require('./models/Bootcamp')

//Connect to DB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    'useCreateIndex': true
})

//Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf8"))

//Import data to db
const importData = async () => {
   try {
     await Bootcamp.create(bootcamps)
    
     console.log('Data created'.green.inverse)
   } catch (e) {
     console.error(e)
   }
}

//Delete data
const deleteData = async () => {
    try {
      await Bootcamp.deleteMany()

      console.log('Data deleted'.red.inverse)
    } catch (e) {
      console.error(e)
    }
}


if(process.argv[2] === '-i') {
    importData()
} else if(process.argv[2] === '-d') {
    deleteData()
}
