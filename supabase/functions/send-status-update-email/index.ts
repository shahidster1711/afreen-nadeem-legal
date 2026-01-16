import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StatusUpdateRequest {
  submissionId: string;
  clientName: string;
  clientEmail: string;
  newStatus: string;
  previousStatus: string;
}

const statusMessages: Record<string, { subject: string; message: string }> = {
  in_review: {
    subject: "Your Legal Enquiry is Under Review",
    message: "Your request is now under review. Our team is carefully examining your requirements, and you'll hear from us shortly.",
  },
  awaiting_client: {
    subject: "Action Required: Additional Information Needed",
    message: "We need additional information to proceed with your request. Please check your email or contact us at your earliest convenience.",
  },
  responded: {
    subject: "Response to Your Legal Enquiry",
    message: "Good news! We have responded to your legal enquiry. Please check your email for the detailed response from our team.",
  },
  closed: {
    subject: "Your Legal Enquiry Has Been Resolved",
    message: "Your enquiry has been successfully resolved and closed. Thank you for choosing our services. We hope we were able to assist you, and please don't hesitate to reach out for any future legal needs.",
  },
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    new: "New",
    in_review: "In Review",
    awaiting_client: "Awaiting Your Response",
    responded: "Responded",
    closed: "Closed",
  };
  return labels[status] || status;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    new: "#3B82F6",
    in_review: "#EAB308",
    awaiting_client: "#F97316",
    responded: "#22C55E",
    closed: "#6B7280",
  };
  return colors[status] || "#6B7280";
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, clientName, clientEmail, newStatus, previousStatus }: StatusUpdateRequest = await req.json();

    console.log(`Processing status update email: ${previousStatus} -> ${newStatus} for ${clientEmail}`);

    // Don't send email for 'new' status or if status hasn't changed
    if (newStatus === "new" || newStatus === previousStatus) {
      console.log("Skipping email: no status change or new status");
      return new Response(
        JSON.stringify({ success: true, message: "No email sent - status unchanged or new" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const statusConfig = statusMessages[newStatus];
    if (!statusConfig) {
      console.log(`No email template for status: ${newStatus}`);
      return new Response(
        JSON.stringify({ success: true, message: `No email template for status: ${newStatus}` }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; padding: 12px 20px; background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); border-radius: 8px;">
                <span style="color: #d4af37; font-size: 24px; font-weight: bold; font-family: Georgia, serif;">⚖️ Afreen Nadeem</span>
              </div>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Legal Services</p>
            </div>

            <!-- Main Card -->
            <div style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
              <!-- Status Badge -->
              <div style="background: ${getStatusColor(newStatus)}; padding: 16px; text-align: center;">
                <span style="color: white; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  ${getStatusLabel(newStatus)}
                </span>
              </div>

              <!-- Content -->
              <div style="padding: 32px;">
                <h1 style="color: #1e293b; font-size: 22px; margin: 0 0 8px 0; font-family: Georgia, serif;">
                  Dear ${clientName},
                </h1>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                  ${statusConfig.message}
                </p>

                <!-- Status Update Info -->
                <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                  <p style="color: #64748b; font-size: 14px; margin: 0;">
                    <strong>Reference ID:</strong> ${submissionId.substring(0, 8).toUpperCase()}
                  </p>
                </div>

                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
                  If you have any questions or need further assistance, please don't hesitate to contact us.
                </p>

                <!-- Footer -->
                <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px;">
                  <p style="color: #475569; font-size: 14px; margin: 0 0 8px 0;">
                    Warm regards,
                  </p>
                  <p style="color: #1e3a5f; font-size: 16px; font-weight: 600; margin: 0; font-family: Georgia, serif;">
                    Afreen Nadeem
                  </p>
                  <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">
                    Legal Consultant
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer Note -->
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
              This is an automated notification. Please do not reply directly to this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Afreen Nadeem Legal Services <onboarding@resend.dev>",
        to: [clientEmail],
        subject: statusConfig.subject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const emailResponse = await res.json();
    console.log("Status update email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-status-update-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
