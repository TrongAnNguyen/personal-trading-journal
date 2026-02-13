"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Emotion } from "@/types/trade";

interface PsychologyProps {
  disabled?: boolean;
}

export function Psychology({ disabled }: PsychologyProps) {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="h-5 w-5" />
          Psychology
        </CardTitle>
        <CardDescription>
          Track your emotional state at trade entry
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="emotionEntry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emotional State</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How are you feeling?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Emotion).map((emotion) => (
                    <SelectItem key={emotion} value={emotion}>
                      {emotion.charAt(0) + emotion.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Trade Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why are you taking this trade? What's your thesis?"
                  className="min-h-25 resize-y"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
