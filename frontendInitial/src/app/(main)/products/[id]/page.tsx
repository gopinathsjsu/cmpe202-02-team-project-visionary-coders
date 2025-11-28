
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Mail, MapPin, MessageSquare, Phone, Star } from 'lucide-react';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const sellerAvatar = PlaceHolderImages.find(
    (img) => img.id === product.seller.avatar
  );

  // For the map, we'll use a static image as a placeholder.
  // In a real app, you would use a mapping library with dynamic coordinates.
  const mapImageUrl = `https://picsum.photos/seed/${product.id}/600/400`;

  return (
    <div className="container mx-auto py-10">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((imageId, index) => {
                const image = PlaceHolderImages.find(
                  (img) => img.id === imageId
                );
                return (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={`${product.name} - image ${index + 1}`}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                      </div>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-muted-foreground text-base">
            {product.description}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{`${product.location.street}, ${product.location.city}, ${product.location.zipCode}`}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="font-medium">{product.distance} miles</span>
              <span>away</span>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Item Location & Distance</h2>
            <Card>
              <CardContent className="p-2">
                <div className="aspect-[16/9] w-full bg-muted rounded-md overflow-hidden relative">
                  <Image
                    src={mapImageUrl}
                    alt={`Map showing location of ${product.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint="map location"
                  />
                   <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-2 bg-background/80 rounded-full">
                      <MapPin className="w-8 h-8 text-primary fill-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {sellerAvatar && (
                      <AvatarImage
                        src={sellerAvatar.imageUrl}
                        alt={product.seller.name}
                        data-ai-hint={sellerAvatar.imageHint}
                      />
                    )}
                    <AvatarFallback>
                      {product.seller.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href="/profile"
                      className="text-lg font-semibold hover:underline"
                    >
                      {product.seller.name}
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                      <span>{product.seller.rating}</span>
                      <span>({product.seller.reviews} reviews)</span>
                    </div>
                     <div className="text-sm text-muted-foreground mt-1">{product.seller.memberSince}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                 <a href={`mailto:${product.seller.email}`} className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted">
                   <Mail className="w-4 h-4 text-muted-foreground"/>
                   <span>{product.seller.email}</span>
                 </a>
                 <a href={`tel:${product.seller.phone}`} className="flex items-center gap-2 p-3 rounded-md border hover:bg-muted">
                   <Phone className="w-4 h-4 text-muted-foreground"/>
                   <span>{product.seller.phone}</span>
                 </a>
              </div>
               <Button asChild className="w-full">
                  <Link href="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Seller
                  </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

