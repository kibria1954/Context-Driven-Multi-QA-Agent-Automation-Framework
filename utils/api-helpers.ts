/**
 * API Helpers — Hybrid API-assisted test setup and teardown routines.
 * Enables fast backend entity seeding without resorting to slow UI interactions.
 */
import { APIRequestContext, request } from '@playwright/test';
import { ENV } from './env';

export interface APICustomerPayload {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

/**
 * Perform direct HTTP API login and return session cookies / request context.
 */
export async function loginViaAPI(
  baseURL = ENV.BASE_URL,
  email = ENV.ADMIN_EMAIL,
  password = ENV.ADMIN_PASSWORD
): Promise<APIRequestContext> {
  const apiContext = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-QA-Agent': 'context-driven-ai-qa-agent',
    },
  });

  const response = await apiContext.post('/login', {
    form: {
      Email: email,
      Password: password,
    },
  });

  if (!response.ok() && response.status() !== 302) {
    throw new Error(`API Login failed with status ${response.status()}`);
  }

  return apiContext;
}

/**
 * Seed a customer entity directly via API.
 */
export async function createCustomerViaAPI(
  apiContext: APIRequestContext,
  payload: APICustomerPayload
): Promise<{ success: boolean; email: string }> {
  try {
    const response = await apiContext.post('/Admin/Customer/Create', {
      form: {
        Email: payload.email,
        FirstName: payload.firstName,
        LastName: payload.lastName,
        Company: payload.company || 'QA Auto Test Corp',
        Active: true,
      },
    });

    return {
      success: response.ok() || response.status() === 302,
      email: payload.email,
    };
  } catch (error) {
    console.warn('⚠️ createCustomerViaAPI failed:', (error as Error).message);
    return { success: false, email: payload.email };
  }
}
