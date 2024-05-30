class ApiQuery {
    constructor(data, queryStr) {
        this.data = data;
        this.queryStr = queryStr;
    }

    filter() {
        const queryStr = JSON.stringify(this.queryStr);
        const replacedStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(replacedStr);
        this.data = this.data.find(queryObj);
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortStr = this.queryStr.sort.split(',').join(' ');
            this.data = this.data.sort(sortStr);
        } else {
            this.data = this.data.sort('-__v');
        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fieldStr = this.queryStr.fields.split(',').join(' ');
            this.data = this.data.select(fieldStr);
        } else {
            this.data = this.data.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.data = this.data.skip(skip).limit(limit);

        // if (this.queryStr.page) {
            // const dataLength = Movie.countAllDocuments();
            // if (skip >= dataLength) {
            //     throw new Error("This page doesn't exist!")
            // }
        // }
        return this;
    }
}

module.exports = ApiQuery;