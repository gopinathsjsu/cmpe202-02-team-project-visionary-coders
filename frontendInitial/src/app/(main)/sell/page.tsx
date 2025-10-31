import { ListingForm } from './listing-form';

export default function SellPage() {
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">List a new item</h1>
        <p className="text-muted-foreground">
          Fill out the details below to put your item on the market.
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
