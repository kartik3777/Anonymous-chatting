class APIfeature {
    constructor( query, queryString){
      this.query = query;
      this.queryString = queryString;
    }
  
    filter(){
      //Filtering
      const queryobj = { ...this.queryString};
      const exclude = ['page', 'sort', 'fields', 'limit'];
      exclude.forEach(el => delete queryobj[el]); // exlude will not be present in queryobj
  
      //Advanced Filtering
      //eg  ?rollno[gte]=230221
      let  queryStr = JSON.stringify(queryobj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log(JSON.parse(queryStr));
  
      this.query= this.query.find(JSON.parse(queryStr));
      // let query =  User.find(JSON.parse(queryStr)); // req.query filters according to queries given in url
      return this;
    }
    sort(){
      if(this.queryString.sort){
        //if we have to sort multiple things together we have pass it with space but in url we cant give space so we give ,
        const sortby = this.queryString.sort.split(',').join(' '); // spliting by, to arrays of strings and then joining them with space
        this.query = this.query.sort(sortby);
      }
      return this;
    }
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      }
      return this;
    }

    paginate(){
      const page = this.queryString.page*1 || 1;
      const limit = this.queryString.limit*1 || 8761; // it means by default it will be 100
      // const limit = this.queryString.limit*1 || 100; // it means by default it will be 100
      const skip = (page-1)* limit;
    //bcoz skip(x) will skip x data and start with x+1 
    //eg we have to find page=2&limit=10 then 1-10 data will be on page 1 and 11-20 will be on page 2 so we have to skip (2-1)*10 that is 10 data
      this.query = this.query.skip(skip).limit(limit);
  
     return this;
    }
  
  
  }

  module.exports = APIfeature;