import { EquationVariable, Item } from '@/types/types';
import { createToastSettings } from '@/utils/createToastSettings';
import { updateCurrentEarning } from '@/utils/supabase-client';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormLabel,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  useToast
} from '@chakra-ui/react';
import { noop } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { RealTimeItemsContext } from '../Provider/RealTimeItemsProvider';

export function AdjustEarningModal({
  isOpen,
  onClose,
  earning,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  earning: { id: string; value: number };
  id: string;
}) {
  const fixedInputEarning = earning.value.toFixed(2);
  const [isDirty, setIsDirty] = useState(false);
  const [earningValue, setEarningValue] = useState(fixedInputEarning);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setIsDirty(fixedInputEarning !== earningValue);
  }, [earningValue, fixedInputEarning]);

  async function updateEarning() {
    setIsUpdating(true);

    try {
      await updateCurrentEarning({ id, newValue: earningValue });
    } catch (error) {
      console.log(error);
      setHasError(true);
      setIsUpdating(false);
      return;
    }

    setIsUpdating(false);
    onClose();
    toast(createToastSettings({ title: 'Einnahmen erfolgreich bearbeitet', status: 'success' }));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Einnahmen bearbeiten</ModalHeader>
        <ModalCloseButton />
        {hasError && (
          <Alert mb="2" rounded={'lg'} status="error">
            <AlertIcon />
            <AlertTitle>Fehler beim bearbeiten!</AlertTitle>
            <AlertDescription>Versuche es später erneut.</AlertDescription>
          </Alert>
        )}
        <ModalBody>
          <InputGroup>
            <NumberInput
              clampValueOnBlur={true}
              precision={2}
              min={0}
              max={10000000}
              w="full"
              value={earningValue}
              onChange={newValue => setEarningValue(newValue)}
            >
              <NumberInputField />
            </NumberInput>
            <InputRightAddon>€</InputRightAddon>
          </InputGroup>
          <ItemSelection />
        </ModalBody>
        <ModalFooter>
          <Button
            autoFocus
            type="submit"
            isDisabled={!isDirty}
            onClick={updateEarning}
            isLoading={isUpdating}
            w="full"
            colorScheme="primary"
          >
            Speichern
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ItemSelection() {
  const items = useContext(RealTimeItemsContext);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();
  
  const variables = useVariables(selectedItem);

  if(!items) {
    return null;
  }
    return (
      <>
      <FormLabel>Produkt</FormLabel>
      <Select onChange={(event) => {
        const selecetedItem = items.find(item => item.id === event.target.value);
        setSelectedItem(selecetedItem);
      }} defaultValue="no-item" value={selectedItem?.id}>
        <option key={`default-value`} value="no-item">
          Kein Produkt ausgewählt
        </option>
        {items &&
          items.map((item) => (
            <option key={`role-key-${item.id}`} value={item.id}>
              {item.name}
            </option>
          ))}
      </Select>

      <FormLabel>Produkt Parameter</FormLabel>
            {
              Object.entries(variables).map(([key, values]) => {
                return (
                  <InputGroup key={key}>
                    <FormLabel>{values.name}</FormLabel>
                    <NumberInput
                      clampValueOnBlur={true}
                      precision={2}
                      min={0}
                      max={10000000}
                      w="full"
                      value={values.value}
                      onChange={noop}
                    />
                  </InputGroup>
                )
            }
            )
            }
        
      </>

    )

}


function useVariables(selectedItem?: Item): Record<string, EquationVariable & {value: number}> {
  if(!selectedItem) {
    return {}
  }

  return Object.entries(selectedItem.variables).reduce((currentVariables, [key, values]) => {
    return {...currentVariables, [key]: {...values, value: 0}}
  }, {})
}