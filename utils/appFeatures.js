class AppFeatures {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    paginate(){
        const limit = this.queryStr.limit * 1 || 100
        const page = this.queryStr.page * 1 || 1
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this

    }
}