import { decode } from 'bolt11';

export interface LightningInvoice {
  paymentRequest: string;
  amount: number;
  description: string;
  expiresAt: Date;
  paymentHash: string;
}

export interface PaymentStatus {
  paid: boolean;
  amount?: number;
  paidAt?: Date;
  error?: string;
}

export class LightningPaymentService {
  private static instance: LightningPaymentService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.REACT_APP_LIGHTNING_API_URL || 'http://localhost:3001/api/lightning';
  }

  public static getInstance(): LightningPaymentService {
    if (!LightningPaymentService.instance) {
      LightningPaymentService.instance = new LightningPaymentService();
    }
    return LightningPaymentService.instance;
  }

  async createInvoice(amount: number, description: string, expiryMinutes: number = 15): Promise<LightningInvoice> {
    try {
      const response = await fetch(`${this.baseUrl}/create-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          expiryMinutes
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create invoice: ${response.statusText}`);
      }

      const data = await response.json();
      const decoded = decode(data.paymentRequest);

      return {
        paymentRequest: data.paymentRequest,
        amount: decoded.millisatoshis ? Math.floor(decoded.millisatoshis / 1000) : amount,
        description: decoded.description || description,
        expiresAt: new Date(Date.now() + (expiryMinutes * 60 * 1000)),
        paymentHash: decoded.paymentHash || data.paymentHash
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create Lightning invoice');
    }
  }

  async checkPaymentStatus(paymentHash: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/check-payment/${paymentHash}`);
      
      if (!response.ok) {
        throw new Error(`Failed to check payment: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        paid: data.paid,
        amount: data.amount,
        paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
        error: data.error
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return {
        paid: false,
        error: 'Failed to check payment status'
      };
    }
  }

  async sendPayment(paymentRequest: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/send-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentRequest
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send payment: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        error: data.error
      };
    } catch (error) {
      console.error('Error sending payment:', error);
      return {
        success: false,
        error: 'Failed to send payment'
      };
    }
  }

  // WebLN integration for browser wallets
  async payWithWebLN(paymentRequest: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window !== 'undefined' && (window as any).webln) {
        await (window as any).webln.enable();
        const result = await (window as any).webln.sendPayment(paymentRequest);
        return {
          success: true
        };
      } else {
        return {
          success: false,
          error: 'WebLN not available'
        };
      }
    } catch (error) {
      console.error('WebLN payment error:', error);
      return {
        success: false,
        error: 'WebLN payment failed'
      };
    }
  }

  generateQRCodeData(paymentRequest: string): string {
    return `lightning:${paymentRequest}`;
  }
}

export const lightningService = LightningPaymentService.getInstance();