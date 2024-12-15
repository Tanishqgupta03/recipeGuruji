import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Database is already connected.");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true, // Retain this as it's still relevant
        });

        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection error:", error.message);
        throw new Error("Failed to connect to the database.");
    }
};

/*if (mongoose.connection.readyState === 1) {
    console.log("Database is already connected.");
    return;
}
mongoose.connection.readyState tells us the current connection status:
0: disconnected
1: connected
2: connecting
3: disconnecting
If the database is already connected (readyState is 1), it logs a message and exits the function early using return.
Connecting to the MongoDB database:
javascript
Copy code
await mongoose.connect(process.env.MONGO, {
    useUnifiedTopology: true,
});
mongoose.connect() is used to establish a connection to the MongoDB database.
process.env.MONGO is a placeholder for your MongoDB connection string, which is typically stored in an environment variable for security reasons.
useUnifiedTopology: true is an option that ensures Mongoose uses the latest MongoDB drivers. */
