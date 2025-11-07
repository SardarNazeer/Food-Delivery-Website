import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://sardarnazeer:sardar2630@cluster0.i2h7mvh.mongodb.net/food-del"
    ).then(() => console.log("DB Connected"));
};
