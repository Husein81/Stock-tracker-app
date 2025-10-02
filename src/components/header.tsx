import Link from "next/link";
import Image from "next/image";
import NavItems from "./nav-items";
import UserDropdown from "./user-dropdown";
import { User } from "next-auth";
import { searchStocks } from "@/lib/finnhub";
import { useQuery } from "@tanstack/react-query";

type Props = {
  user: User;
};

const Header = ({ user }: Props) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        <UserDropdown user={user} />
      </div>
    </header>
  );
};
export default Header;
