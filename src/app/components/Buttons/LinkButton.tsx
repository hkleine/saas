import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './LinkButton.module.css'

interface Props {
  children?: ReactNode;
  className?: string;
  href: string;
  variant?: 'outline'
}

export default function LinkButton({ children, href }: Props) {
  return <Link href={href} className={styles['link-button']}>{children}</Link>;
}
