const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a course description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition fee']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})

//S
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    console.log('Calculating avg cost...'.blue)

    const obj = await this.aggregate([           
        {
            $match : { bootcamp: bootcampId }              //filters courses by bootcamp(Id),sends all those courses having {bootcampId}, to next stage
        },
        {
            $group: {
                _id: '$bootcamp',                          //group documents by 'bootcamp(Id)' field
                averageCost: { $avg: '$tuition'}
            }
        }
    ])
    // console.log((obj[0].averageCost / 10) * 10)
    try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
          averageCost: Math.ceil(obj[0].averageCost / 10) * 10
      })
    } catch (e) {
      console.error(e)
    }
}

// Call getAverageCost after save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)

//Courses will be associated with some bootcamp