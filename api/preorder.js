const { createClient } = require('@supabase/supabase-js');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_FLAVORS = ['cobalt', 'forest', 'coral', 'hot-pink'];
const ALLOWED_PURCHASE_TYPES = ['one-time', 'subscribe'];
const MAX_QUANTITY = 20;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const { email, flavor, purchaseType, quantity, website, sourcePage } = req.body || {};

  // Honeypot: bots fill hidden fields humans never see. Report success without writing.
  if (website) {
    return res.status(200).json({ success: true });
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Enter a valid email address.' });
  }

  if (!ALLOWED_FLAVORS.includes(flavor)) {
    return res.status(400).json({ success: false, error: 'Select a flavor.' });
  }

  const safePurchaseType = ALLOWED_PURCHASE_TYPES.includes(purchaseType) ? purchaseType : 'one-time';
  const safeQuantity = Number.isInteger(quantity) && quantity > 0 && quantity <= MAX_QUANTITY ? quantity : 1;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    return res.status(500).json({ success: false, error: 'Server not configured. Try again later.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await supabase.from('preorders').insert({
    email: email.trim().toLowerCase(),
    flavor,
    purchase_type: safePurchaseType,
    quantity: safeQuantity,
    source_page: typeof sourcePage === 'string' ? sourcePage.slice(0, 100) : null,
  });

  if (error) {
    console.error('Supabase preorder insert failed:', error);
    return res.status(500).json({ success: false, error: 'Something went wrong. Try again.' });
  }

  return res.status(200).json({ success: true });
};
