import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const order = payload.record; // The new order record from the database trigger

    // Retrieve secrets from environment variables
    const whatsappToken = Deno.env.get('WHATSAPP_TOKEN');
    const whatsappPhoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    const adminWhatsappNumber1 = Deno.env.get('ADMIN_WHATSAPP_NUMBER_1');
    const adminWhatsappNumber2 = Deno.env.get('ADMIN_WHATSAPP_NUMBER_2');

    if (!whatsappToken || !whatsappPhoneNumberId) {
      console.error("Missing WhatsApp API credentials (token or phone number ID).");
      return new Response(JSON.stringify({ error: "Missing WhatsApp API credentials." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const adminNumbers = [];
    if (adminWhatsappNumber1) adminNumbers.push(adminWhatsappNumber1);
    if (adminWhatsappNumber2) adminNumbers.push(adminWhatsappNumber2);

    if (adminNumbers.length === 0) {
      console.warn("No admin WhatsApp numbers configured. Skipping notifications.");
      return new Response(JSON.stringify({ message: "No admin WhatsApp numbers configured." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const orderIdDisplay = order.order_number || order.id;
    const customerName = order.shipping_address?.name || 'A customer';
    const totalAmount = order.total_amount?.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) || 'N/A';
    const orderStatus = order.status || 'N/A';

    const messageBody = `🔔 New Order Alert! 🔔
Order ID: ${orderIdDisplay}
Customer: ${customerName}
Total Amount: ${totalAmount}
Status: ${orderStatus}

Please review the order in the admin dashboard.`;

    const notificationPromises = adminNumbers.map(async (number) => {
      const whatsappApiUrl = `https://graph.facebook.com/v19.0/${whatsappPhoneNumberId}/messages`; // Using v19.0

      const response = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: number,
          type: "text",
          text: {
            body: messageBody,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to send WhatsApp message to ${number}:`, errorData);
        throw new Error(`WhatsApp API error for ${number}: ${JSON.stringify(errorData)}`);
      }
      console.log(`WhatsApp notification sent to ${number} for order ${order.id}`);
      return response;
    });

    await Promise.all(notificationPromises);

    return new Response(JSON.stringify({ message: "Admin notifications processed successfully." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in notify-new-order Edge Function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});