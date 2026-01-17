
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface ContactData {
  name: string;
  email: string;
  requirementType: string;
  description: string;
  urgency: string;
  documentUrls: string[];
  honeypot?: string;
}

interface StatusUpdateData {
  submissionId: string;
  clientName: string;
  clientEmail: string;
  newStatus: string;
  previousStatus: string;
}

export const sendContactEmail = functions.https.onCall(async (data: any, context) => {
  const { name, email, requirementType, description, urgency, documentUrls, honeypot } = data as ContactData;

  // Basic validation
  if (honeypot) {
    throw new functions.https.HttpsError("invalid-argument", "Bot detected.");
  }

  if (!name || !email || !requirementType || !description) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
  }

  // Here you would typically use a transactional email service like SendGrid or Mailgun
  // to send the email. For this example, we'''ll just log the data to the console.
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
  } catch (error: any) {
    console.error("Error saving to Firestore:", error);
    // Pass the actual error message back to the client for better debugging.
    const errorMessage = error.message || "An unknown Firestore error occurred.";
    throw new functions.https.HttpsError("internal", `Could not save submission: ${errorMessage}`);
  }

  return { success: true };
});

export const sendStatusUpdateEmail = functions.https.onCall(async (data: any, context) => {
  const { submissionId, clientName, clientEmail, newStatus, previousStatus } = data as StatusUpdateData;

  if (!submissionId || !clientName || !clientEmail || !newStatus) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields.");
  }

  // Here you would typically use a transactional email service like SendGrid or Mailgun
  // to send the email. For this example, we'''ll just log the data to the console.
  console.log("Status update email for submission:", submissionId, {
    clientName,
    clientEmail,
    newStatus,
    previousStatus,
  });

  return { success: true };
});
