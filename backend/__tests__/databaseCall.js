const mongoose = require("mongoose");
const Category = require("../models/CategoryModel");
require("dotenv").config();  

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
});

afterAll(async () => {
    await mongoose.connection.close();
})

test("Should save the category to the database", async() => {
    const mockCategory = {name: 'test category'};
    await Category.create(mockCategory);

    const insertedCategory = await Category.findOne({ name: "test category" });
    expect(insertedCategory.name).toEqual(mockCategory.name);

})

test("Should delete category", async () => {
    const category = await Category.findOne({ name: "test category" }).deleteOne();
    expect(category.name).toBeFalsy();
  });