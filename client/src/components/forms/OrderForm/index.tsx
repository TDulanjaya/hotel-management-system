"use client";

import React, { useEffect, useState } from 'react';
import { getPricingItemsByCategory } from '@/lib/api/pricingApi';

type OrderFormProps = {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  categories: string[];
  loading?: boolean;
  isKitchen?: boolean;
  tableOptions?: { tableNumber: string; status?: string }[];
  roomOptions?: { roomNumber: string; guestName?: string }[];
  showStatus?: boolean;
  showPaymentStatus?: boolean;
};

export default function OrderForm({
  formData,
  setFormData,
  onSubmit,
  categories,
  loading,
  isKitchen,
  tableOptions,
  roomOptions,
  showStatus = true,
  showPaymentStatus = false,
}: OrderFormProps) {
  const [pricingItems, setPricingItems] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        let allItems: any[] = [];
        for (const cat of categories) {
          const items = await getPricingItemsByCategory(cat);
          allItems = [...allItems, ...items];
        }
        const seen = new Set<string>();
        const unique = allItems.filter((item) => {
          if (!item || !item.id || seen.has(item.id)) return false;
          seen.add(item.id);
          if (item.status === "Inactive") return false;

          const isKitchen =
            item.kitchenRequired === true ||
            ["RESTAURANT_FOOD", "ROOM_SERVICE_FOOD", "DESSERT"].includes(
              String(item.category).toUpperCase()
            );

          if (isKitchen) {
            return Boolean(item.recipeId);
          }

          return true;
        });
        setPricingItems(unique);
      } catch (err) {
        console.error("Failed to load pricing items", err);
      } finally {
        setFetching(false);
      }
    }
    loadItems();
  }, [categories]);

  const currentLineItems = formData.items && Array.isArray(formData.items) ? formData.items : [];

  const addLineItem = (pricingItemId: string) => {
    if (!pricingItemId) return;
    const pricingItem = pricingItems.find(p => p.id === pricingItemId);
    if (!pricingItem) return;

    const existingIndex = currentLineItems.findIndex((i: any) => i.pricingItemId === pricingItemId);
    let newItems = [...currentLineItems];

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += 1;
    } else {
      newItems.push({
        pricingItemId: pricingItem.id,
        recipeId: pricingItem.recipeId,
        name: pricingItem.name,
        quantity: 1,
        price: pricingItem.price
      });
    }

    updateItemsAndTotal(newItems);
  };

  const updateQuantity = (index: number, quantity: number) => {
    let newItems = [...currentLineItems];
    if (quantity <= 0) {
      newItems.splice(index, 1);
    } else {
      newItems[index].quantity = quantity;
    }
    updateItemsAndTotal(newItems);
  };

  const updateItemsAndTotal = (newItems: any[]) => {
    const total = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setFormData({ ...formData, items: newItems, totalAmount: total });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic fields */}
      <div className="grid grid-cols-2 gap-4">
        {formData.orderSource !== undefined && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Order source</label>
            <select
              className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3"
              value={formData.orderSource}
              onChange={e => setFormData({
                ...formData,
                orderSource: e.target.value,
                tableNumber: e.target.value === "TABLE" ? formData.tableNumber : "",
                roomNumber: e.target.value === "ROOM" ? formData.roomNumber : "",
              })}
            >
              <option value="TABLE">Restaurant table</option>
              <option value="ROOM">Guest room</option>
            </select>
          </div>
        )}
        {formData.tableNumber !== undefined && formData.orderSource !== "ROOM" && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Table No</label>
            {tableOptions ? (
              <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.tableNumber} onChange={e => setFormData({...formData, tableNumber: e.target.value})}>
                <option value="">Select a registered table</option>
                {tableOptions.filter(table => table.status === "AVAILABLE" || table.status === "RESERVED").map(table => (
                  <option key={table.tableNumber} value={table.tableNumber}>
                    {table.tableNumber} ({table.status?.toLowerCase()})
                  </option>
                ))}
              </select>
            ) : (
              <input className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.tableNumber} onChange={e => setFormData({...formData, tableNumber: e.target.value})} />
            )}
          </div>
        )}
        {formData.roomNumber !== undefined && formData.orderSource !== "TABLE" && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Room No</label>
            {roomOptions ? (
              <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.roomNumber} onChange={e => {
                const room = roomOptions.find(option => option.roomNumber === e.target.value);
                setFormData({...formData, roomNumber: e.target.value, guestName: room?.guestName || formData.guestName});
              }}>
                <option value="">Select an active guest room</option>
                {roomOptions.map(room => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    Room {room.roomNumber}{room.guestName ? ` — ${room.guestName}` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <input className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {formData.guestName !== undefined && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Guest Name</label>
            <input className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
          </div>
        )}
        {formData.orderSource !== undefined && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Source</label>
            <input className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.orderSource} onChange={e => setFormData({...formData, orderSource: e.target.value})} />
          </div>
        )}
        {formData.tableOrRoom !== undefined && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Table / Room</label>
            <input className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.tableOrRoom} onChange={e => setFormData({...formData, tableOrRoom: e.target.value})} />
          </div>
        )}
      </div>

      {/* Line Items Builder */}
      <div className="rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-4">
        <h3 className="mb-4 text-lg font-bold text-[#735c00]">Order Items</h3>
        
        <div className="mb-4 flex gap-2">
          <select 
            id="item-select"
            className="flex-1 rounded-xl border border-[#d0c5af] p-3 text-sm"
            defaultValue=""
          >
            <option value="" disabled>Select an item to add...</option>
            {pricingItems.map(item => (
              <option key={item.id} value={item.id}>{item.name} - Rs {item.price}</option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={() => {
              const select = document.getElementById('item-select') as HTMLSelectElement;
              addLineItem(select.value);
              select.value = "";
            }}
            className="rounded-xl bg-[#e6cf77] px-4 py-2 font-bold text-[#4c3a00]"
          >
            Add
          </button>
        </div>

        {currentLineItems.length === 0 ? (
          <p className="text-sm italic text-gray-500">No items added yet.</p>
        ) : (
          <div className="space-y-2">
            {currentLineItems.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-[#e6dfd2]">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500">Rs {item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => updateQuantity(idx, item.quantity - 1)} className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200">-</button>
                  <span className="w-4 text-center font-bold">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(idx, item.quantity + 1)} className="h-8 w-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {formData.totalAmount !== undefined && (
          <div className="mt-4 flex justify-between border-t border-[#d0c5af] pt-4 text-lg font-bold">
            <span>Total:</span>
            <span className="text-[#735c00]">Rs {formData.totalAmount}</span>
          </div>
        )}
      </div>

      {formData.customerType !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Customer type</label>
            <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.customerType} onChange={e => setFormData({...formData, customerType: e.target.value, billingType: e.target.value === "HOTEL_GUEST" ? "ROOM_FOLIO" : "DIRECT_PAYMENT"})}>
              <option value="WALK_IN">Walk-in guest</option>
              <option value="HOTEL_GUEST">Hotel guest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Billing destination</label>
            <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.billingType} onChange={e => setFormData({...formData, billingType: e.target.value})}>
              <option value="DIRECT_PAYMENT">Direct payment</option>
              <option value="ROOM_FOLIO" disabled={formData.customerType !== "HOTEL_GUEST"}>Room folio</option>
            </select>
          </div>
        </div>
      )}

      {showStatus && <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[#4d4635]">Status</label>
          <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option>PENDING</option>
            <option>IN_PROGRESS</option>
            <option>SERVED</option>
            <option>CANCELLED</option>
            <option>COMPLETED</option>
          </select>
        </div>
        {showPaymentStatus && formData.paymentStatus !== undefined && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Payment</label>
            <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
              <option>PENDING</option>
              <option>PAID</option>
              <option>CHARGE_TO_ROOM</option>
            </select>
          </div>
        )}
        {formData.priority !== undefined && (
          <div>
            <label className="block text-sm font-bold text-[#4d4635]">Priority</label>
            <select className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option>Normal</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </div>
        )}
      </div>}

      <div>
        <label className="block text-sm font-bold text-[#4d4635]">Notes</label>
        <textarea rows={2} className="mt-1 w-full rounded-xl border border-[#d0c5af] p-3" value={formData.notes || ""} onChange={e => setFormData({...formData, notes: e.target.value})} />
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#806300] py-3 text-white font-bold hover:bg-[#6b5400]">
        {loading ? "Saving..." : "Save Order"}
      </button>
    </form>
  );
}
