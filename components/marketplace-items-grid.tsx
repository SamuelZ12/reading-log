"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostItemForm } from "@/components/post-item-form";

type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  location: string;
  contact: string;
  image_url: string;
  user_id: string;
  created_at: string;
};

export function MarketplaceItemsGrid() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("marketplace_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching items:", error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="text-center">Loading items...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Available Items</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Post Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Post a New Item</DialogTitle>
              <DialogDescription>
                Add details about the item you want to trade
              </DialogDescription>
            </DialogHeader>
            <PostItemForm onSuccess={fetchItems} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No items available for trade yet. Be the first to post one!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-lg border bg-card overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.image_url || "/item-placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{item.condition}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{item.location}</span>
                </div>
                <Button variant="secondary" className="w-full mt-4" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Trader
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 