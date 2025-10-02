"use client";
import { useRouter } from "next/navigation";
import { Button, Shad } from "./ui";
import Icon from "./ui/icon";
import NavItems from "./nav-items";
import { User } from "next-auth";
import { useSignOut } from "@/hooks/auth";

type Props = {
  user: User;
};

const UserDropdown = ({ user }: Props) => {
  const router = useRouter();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Get user initials safely
  const userInitial = user.fullName?.charAt(0)?.toUpperCase();
  const displayName = user.fullName;

  return (
    <Shad.DropdownMenu>
      <Shad.DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center gap-3 text-gray-4 hover:text-yellow-500 hover:bg-gray-700 transition-colors"
        >
          <Shad.Avatar className="size-8">
            <Shad.AvatarImage src={user.image} />
            <Shad.AvatarFallback className="capitalize">
              {userInitial}
            </Shad.AvatarFallback>
          </Shad.Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {displayName}
            </span>
          </div>
          <Icon name="ChevronsUpDown" className="size-4 text-gray-400" />
        </Button>
      </Shad.DropdownMenuTrigger>
      <Shad.DropdownMenuContent className="text-gray-400 bg-gray-700">
        <Shad.DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Shad.Avatar className="h-10 w-10">
              <Shad.AvatarImage src={user.image} />
              <Shad.AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold capitalize">
                {userInitial}
              </Shad.AvatarFallback>
            </Shad.Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">
                {displayName}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </Shad.DropdownMenuLabel>

        <Shad.DropdownMenuSeparator className="bg-gray-600" />

        <nav className="sm:hidden">
          <NavItems />
        </nav>

        <Shad.DropdownMenuItem
          onSelect={handleSignOut}
          className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer"
        >
          <Icon name="LogOut" className="size-4 mr-2" />
          Sign Out
        </Shad.DropdownMenuItem>
      </Shad.DropdownMenuContent>
    </Shad.DropdownMenu>
  );
};
export default UserDropdown;
