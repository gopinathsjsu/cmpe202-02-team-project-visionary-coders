
import Image from 'next/image';
import { users, products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Edit, Settings, Mail, Phone, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product-card';
import type { Review } from '@/lib/types';

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-500"
        />
      ))}
      {halfStar && (
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-500"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 fill-muted text-muted-foreground"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const authorAvatar = PlaceHolderImages.find(
    (img) => img.id === review.author.avatar
  );
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage
          src={authorAvatar?.imageUrl}
          alt={review.author.name}
          data-ai-hint={authorAvatar?.imageHint}
        />
        <AvatarFallback>
          {review.author.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">{review.author.name}</h4>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={review.rating} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = users[0]; // Mock current user
  const userListings = products.filter((p) => p.seller.id === user.id);
  const userAvatar = PlaceHolderImages.find((img) => img.id === user.avatar);

  const totalReviews = user.reviewsReceived.length;
  const averageRating =
    totalReviews > 0
      ? user.reviewsReceived.reduce((acc, r) => acc + r.rating, 0) /
        totalReviews
      : 0;

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt={user.name}
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback className="text-3xl">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start flex-wrap gap-x-4 gap-y-2 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-sm">({totalReviews} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                 <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{user.location}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm">{user.memberSince}</span>
              </div>
               <div className="mt-4 flex justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 hover:text-primary">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </a>
                <a href={`tel:${user.phone}`} className="flex items-center gap-1.5 hover:text-primary">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Listings ({userListings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userListings.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You have no active listings.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({totalReviews})</CardTitle>
              <CardDescription>
                See what others have to say about {user.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.reviewsReceived.length > 0 ? (
                user.reviewsReceived.map((review, index) => (
                  <>
                    <ReviewCard key={review.id} review={review} />
                    {index < user.reviewsReceived.length - 1 && <Separator />}
                  </>
                ))
              ) : (
                <p className="text-muted-foreground">
                  This user has not received any reviews yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="saved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Items (0)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">No saved items</h2>
                <p className="text-muted-foreground mt-2">
                  Items you save will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
