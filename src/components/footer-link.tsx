import Link from "next/link";

type Props = {
  title: string;
  href: string;
  linkText: string;
};

const FooterLink = ({ title, href, linkText }: Props) => {
  return (
    <span className="text-sm text-gray-500 block text-center">
      {title}{" "}
      <Link href={href} className="text-white font-semibold hover:underline">
        {linkText}
      </Link>
    </span>
  );
};
export default FooterLink;
