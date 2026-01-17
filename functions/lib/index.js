"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStatusUpdateEmail = exports.sendContactEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
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
        await admin.firestore().collection("contact_submissions").add({
            name,
            email,
            requirement_type: requirementType,
            description,
            urgency,
            document_urls: documentUrls,
            status: 'new',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    catch (error) {
        console.error("Error saving to Firestore:", error);
        throw new functions.https.HttpsError("internal", "Could not save submission.");
    }
    return { success: true };
});
exports.sendStatusUpdateEmail = functions.https.onCall(async (data, context) => {
    const { submissionId, clientName, clientEmail, newStatus, previousStatus } = data;
    if (!submissionId || !clientName || !clientEmail || !newStatus) {
        throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
    }
    // Here you would typically use a transactional email service like SendGrid or Mailgun
    // to send the email. For this example, we'll just log the data to the console.
    console.log("Status update email for submission:", submissionId, {
        clientName,
        clientEmail,
        newStatus,
        previousStatus,
    });
    return { success: true };
});
//# sourceMappingURL=index.js.map