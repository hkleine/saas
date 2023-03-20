'use client';
import { Spinner } from '@chakra-ui/react';
import styles from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return <Spinner className={styles.root} size="xl" />;
}
