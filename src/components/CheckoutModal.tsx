import React, { useState } from 'react';
import { 
  X, 
  Store as StoreIcon, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Copy,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, Store, Order } from '../types';
import { lynkStore, formatDistance } from '../lib/storage';
import { LynkPaymentService } from '../lib/paymentService';

interface CheckoutModalProps {
  product: Product;
  store: Store;
  price: number;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  store,
  price,
  onClose,
  onOrderCompleted,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash_on_pickup'>('upi');
  const [upiId, setUpiId] = useState<string>('aarav@okaxis');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Plot 42, Baya Baba Matha Lane, Unit 3, Bhubaneswar 751001');
  const [phone, setPhone] = useState<string>('+91 98765 43210');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);

  const deliveryFee = fulfillmentType === 'delivery' ? 49 : 0;
  const totalAmount = price + deliveryFee;
  const currentUser = lynkStore.getCurrentUser();

  const handleProcessOrder = async () => {
    setIsProcessing(true);

    try {
      if (paymentMethod === 'upi') {
        const intent = await LynkPaymentService.createUpiIntent(totalAmount, 'PRE-LNK', store.name);
        await LynkPaymentService.verifyUpiPayment(intent.intentId, upiId);
      } else {
        await LynkPaymentService.processAlternatePayment(paymentMethod, totalAmount);
      }

      // Create confirmed order in storage
      const newOrder = lynkStore.createOrder({
        customerId: currentUser.id,
        storeId: store.id,
        storeName: store.name,
        items: [
          {
            productId: product.id,
            productName: product.name,
            brand: product.brand,
            imageUrl: product.imageUrl,
            quantity: 1,
            unitPrice: price,
          },
        ],
        totalAmount,
        fulfillmentType,
        paymentMethod,
        deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
        contactPhone: phone,
      });

      setConfirmedOrder(newOrder);

      // Trigger celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignored
      }
    } catch (err) {
      alert('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative text-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedOrder ? (
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>LYNK Express Checkout</span>
            </div>

            <h3 className="font-display font-extrabold text-2xl text-slate-950 mt-1">
              Complete Your Order
            </h3>

            {/* Product Summary */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  Fulfilling at: <strong>{store.name}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="font-display font-extrabold text-base text-slate-950">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 1. Fulfillment Mode Toggle */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                1. Choose Fulfillment Method
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    fulfillmentType === 'pickup'
                      ? 'bg-blue-50/90 border-blue-600 ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <StoreIcon className={`w-5 h-5 ${fulfillmentType === 'pickup' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      FREE
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-slate-900">In-Store Counter Pickup</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Ready in 10-15 mins</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    fulfillmentType === 'delivery'
                      ? 'bg-blue-50/90 border-blue-600 ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className={`w-5 h-5 ${fulfillmentType === 'delivery' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      ₹49
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-slate-900">Express Local Delivery</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Doorstep in ~2 hours</div>
                  </div>
                </button>
              </div>

              {/* Dynamic Fulfillment details */}
              {fulfillmentType === 'pickup' ? (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">{store.name}</span>
                    <p className="text-[11px] text-slate-600">{store.address}</p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Counter staff will keep it packaged and ready for handover.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Delivery Address:
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none"
                    placeholder="Enter complete house address, street, landmark..."
                  />
                </div>
              )}
            </div>

            {/* 2. Payment Method */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                2. Select Payment Method
              </label>

              <div className="space-y-2">
                {/* UPI */}
                <div 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'bg-blue-50/80 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        UPI
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Instant UPI (GPay / PhonePe / Paytm / CRED)</div>
                        <div className="text-[10px] text-emerald-600 font-semibold">Fastest & Recommended</div>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-blue-100 flex flex-col sm:flex-row items-center gap-3">
                      {/* Simulated QR Code */}
                      <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-300 flex flex-col items-center justify-center shrink-0">
                        <QrCode className="w-16 h-16 text-slate-800" />
                        <span className="text-[8px] font-bold text-slate-500 -mt-1">SCAN QR</span>
                      </div>
                      <div className="flex-1 w-full">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Or Enter UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 mt-0.5 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'bg-blue-50/80 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>

                {/* Cash On Pickup */}
                <div 
                  onClick={() => setPaymentMethod('cash_on_pickup')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_pickup' ? 'bg-blue-50/80 border-blue-600' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">
                        {fulfillmentType === 'pickup' ? 'Pay Cash at Store Counter' : 'Cash on Delivery'}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cash_on_pickup' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'cash_on_pickup' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Item Subtotal</span>
                <span>₹{price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fulfillment Fee</span>
                <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'FREE (Pickup)'}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Payable</span>
                <span className="text-blue-700 font-display text-base">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button
                id="submit-payment-order-btn"
                disabled={isProcessing}
                onClick={handleProcessOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Bank / Store…</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display font-extrabold text-2xl text-slate-950">
              Payment & Order Successful!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your order has been transmitted directly to <strong>{store.name}</strong>
            </p>

            {/* Order Card */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="text-slate-500">Order Number</span>
                <span className="font-mono font-bold text-slate-900">{confirmedOrder.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Estimated Timeline</span>
                <span className="font-semibold text-emerald-700">{confirmedOrder.estimatedTime}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Paid</span>
                <span className="font-bold text-slate-900">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Method</span>
                <span className="uppercase text-slate-700 font-semibold">{confirmedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* In-store Pickup code if pickup */}
            {confirmedOrder.fulfillmentType === 'pickup' && (
              <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Show Counter Pickup Code
                </span>
                <span className="font-mono font-extrabold text-2xl text-blue-950 tracking-widest block mt-0.5">
                  {confirmedOrder.orderNumber.split('-')[2]}
                </span>
                <span className="text-[11px] text-slate-600 block mt-1">
                  At {store.name} counter
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => onOrderCompleted(confirmedOrder)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                View in Orders
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
