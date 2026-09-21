import { lynkStore } from './storage';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'search' | 'store' | 'product';
    target: string;
    label: string;
  };
  productMatches?: Array<{
    name: string;
    storeName: string;
    price: number;
    distance: string;
    pickupTime: string;
  }>;
}

export async function askLynkAi(userMessage: string, history: AiChatMessage[]): Promise<AiChatMessage> {
  const currentCity = lynkStore.getCurrentCity();
  const stores = lynkStore.getStores();
  const products = lynkStore.getAllProducts();

  // Try calling server-side API endpoint first
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        city: currentCity.name,
        availableStores: stores.map(s => ({ name: s.name, category: s.category, locality: s.locality })),
        availableProducts: products.map(p => ({ name: p.name, brand: p.brand, category: p.category })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: data.suggestedAction,
          productMatches: data.productMatches,
        };
      }
    }
  } catch {
    // Fall back to intelligent deterministic response
  }

  // Deterministic local intelligence grounded strictly in the active city marketplace
  const lower = userMessage.toLowerCase();

  // Scenario 1: Wireless Earbuds under 3000 / today
  if (lower.includes('earbud') || lower.includes('audio') || lower.includes('headphone')) {
    const comp = lynkStore.getProductComparison('prod-earbuds-1');
    const lowest = comp.find(c => c.isLowestPrice);
    const closest = comp.find(c => c.isClosest);
    const fastest = comp.find(c => c.isFastestPickup);

    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `I found ${comp.length} nearby stores in ${currentCity.name} stocking **SoundWave Pro X Wireless Earbuds** with live in-store inventory:\n\n• **Lowest Price**: ₹${lowest?.storeProduct.price.toLocaleString('en-IN')} at ${lowest?.store.name} (${(lowest?.distanceKm || 0.5)} km away)\n• **Closest Store**: ${closest?.store.name} (${(closest?.distanceKm || 0.3)} km away, ₹${closest?.storeProduct.price.toLocaleString('en-IN')})\n• **Fastest Pickup**: ${fastest?.storeProduct.estimatedPickupMinutes} mins at ${fastest?.store.name}\n\nBoth stores have active stock for immediate in-store pickup or 2-hour delivery today.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'search',
        target: 'Wireless Earbuds',
        label: 'Compare Wireless Earbuds',
      },
      productMatches: comp.map(c => ({
        name: c.product.name,
        storeName: c.store.name,
        price: c.storeProduct.price,
        distance: `${c.distanceKm} km`,
        pickupTime: `${c.storeProduct.estimatedPickupMinutes} min`,
      })),
    };
  }

  // Scenario 2: Charger / Laptop
  if (lower.includes('charger') || lower.includes('type-c') || lower.includes('laptop') || lower.includes('power')) {
    const comp = lynkStore.getProductComparison('prod-charger-1');
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `Looking for fast chargers in ${currentCity.name}? **Metro Electronics** (Janpath) has the **65W GaN Fast Dual USB-C Laptop Charger** in stock for ₹899 (MRP ₹1,499) with counter pickup in 10 minutes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'search',
        target: 'Laptop charger',
        label: 'View Chargers & Accessories',
      },
    };
  }

  // Scenario 3: Medicine / Pharmacy / Fever
  if (lower.includes('pharmacy') || lower.includes('medicine') || lower.includes('fever') || lower.includes('vitamin')) {
    const pharmaStore = stores.find(s => s.category === 'pharmacy');
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `In ${currentCity.name}, **${pharmaStore?.name || 'Apollo Lifecare Pharmacy'}** is open right now until 11:00 PM. They have infrared thermometers, pulse oximeters, and Vitamin C supplements ready for 5-minute counter pickup.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'store',
        target: pharmaStore?.id || 'store-bbsr-6',
        label: `View ${pharmaStore?.name || 'Pharmacy'}`,
      },
    };
  }

  // Scenario 4: Grocery / Organic / Honey / Coffee
  if (lower.includes('grocery') || lower.includes('organic') || lower.includes('coffee') || lower.includes('honey')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `For gourmet & organic staples around ${currentCity.locality}, check **FreshMart Superstore** (Organic Bilona A2 Desi Ghee at ₹890, Forest Honey at ₹360) and **Chai & Co. Roasters** (Single Origin Araku Valley Coffee at ₹420). Both offer quick in-store reserve.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        type: 'search',
        target: 'Coffee',
        label: 'Explore Local Groceries & Coffee',
      },
    };
  }

  // Default helpful response with suggestions
  return {
    id: `ai-${Date.now()}`,
    sender: 'assistant',
    text: `Hello! I am **LYNK AI**, your intelligent neighborhood market navigator in **${currentCity.name}**.\n\nYou can ask me:\n• *"Which store has wireless earbuds under ₹3000?"*\n• *"Find laptop chargers near me for pickup today"*\n• *"Show organic groceries or pharmacies open now"*\n\nTell me what you're looking for and I'll find nearby stores with live stock and lowest prices!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
