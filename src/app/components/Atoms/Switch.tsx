import { Button, ButtonGroup, Center } from '@chakra-ui/react';
import { startCase } from 'lodash';
import { Dispatch, SetStateAction } from 'react';

export function Switch<T extends string, K extends string>({
  option1,
  option2,
  setValue,
  value,
}: {
  option1: T;
  option2: K;
  value: T | K;
  setValue: Dispatch<SetStateAction<T | K>>;
}) {
  const startCaseOption1 = startCase(option1);
  const startCaseOption2 = startCase(option2);
  return (
    <Center>
      <ButtonGroup
        borderRadius="lg"
        padding="1"
        bg="white"
        boxShadow={{ base: 'none', sm: 'md' }}
        size="sm"
        spacing={2}
      >
        <Button
          px={4}
          onClick={() => setValue(option1)}
          variant={value === option1 ? 'outline' : 'ghost'}
          borderRadius="lg"
        >
          {startCaseOption1}
        </Button>
        <Button onClick={() => setValue(option2)} variant={value === option2 ? 'outline' : 'ghost'} borderRadius="lg">
          {startCaseOption2}
        </Button>
      </ButtonGroup>
    </Center>
  );
}
