import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  href: string;
}

export default function LinkButton({ children, href }: Props) {
  return <Link href={href}>{children}</Link>;
}
