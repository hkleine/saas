import { UseToastOptions } from "@chakra-ui/react";

export function createToastSettings({title, status, description}:Pick<UseToastOptions, 'title' | 'status' | 'description'> ) {
    return {
        title,
        status,
        description,
        duration: 9000,
        isClosable: true,
        variant: 'subtle'
      }
}