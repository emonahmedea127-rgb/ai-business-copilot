import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

/**
 * Lazy initialization of the Stripe SDK client to avoid startup crashes
 * when environment variables are not yet provided.
 */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not configured');
    }
    stripeClient = new Stripe(apiKey);
  }
  return stripeClient;
}

/**
 * Safe accessor for the Stripe Webhook signing secret.
 */
export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not configured');
  }
  return secret;
}
