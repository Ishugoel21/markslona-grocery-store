import mongoose from "mongoose";
import 'dotenv/config.js'
import {Product,Category} from './src/models/index.js'
import { categories, products } from "./seedData.js";

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        await Product.deleteMany({});
        await Category.deleteMany({});

        const categoryDocs = await Category.insertMany(categories);
        const categoryMap = categoryDocs.reduce((map,category) =>{
            map[category.name] = category._id;
            return map;
        },{})

        const productWithcategoryIds = products.map((products)=>({
            ...products,
            category:categoryMap[products.category]
        }));
          

        await Product.insertMany(productWithcategoryIds);

        console.log("DATABASE SEED SUCCESFULLY")

    } catch (error) {
        console.log("error seeding databse",error);
    }finally{
        mongoose.connection.close();
    }
}
seedDatabase();