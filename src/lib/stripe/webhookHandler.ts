import { Request, Response } from 'express';
import Stripe from 'stripe';
import { getStripeClient } from './stripeClient';
import { db } from '../db';
import { serverDb } from '../server/db';

/**
 * Handles incoming Stripe Webhooks with signature verification and event dispatching.
 */
export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['stripe-signature'];

  if (!signature || typeof signature !== 'string') {
    console.warn('[Stripe Webhook] Rejected: Missing or invalid stripe-signature header.');
    res.status(400).json({ error: 'Missing stripe-signature header' });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Stripe Webhook] Server configuration error: STRIPE_WEBHOOK_SECRET is not set.');
    res.status(500).json({ error: 'Stripe webhook secret is not configured on server' });
    return;
  }

  // Ensure we have the raw request body as Buffer or string for signature verification
  const rawBody: Buffer | string = req.body;
  if (!rawBody || (typeof rawBody !== 'string' && !Buffer.isBuffer(rawBody))) {
    console.warn('[Stripe Webhook] Rejected: Raw request body not received. Ensure raw body middleware is configured.');
    res.status(400).json({ error: 'Raw request body required for webhook signature verification' });
    return;
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Invalid webhook signature';
    console.warn(`[Stripe Webhook] Signature verification failed: ${errorMessage}`);
    res.status(400).json({
      error: 'Invalid Stripe signature',
      details: errorMessage
    });
    return;
  }

  // Safely log the verified event type without exposing confidential payload data
  console.log(`[Stripe Webhook] Verified event received: ${event.type} (ID: ${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Stripe Webhook] Processing checkout.session.completed - Session ID: ${session.id}, Customer: ${session.customer || 'guest'}, Mode: ${session.mode}`);
        
        const planId = session.metadata?.planId || 'pro';
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerEmail = session.customer_details?.email || session.customer_email;

        if (userId) {
          await serverDb.updateSubscription(userId, {
            status: 'active',
            planId,
            stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
            stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
          });
        } else if (customerEmail) {
          const user = await serverDb.findUserByEmail(customerEmail);
          if (user) {
            await serverDb.updateSubscription(user.id, {
              status: 'active',
              planId,
              stripeCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
              stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : undefined,
            });
          }
        }

        // Local fallback store
        if (session.metadata?.planId) {
          await db.setCurrentPlanId(session.metadata.planId);
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Processing customer.subscription.created - Subscription ID: ${subscription.id}, Status: ${subscription.status}`);
        
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
        if (customerId) {
          await serverDb.updateSubscriptionByCustomerId(customerId, {
            status: subscription.status,
            stripeSubscriptionId: subscription.id,
            currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : undefined,
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Processing customer.subscription.updated - Subscription ID: ${subscription.id}, Status: ${subscription.status}, CancelAtPeriodEnd: ${subscription.cancel_at_period_end}`);
        
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
        if (customerId) {
          await serverDb.updateSubscriptionByCustomerId(customerId, {
            status: subscription.status,
            stripeSubscriptionId: subscription.id,
            currentPeriodEnd: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : undefined,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Processing customer.subscription.deleted - Subscription ID: ${subscription.id}, Customer: ${subscription.customer}`);
        
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
        if (customerId) {
          await serverDb.updateSubscriptionByCustomerId(customerId, {
            status: 'canceled',
            planId: 'free',
          });
        }
        // Revert to free tier upon subscription cancellation
        await db.setCurrentPlanId('free');
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Processing invoice.paid - Invoice ID: ${invoice.id}, Amount: ${invoice.amount_paid} ${invoice.currency}, Customer: ${invoice.customer}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`[Stripe Webhook] Processing invoice.payment_failed - Invoice ID: ${invoice.id}, Amount Due: ${invoice.amount_due} ${invoice.currency}, Customer: ${invoice.customer}`);
        break;
      }

      default: {
        console.log(`[Stripe Webhook] Unhandled event type acknowledged: ${event.type}`);
        break;
      }
    }

    // Return HTTP 200 to acknowledge successful event processing
    res.status(200).json({ received: true, eventType: event.type });
  } catch (processError: unknown) {
    const errorMsg = processError instanceof Error ? processError.message : 'Event processing failure';
    console.error(`[Stripe Webhook] Error during event handling for ${event.type}:`, errorMsg);
    // Return 500 so Stripe knows to retry if downstream business logic fails
    res.status(500).json({ error: 'Failed to process webhook event', details: errorMsg });
  }
}
