import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { captcha } from "better-auth/plugins";
import { db } from "@/lib/mongodb";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        captcha({
            provider: "google-recaptcha",
            secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY!,
            minScore: 0.5,
            endpoints: ["/sign-up/email"],
        }),
    ],
});
