import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log(`La variable d'environnement MONGO_URI n'est pas définie.`);
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database .....");
  } catch (error: any) {
    console.log(
      `erreur lors de la connexion à la base de données: ${error.message}`
    );
  }
};
