import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MapPin } from 'lucide-react';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const productImage = PlaceHolderImages.find(
    (img) => img.id === product.images[0]
  );

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-[4/3] relative">
            {productImage && (
              <Image
                src={productImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={productImage.imageHint}
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 leading-tight">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="text-2xl font-bold text-primary">
          ${product.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{`${product.location.city}, ${product.location.zipCode}`}</span>
        </div>
        <Badge variant="secondary">{product.category}</Badge>
      </CardFooter>
    </Card>
  );
}
