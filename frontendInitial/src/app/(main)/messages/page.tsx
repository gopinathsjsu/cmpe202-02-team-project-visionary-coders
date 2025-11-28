
import { users } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Send, Smile } from 'lucide-react';

export default function MessagesPage() {
  const conversations = [
    {
      user: users[1],
      lastMessage: "Is the bike still available?",
      time: "2h",
      unread: 1,
      product: "Trek Mountain Bike",
    },
    {
      user: users[2],
      lastMessage: "Great, I'll take it!",
      time: "1d",
      unread: 0,
      product: "Sony A7 III",
    },
  ];

  const selectedConversation = conversations[0];
  const sellerAvatar = PlaceHolderImages.find((img) => img.id === selectedConversation.user.avatar);
  const myAvatar = PlaceHolderImages.find((img) => img.id === users[0].avatar);


  return (
    <div className="container h-[calc(100vh-4rem)] py-6">
      <div className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 border rounded-lg shadow-sm bg-card">
        <div className="md:col-span-1 lg:col-span-1 border-r h-full flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Messages</h1>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((convo, index) => {
              const avatar = PlaceHolderImages.find((img) => img.id === convo.user.avatar);
              return (
                <div key={index} className={`p-4 flex gap-4 cursor-pointer hover:bg-muted/50 ${index === 0 ? 'bg-muted' : ''}`}>
                  <Avatar>
                    <AvatarImage src={avatar?.imageUrl} alt={convo.user.name} data-ai-hint={avatar?.imageHint} />
                    <AvatarFallback>{convo.user.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">{convo.user.name}</h3>
                      <p className="text-xs text-muted-foreground">{convo.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>

        <div className="col-span-2 lg:col-span-3 flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-4">
                 <Avatar>
                    <AvatarImage src={sellerAvatar?.imageUrl} alt={selectedConversation.user.name} data-ai-hint={sellerAvatar?.imageHint} />
                    <AvatarFallback>{selectedConversation.user.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedConversation.user.name}</h2>
                    <p className="text-sm text-muted-foreground">Regarding: {selectedConversation.product}</p>
                  </div>
            </div>
            
            <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col gap-6">
                    {/* My Message */}
                    <div className="flex items-end gap-3 self-end">
                        <div className="rounded-2xl rounded-br-none bg-primary text-primary-foreground p-3 max-w-xs lg:max-w-md">
                            <p>Hi! I'm interested in the mountain bike. Is the price negotiable?</p>
                        </div>
                    </div>
                     {/* Their Message */}
                     <div className="flex items-end gap-3 self-start">
                         <Avatar className="w-8 h-8">
                            <AvatarImage src={sellerAvatar?.imageUrl} data-ai-hint={sellerAvatar?.imageHint} />
                            <AvatarFallback>{selectedConversation.user.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl rounded-bl-none bg-muted p-3 max-w-xs lg:max-w-md">
                            <p>Hey! Thanks for reaching out. The price is fairly firm, but I can throw in a helmet.</p>
                        </div>
                    </div>
                     <div className="flex items-end gap-3 self-end">
                        <div className="rounded-2xl rounded-br-none bg-primary text-primary-foreground p-3 max-w-xs lg:max-w-md">
                            <p>That sounds like a good deal. Is it still available for pickup this weekend?</p>
                        </div>
                    </div>
                     <div className="flex items-end gap-3 self-start">
                         <Avatar className="w-8 h-8">
                            <AvatarImage src={sellerAvatar?.imageUrl} data-ai-hint={sellerAvatar?.imageHint} />
                            <AvatarFallback>{selectedConversation.user.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl rounded-bl-none bg-muted p-3 max-w-xs lg:max-w-md">
                            <p>Yes, it is!</p>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
                <div className="relative">
                    <Input placeholder="Type your message..." className="pr-20" />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <Button variant="ghost" size="icon">
                            <Smile className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Button variant="default" size="icon">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
