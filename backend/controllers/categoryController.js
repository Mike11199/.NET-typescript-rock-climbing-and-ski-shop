const Category = require("../models/CategoryModel")

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).sort({name: "asc"}).orFail()
        res.json(categories)
    } catch(error) {
        next(error)
    }
}
module.exports = getCategories
