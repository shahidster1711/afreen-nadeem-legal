"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.sendContactEmail = functions.https.onCall(async (data, context) => {
    const { name, email, requirementType, description, urgency, documentUrls, honeypot } = data;
    // Basic validation
    if (honeypot) {
        throw new functions.https.HttpsError("invalid-argument", "Bot detected.");
    }
    if (!name || !email || !requirementType || !description) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
    }
    // Here you would typically use a transactional email service like SendGrid or Mailgun
    // to send the email. For this example, we'll just log the data to the console.
    console.log("New contact form submission:", {
        name,
        email,
        requirementType,
        description,
        urgency,
        documentUrls,
    });
    // You can also save the data to Firestore for your records
    try {
        await admin.firestore().collection("contact-submissions").add({
            name,
            email,
            requirementType,
            description,
            urgency,
            documentUrls,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    catch (error) {
        console.error("Error saving to Firestore:", error);
        throw new functions.https.HttpsError("internal", "Could not save submission.");
    }
    return { success: true };
});
//# sourceMappingURL=index.js.map