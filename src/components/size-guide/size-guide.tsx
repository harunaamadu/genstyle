"use client";

import { useState } from "react";
import { z } from "zod";
import { sizeGroups, type Range, type SizeGroup } from "@/data/size-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Unit = "cm" | "in";

const toDisplay = (cm: number, unit: Unit) =>
  unit === "cm" ? Math.round(cm) : Math.round((cm / 2.54) * 10) / 10;

const formatRange = ([min, max]: Range, unit: Unit) =>
  `${toDisplay(min, unit)}–${toDisplay(max, unit)}`;

function suggestSize(group: SizeGroup, cm: number) {
  const key = group.finder.key;
  const { rows } = group;
  const first = rows[0];
  const last = rows[rows.length - 1];

  if (cm < first.values[key][0]) {
    return `Smaller than our ${first.size}. Choose ${first.size} for the closest fit.`;
  }
  if (cm > last.values[key][1]) {
    return `Larger than our ${last.size}. Choose ${last.size}, or contact us and we'll help.`;
  }

  for (let i = 0; i < rows.length; i++) {
    const [min, max] = rows[i].values[key];
    if (cm >= min && cm <= max) return `Your best size is ${rows[i].size}.`;

    const next = rows[i + 1];
    if (next && cm > max && cm < next.values[key][0]) {
      return `You're between ${rows[i].size} and ${next.size}. Size up for a relaxed fit, or down for a closer one.`;
    }
  }
  return "";
}

const measurementSchema = z.coerce.number().min(20).max(250);

function SizeFinder({ group, unit }: { group: SizeGroup; unit: Unit }) {
  const [value, setValue] = useState("");

  const parsed = measurementSchema.safeParse(value);
  const cm = parsed.success ? (unit === "in" ? parsed.data * 2.54 : parsed.data) : null;

  return (
    <div className="space-y-3 border bg-secondary/50 p-5">
      <h3 className="font-semibold">Find my size</h3>
      <div className="flex max-w-xs items-end gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`finder-${group.id}`}>
            {group.finder.label} ({unit})
          </Label>
          <Input
            id={`finder-${group.id}`}
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={unit === "cm" ? "e.g. 92" : "e.g. 36"}
            className="bg-background"
          />
        </div>
      </div>
      <p aria-live="polite" className="min-h-6 text-sm font-medium">
        {cm !== null
          ? suggestSize(group, cm)
          : value && "Enter a realistic measurement to see a suggestion."}
      </p>
    </div>
  );
}

export function SizeGuide() {
  const [unit, setUnit] = useState<Unit>("cm");

  return (
    <Tabs defaultValue="women" className="gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TabsList>
          {sizeGroups.map((g) => (
            <TabsTrigger key={g.id} value={g.id} className="px-5">
              {g.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div role="group" aria-label="Measurement unit" className="flex border">
          {(["cm", "in"] as const).map((u) => (
            <Button
              key={u}
              type="button"
              size="sm"
              variant={unit === u ? "default" : "ghost"}
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className="w-12"
            >
              {u}
            </Button>
          ))}
        </div>
      </div>

      {sizeGroups.map((group) => (
        <TabsContent key={group.id} value={group.id} className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size</TableHead>
                {group.measures.map((m) => (
                  <TableHead key={m.key}>
                    {m.label} ({unit})
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.rows.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="font-semibold">{row.size}</TableCell>
                  {group.measures.map((m) => (
                    <TableCell key={m.key} className="tabular-nums">
                      {formatRange(row.values[m.key], unit)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <SizeFinder group={group} unit={unit} />
        </TabsContent>
      ))}
    </Tabs>
  );
}