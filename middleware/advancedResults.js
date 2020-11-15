const advancedResults = (model, populate) => async (req, res, next) => {
   
   let query
   
   //Copy req.query
   const reqQuery = { ... req.query }
   
   //Fields to exclude
   const removeFields = ['select', 'sort', 'page', 'limit']    //we dont want to match doc fields with these query parameters 
   
   //Loop over removeFields and delete them from reqQuery
   removeFields.forEach(param => delete reqQuery[param])
   
   //Create query string
   let queryStr = JSON.stringify(reqQuery)  //can do replace only in a string
   
   //Create operators ($gt, $gte, $etc)
   queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)  //whereever you get 'match' usko $match kardo, mongodb docs mei syntax jo h,vo banjaega
   
   // Select Fields
   let selectFields
   if (req.query.select) {
      selectFields = req.query.select.split(',').join(' ')    //select="name,adress" -> "name adress"
   } 
   
   //Sort
   let sortBy
   if (req.query.sort) {
      sortBy = req.query.sort.split(',').join(' ')
   } else {
      sortBy = { name: 1}
   }
   
   //Pagination
   const page = parseInt(req.query.page, 10) || 1         //it'll be a string,everything is a string by default i cant do multipli on string
   const limit = parseInt(req.query.limit, 10) || 25
   const startIndex = (page - 1) * limit
   const endIndex = page * limit
   const total = await model.countDocuments()
   
   // //Finding resource
   // query = await model.find(JSON.parse(queryStr), selectFields)
   // .sort(sortBy).limit(limit).skip(startIndex).populate(populate)
   
   if(populate) {
      //Finding resource
      query =  model.find(JSON.parse(queryStr), selectFields)
      .sort(sortBy).limit(limit).skip(startIndex).populate(populate)
   } else {
      //Finding resource
      query =  model.find(JSON.parse(queryStr), selectFields)
      .sort(sortBy).limit(limit).skip(startIndex)
   }
   
   //Executing query
   const results = await query
   
   //Pagination result
   const pagination = {}
   if (endIndex < total) {
      pagination.next = {
         page: page + 1,
         limit
      }
   }
   
   if(startIndex > 0) {
      pagination.prev = {
         page: page - 1,
         limit
      }
   }
   
   res.advancedResults = {
      success: true, 
      count: results.length,
      pagination,
      data: results
   }

   console.log(results.length)
   
   next()
}

module.exports = advancedResults