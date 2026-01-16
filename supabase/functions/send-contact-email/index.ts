import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  requirementType: string;
  description: string;
  urgency: string;
  honeypot?: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

async function sendEmail(payload: ResendEmailPayload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return res.json();
}

const urgencyLabels: Record<string, string> = {
  normal: "Normal (5-7 days)",
  priority: "Priority (2-3 days)",
  urgent: "Urgent (24-48 hours)",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactFormRequest = await req.json();
    
    // Spam protection - honeypot field
    if (data.honeypot) {
      console.log("Spam detected - honeypot field filled");
      return new Response(
        JSON.stringify({ success: true, message: "Form submitted successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate required fields
    if (!data.name || !data.email || !data.requirementType || !data.description) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error("Invalid email format:", data.email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const timestamp = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Send notification email to Afreen
    await sendEmail({
      from: "Afreen Nadeem Legal <onboarding@resend.dev>",
      to: ["afreennadeem.legal@gmail.com"],
      subject: `New Legal Enquiry: ${data.requirementType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, serif; line-height: 1.6; color: #1a2744; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a2744 0%, #2a3a5a 100%); color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0; }
            .label { font-weight: bold; color: #1a2744; display: block; margin-bottom: 5px; }
            .value { color: #4a5568; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">New Legal Enquiry</h1>
              <p style="margin: 10px 0 0; opacity: 0.9;">${timestamp}</p>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Client Name</span>
                <span class="value">${data.name}</span>
              </div>
              <div class="field">
                <span class="label">Email Address</span>
                <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
              </div>
              <div class="field">
                <span class="label">Service Required</span>
                <span class="value">${data.requirementType}</span>
              </div>
              <div class="field">
                <span class="label">Urgency Level</span>
                <span class="value">${urgencyLabels[data.urgency] || 'Not specified'}</span>
              </div>
              <div class="field" style="border-bottom: none;">
                <span class="label">Requirement Description</span>
                <p class="value" style="white-space: pre-wrap; margin: 10px 0 0;">${data.description}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Notification email sent successfully");

    // Send confirmation email to client
    await sendEmail({
      from: "Afreen Nadeem Legal <onboarding@resend.dev>",
      to: [data.email],
      subject: "Thank you for your legal enquiry",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, serif; line-height: 1.6; color: #1a2744; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a2744 0%, #2a3a5a 100%); color: #fff; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
            .highlight { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c9a227; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px; font-weight: normal;">Afreen Nadeem</h1>
              <p style="margin: 10px 0 0; opacity: 0.9; font-size: 14px;">Legal Consultant | Drafting & Opinions</p>
            </div>
            <div class="content">
              <p>Dear ${data.name},</p>
              <p>Thank you for reaching out regarding your <strong>${data.requirementType}</strong> requirement. I have received your enquiry and will review it carefully.</p>
              <div class="highlight">
                <p style="margin: 0;"><strong>What happens next?</strong></p>
                <p style="margin: 10px 0 0;">I will review your requirement and respond within 24 hours with an initial assessment, scope of work, and engagement terms if applicable.</p>
              </div>
              <p>All communications are treated with strict confidentiality.</p>
              <p>Best regards,<br><strong>Afreen Nadeem</strong><br>B.A., LL.B | LL.M (Constitutional Law) | PhD (Pursuing)</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Enquiry submitted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send email";
    console.error("Error in send-contact-email function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
