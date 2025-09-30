"use client";
import { useRouter } from "next/navigation";
import { Button, Shad } from "./ui";
import Icon from "./ui/icon";
import NavItems from "./nav-items";

const UserDropdown = () => {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/sign-in");
  };
  const user = { name: "John Doe", email: "john@example.com" };

  return (
    <Shad.DropdownMenu>
      <Shad.DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center gap-3 text-gray-4 hover:text-yellow-500"
        >
          <Shad.Avatar className="size-8">
            <Shad.AvatarImage src="https://avatars.githubusercontent.com/u/153322956?s=280&v=4" />
            <Shad.AvatarFallback>{user.name.charAt(0)}</Shad.AvatarFallback>
          </Shad.Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
      </Shad.DropdownMenuTrigger>
      <Shad.DropdownMenuContent className="text-gray-400">
        <Shad.DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Shad.Avatar className="h-10 w-10">
              <Shad.AvatarImage src="https://avatars.githubusercontent.com/u/153322956?s=280&v=4" />
              <Shad.AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                {user.name[0]}
              </Shad.AvatarFallback>
            </Shad.Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">
                {user.name}
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
