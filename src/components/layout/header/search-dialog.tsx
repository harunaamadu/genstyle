"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchSchema } from "@/lib/validations/search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = searchSchema.safeParse({ q: query });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    setOpen(false);
    setQuery("");
    router.push(`/shop?q=${encodeURIComponent(result.data.q)}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="size-4 md:size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Search products</DialogTitle>
          <DialogDescription>Find clothing, shoes and accessories.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for dresses, sneakers, bags..."
              aria-invalid={!!error}
            />
            <Button type="submit">Search</Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}