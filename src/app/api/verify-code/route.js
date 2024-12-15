import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request) {
    await dbConnect();

    try {
        const { username, verifyCode } = await request.json();

        console.log("username ; ",username)
        console.log("verifyCode ; ",verifyCode)

        const decodedusername = decodeURIComponent(username);
        console.log("decodedusername ; ",decodedusername)
        /* The line const decodedusername = decodeURIComponent(username) is used to decode a URL-encoded string, where special characters are replaced by escape sequences. Here's a detailed explanation:
        How It Works
        URL encoding is used to ensure that special characters in a string are safely transmitted in a URL. For example:
        A username like john doe would be encoded as john%20doe in a URL.
        decodeURIComponent converts john%20doe back to john doe. */

        const user = await UserModel.findOne({ username: decodedusername });

        console.log("user : ",user)

        if (!user) {
            return Response.json({
                success: false,
                message: "User  not found"
            }, { status: 500 });
        }

        // If user is found, check if the verifyCode is valid and not expired
        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "Account Verified"
            }, { status: 200 });

        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification verifyCode has expired, please sign-up again to get a new verifyCode"
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification Code."
            }, { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying user: ", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 });
    }
}