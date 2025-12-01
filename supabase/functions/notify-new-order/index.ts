import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    console.log('🚀 === NOTIFY-NEW-ORDER EDGE FUNCTION TRIGGERED ===');
    console.log('📡 Request method:', req.method);
    console.log('📋 Payload received:', await req.text());
    
    const payload = await req.json();
    console.log('📦 Order record:', JSON.stringify(payload.record, null, 2));
    
    const order = payload.record;
    if (!order) {
      throw new Error('No order record in payload');
    }
    
    console.log(`✅ Processing NEW ORDER: ${order.id} (${order.order_number}) - Total: ₦${order.total_amount}`);

    // Retrieve WhatsApp secrets
    const secrets = {
      WHATSAPP_TOKEN: Deno.env.get('WHATSAPP_TOKEN'),
      WHATSAPP_PHONE_NUMBER_ID: Deno.env.get('WHATSAPP_PHONE_NUMBER_ID'),
      ADMIN_WHATSAPP_NUMBER_1: Deno.env.get('ADMIN_WHATSAPP_NUMBER_1'),
      ADMIN_WHATSAPP_NUMBER_2: Deno.env.get('ADMIN_WHATSAPP_NUMBER_2'),
    };
    
    const missingSecrets = Object.entries(secrets).filter(([k, v]) => !v).map(([k]) => k);
    if (missingSecrets.length > 0) {
      console.error('❌ MISSING SECRETS:', missingSecrets);
      return new Response(
        JSON.stringify({ error: `Missing secrets: ${missingSecrets.join(', ')}` }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminNumbers = [
      secrets.ADMIN_WHATSAPP_NUMBER_1,
      secrets.ADMIN_WHATSAPP_NUMBER_2
    ].filter(Boolean) as string[];

    if (adminNumbers.length === 0) {
      console.warn('⚠️ No admin WhatsApp numbers configured');
      return new Response(
        JSON.stringify({ message: 'No admin numbers configured' }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build detailed order message
    const orderItemsList = (order.items || []).slice(0, 5).map((item: any) => 
      `• ${item.product_name} (${item.quantity} ${item.unit_type || 'pcs'}) @ ₦${(item.unit_price || 0).toLocaleString('en-NG')}`
    ).join('\n') + (order.items.length > 5 ? '\n...and more' : '');

    const message = `🚨 *NEW ORDER ALERT!* 🚨

📋 *Order:* ${order.order_number || order.id}
👤 *Customer:* ${order.shipping_address?.name || 'N/A'}
📱 *Phone:* ${order.shipping_address?.phone || 'N/A'}
💰 *Total:* ₦${(order.total_amount || 0).toLocaleString('en-NG')}
🚚 *Delivery:* ${order.delivery_method || 'N/A'}

🛍️ *Items (${order.items?.length || 0}):*
${orderItemsList}

📍 *Shipping:*
${order.shipping_address?.address || 'N/A'}
${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''}

👉 *Admin Dashboard → Orders*`;

    console.log('📱 WhatsApp message ready (length:', message.length, ')');

    const whatsappApiUrl = `https://graph.facebook.com/v19.0/${secrets.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    // Send notifications to all admins
    const notificationPromises = adminNumbers.map(async (adminNumber, index) => {
      const whatsappPayload = {
        messaging_product: "whatsapp",
        to: adminNumber,
        type: "text",
        text: { body: message },
      };

      console.log(`📤 Sending to Admin ${index + 1}: ${adminNumber.substring(0, 8)}...`);

      const response = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secrets.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappPayload),
      });

      const responseData = await response.json();
      
      console.log(`📨 Admin ${index + 1} → Status: ${response.status}`, responseData);

      return {
        admin: adminNumber.substring(0, 8) + '...',
        success: response.ok,
        status: response.status,
        response: responseData
      };
    });

    const results = await Promise.all(notificationPromises);
    const successes = results.filter(r => r.success).length;
    
    console.log(`🎉 SUMMARY: ${successes}/${adminNumbers.length} notifications sent successfully`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `✅ Sent ${successes}/${adminNumbers.length} notifications`,
        results,
        order_id: order.id
      }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('💥 EDGE FUNCTION ERROR:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});