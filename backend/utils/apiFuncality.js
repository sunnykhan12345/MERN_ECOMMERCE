// class ApiFuncality {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }
//   Search() {
//     const keyword = this.queryStr.keyword
//       ? {
//           name: {
//             $regex: this.queryStr.keyword,
//             $options: "i",
//           },
//         }
//       : {};
//     console.log(keyword);
//     this.query = this.query({ ...keyword });
//     return this;
//   }
// }

// export default ApiFuncality;
class ApiFuncality {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  Search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const querycopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete querycopy[key]);
    this.query = this.query.find(querycopy);
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this
  }
}

export default ApiFuncality;
