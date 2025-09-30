import { icons, LucideProps } from "lucide-react";

type Props = {
  name: string;
  className?: string;
  onClick?: () => void;
} & LucideProps;

const Icon = ({ name, className, onClick, ...props }: Props) => {
  const LucideIcon = icons[name as keyof typeof icons];
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react icons.`);
    return null;
  }
  return <LucideIcon className={className} onClick={onClick} {...props} />;
};

export default Icon;
