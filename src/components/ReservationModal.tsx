import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  Store as StoreIcon, 
  CheckCircle2, 
  MapPin, 
  Copy, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, Store, Reservation } from '../types';
import { lynkStore, formatDistance } from '../lib/storage';

interface ReservationModalProps {
  product: Product;
  store: Store;
  price: number;
  onClose: () => void;
  onViewReservations: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  product,
  store,
  price,
  onClose,
  onViewReservations,
}) => {
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);

  const currentUser = lynkStore.getCurrentUser();

  const handleConfirmReservation = () => {
    const res = lynkStore.createReservation({
      customerId: currentUser.id,
      storeId: store.id,
      productId: product.id,
      quantity: 1,
      price,
    });

    setConfirmedReservation(res);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignored if confetti not available
    }
  };

  // 30 minute countdown timer for active reservation
  useEffect(() => {
    if (!confirmedReservation) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [confirmedReservation]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPickupCode = () => {
    if (confirmedReservation) {
      navigator.clipboard?.writeText(confirmedReservation.pickupCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative text-slate-900 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmedReservation ? (
          /* Step 1: Pre-Confirmation Details */
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>30-Minute Guaranteed Hold</span>
            </div>

            <h3 className="font-display font-extrabold text-2xl text-slate-950 mt-1">
              Reserve at Counter
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              No advance payment needed. The store will hold this unit for you for 30 minutes at the locked price.
            </p>

            {/* Product & Store Snapshot */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {product.brand}
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-display font-extrabold text-slate-950">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">
                    Locked Counter Price
                  </span>
                </div>
              </div>
            </div>

            {/* Target Store */}
            <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
              <StoreIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-slate-900">{store.name}</span>
                <p className="text-slate-600 mt-0.5">{store.address}</p>
                <p className="text-blue-700 font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {formatDistance(store.distanceKm || 0.5)} away • Estimated walk: {store.walkingMinutes || 7} min
                </p>
              </div>
            </div>

            {/* Terms reminder */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Free cancellation. You can inspect the item and pay at counter.</span>
            </div>

            {/* CTA */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                id="confirm-reservation-btn"
                onClick={handleConfirmReservation}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
              >
                Lock Hold & Get Code
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Confirmed Reservation Screen with Live 30-min Timer & Pickup Code */
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display font-extrabold text-2xl text-slate-950">
              Reservation Confirmed!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Held for you at <strong>{store.name}</strong>
            </p>

            {/* 30:00 Countdown Clock */}
            <div className="my-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Hold Time Remaining
              </span>
              <div className="font-mono font-extrabold text-3xl sm:text-4xl text-amber-950 mt-1">
                {formatTimer(secondsRemaining)}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Please reach the store before timer expires to claim your item
              </p>
            </div>

            {/* Secret Pickup Code */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Show Counter Pickup Code
              </span>
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className="font-mono font-extrabold text-3xl tracking-widest text-amber-400">
                  {confirmedReservation.pickupCode}
                </span>
                <button
                  onClick={copyPickupCode}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedCode && (
                <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                  Copied to clipboard!
                </span>
              )}
            </div>

            {/* Order Ref */}
            <p className="text-xs text-slate-500 mt-3 font-mono">
              Ref: {confirmedReservation.reservationNumber}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs"
              >
                Done
              </button>
              <button
                onClick={onViewReservations}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                View in My Orders
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
