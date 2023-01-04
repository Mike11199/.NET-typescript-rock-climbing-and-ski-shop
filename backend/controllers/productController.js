const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  try {
    let query = {};
    let queryCondition = false

    let priceQueryCondition = {};
    if (req.query.price) {
        queryCondition = true;
      priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    }
    let ratingQueryCondition = {};
    if (req.query.rating) {
        queryCondition = true;
      ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    }
    let categoryQueryCondition = {}
    const categoryName = req.params.categoryName || ""
    if(categoryName) {
        queryCondition = true
        let a = categoryName.replaceAll(",", "/")
        var regEx = new RegExp("^" + a)
        categoryQueryCondition = { category: regEx }
    }
    if(req.query.category) {
        queryCondition = true
        let a = req.query.category.split(",").map((item) => {
            if(item) return new RegExp("^" + item)
        })
        categoryQueryCondition = {
            category: { $in: a }
        }
    }

    if (queryCondition) {
      query = {
        $and: [priceQueryCondition, ratingQueryCondition, categoryQueryCondition],
      };
    }

    //pagination
    const pageNum = Number(req.query.pageNum) || 1;

    // sort by name, price etc.
    let sort = {};
    const sortOption = req.query.sort || "";
    if (sortOption) {
      let sortOpt = sortOption.split("_");
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);

    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};
module.exports = getProducts;

