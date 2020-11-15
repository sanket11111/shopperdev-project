const mongoose = require("mongoose");
const slugify = require("slugify"); //install
const geocoder = require("../utils/geocoder");

const BootcampSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      //enum is mongoose inbuilt validator, cheks if provided value is one of these values
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  toJSON: { virtuals: true },    //to add virtual fields
  toObject: { virtuals: true}
});

//Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  // console.log(this)
  next();
});

//Geocode and create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //do not save address in DB
  this.address = undefined
  next();
});

//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
  console.log(`Courses being removed`)
  await this.model('Course').deleteMany({ bootcamp : this._id })    //Course.deleteMany({ bootcamp: this._id}), bootcamp=bootcampId
  next()
})

//Reverse populate with viruals, now it has a courses virtual field, that can be populated
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',        //foreign key - key in 'course' collection, Bootcamp._id == Course.bootcamp
  justOne: false                   //can map to many courses
})

module.exports = mongoose.model("Bootcamp", BootcampSchema);

//appreciate it,
//mongoose inbuilt validators

//Mongoose middlewares that can be fired 'pre' before an event, or post an event
//go to mongoose docs to see list of middlewares and events
//possibilities mongoose mei 

//Tip: Dont worry about memorising these stuff, just see what all possibilities, functionality mongoose has to offer
//aise dekho


//Relationships - when a resource gets delete, you would want to delete the resouces associated with it or
 //coming out of it, Why would you want  to keep their courses, if institution doesnt exist