export interface UpiPaymentIntent {
  intentId: string;
  orderNumber: string;
  amount: number;
  currency: 'INR';
  merchantVpa: string;
  merchantName: string;
  qrString: string;
  expiresInSeconds: number;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId: string;
  paymentMethod: 'upi' | 'card' | 'cash_on_pickup';
  timestamp: string;
  message: string;
}

export class LynkPaymentService {
  // Initiates a UPI payment session
  public static async createUpiIntent(amount: number, orderNumber: string, storeName: string): Promise<UpiPaymentIntent> {
    const merchantVpa = 'lynk.market@icici';
    const qrString = `upi://pay?pa=${merchantVpa}&pn=LYNK%20Market%20(${encodeURIComponent(storeName)})&am=${amount.toFixed(2)}&cu=INR&tn=Order%20${orderNumber}`;
    
    // In production, this call goes to server: /api/payment/create-intent
    return {
      intentId: `upi_intent_${Date.now()}`,
      orderNumber,
      amount,
      currency: 'INR',
      merchantVpa,
      merchantName: `LYNK • ${storeName}`,
      qrString,
      expiresInSeconds: 300,
    };
  }

  // Simulates or verifies UPI payment approval
  public static async verifyUpiPayment(intentId: string, vpa?: string): Promise<PaymentVerificationResult> {
    // Realistic simulated network delay
    await new Promise(resolve => setTimeout(resolve, 1400));

    const refNo = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    return {
      success: true,
      transactionId: `UPI-REF-${refNo}`,
      paymentMethod: 'upi',
      timestamp: new Date().toISOString(),
      message: `Payment of ₹INR successful via ${vpa || 'UPI Apps'}. Bank reference: ${refNo}`,
    };
  }

  // Simulates Card / Cash On Pickup confirmation
  public static async processAlternatePayment(method: 'card' | 'cash_on_pickup', amount: number): Promise<PaymentVerificationResult> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const refNo = Math.floor(10000000 + Math.random() * 90000000).toString();
    return {
      success: true,
      transactionId: `${method.toUpperCase()}-${refNo}`,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      message: method === 'cash_on_pickup' 
        ? 'Cash payment will be collected at store counter upon pickup.'
        : `Card payment approved. Ref #${refNo}`,
    };
  }
}
