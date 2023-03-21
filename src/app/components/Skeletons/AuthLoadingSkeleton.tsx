'use client';
import { Box, Flex, SkeletonText, useColorModeValue } from '@chakra-ui/react';

export default function AuthLoadingSkeleton() {
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Box
        w="lg"
        h="sm"
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={{ base: 'none', sm: '2xl' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
        p={8}
      >
        <SkeletonText mt="4" noOfLines={5} spacing="8" skeletonHeight="8" />
      </Box>
    </Flex>
  );
}
