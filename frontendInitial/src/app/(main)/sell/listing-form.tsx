
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import { getCategorySuggestion, getPriceSuggestion } from './actions';
import { useToast } from '@/hooks/use-toast';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';

const listingSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  description: z.string().min(10, 'Description is too short.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export function ListingForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [priceReasoning, setPriceReasoning] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuggestCategory = async () => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'Upload an image first',
        description:
          'AI needs an image to suggest a category.',
      });
      return;
    }
    setIsSuggestingCategory(true);
    const result = await getCategorySuggestion(imagePreview);
    if (result.category) {
      form.setValue('category', result.category);
      toast({ title: 'Category Suggested!', description: `We think this is in "${result.category}".` });
    } else if (result.error) {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSuggestingCategory(false);
  };

  const handleSuggestPrice = async () => {
    if (!imagePreview || !form.getValues('description')) {
       toast({
        variant: 'destructive',
        title: 'Image and description needed',
        description:
          'AI needs an image and description to suggest a price.',
      });
      return;
    }
    setIsSuggestingPrice(true);
    setPriceReasoning(null);
    const result = await getPriceSuggestion(imagePreview, form.getValues('description'));

    if (result.price !== undefined) {
      form.setValue('price', result.price);
      setPriceReasoning(result.reasoning || null);
      toast({ title: 'Price Suggested!', description: `We suggest a price of $${result.price}.` });
    } else if (result.error) {
       toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSuggestingPrice(false);
  };

  function onSubmit(data: ListingFormValues) {
    console.log(data);
    toast({
      title: 'Item Listed!',
      description: 'Your item is now live on the marketplace.',
    });
    form.reset();
    setImagePreview(null);
    setPriceReasoning(null);
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="picture">Item Picture</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs aspect-video">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon
                        className="mx-auto h-12 w-12 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload an image of your item
                      </p>
                    </div>
                  )}
                </div>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Vintage Leather Armchair" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your item in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSuggestCategory}
                      disabled={isSuggestingCategory}
                    >
                      {isSuggestingCategory ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      <span className="sr-only">Suggest Category</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                   <div className="flex items-center gap-2">
                    <div className="relative w-full">
                       <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">$</span>
                       <FormControl>
                        <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                      </FormControl>
                    </div>
                     <HoverCard>
                      <HoverCardTrigger asChild>
                         <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleSuggestPrice}
                          disabled={isSuggestingPrice}
                        >
                          {isSuggestingPrice ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                          <span className="sr-only">Suggest Price</span>
                        </Button>
                      </HoverCardTrigger>
                       {priceReasoning && (
                         <HoverCardContent className="w-80">
                           <div className="space-y-2">
                            <h4 className="font-semibold text-sm">AI Pricing Rationale</h4>
                            <p className="text-sm text-muted-foreground">{priceReasoning}</p>
                           </div>
                         </HoverCardContent>
                       )}
                    </HoverCard>
                  </div>
                   <FormDescription>
                     {priceReasoning ? "Hover over the ✨ icon to see AI's reasoning." : "Click ✨ to get an AI price suggestion."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">
          List Item
        </Button>
      </form>
    </Form>
  );
}
