import { auth } from '@/auth';
import { Button } from '@/lib/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/lib/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { signOutUser } from '@/lib/actions';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/lib/components/ui/avatar';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Link href="/sign-in">
        <Button>
          <UserIcon />
          Sign In
        </Button>
      </Link>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? '';

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Avatar size="sm">
              <AvatarImage src={session.user?.image ?? ''} />
              <AvatarFallback>{firstInitial}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
