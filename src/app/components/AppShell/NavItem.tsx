import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
  href: string;
}
export function NavItem({ icon, children, href, ...rest }: NavItemProps) {
  const path = usePathname();
  const isActive = path === href;
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'gray.50',
          color: 'primary.500',
        }}
        color={isActive ? 'primary.500' : 'gray.800'}
        background={isActive ? 'gray.50' : 'white'}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
}
