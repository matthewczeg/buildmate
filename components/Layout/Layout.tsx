import { ReactNode } from 'react';
import styles from './Layout.module.css';
import { Box } from '@chakra-ui/react';

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return <Box className={styles.layoutContainer}>{children}</Box>;
}

export default Layout;