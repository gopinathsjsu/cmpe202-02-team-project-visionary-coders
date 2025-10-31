
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  PlusCircle,
  Search,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { users } from '@/lib/data';
import { cn } from '@/lib/utils';

export function Header({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  const user = users[0]; // Mock current user
  const userAvatar = PlaceHolderImages.find((img) => img.id === user.avatar);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Buyer' },
    { href: '/sell', label: 'Seller' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Market Square
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-2 bg-muted p-1 rounded-md">
           {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'py-1.5 px-4 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:bg-background/50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="w-full pl-9 md:w-[250px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <nav className="flex items-center space-x-2">
             <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
              <Link href="/sell">
                <PlusCircle className="h-5 w-5" />
                <span className="sr-only">List an Item</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={userAvatar?.imageUrl}
                      alt={user.name}
                      data-ai-hint={userAvatar?.imageHint}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Logged In
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/login">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
