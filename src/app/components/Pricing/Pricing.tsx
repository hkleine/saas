'use client';
import { Price, ProductWithPrice, SubscriptionWithPriceAndProduct } from '@/types/types';
import { formatPrice } from '@/utils/formatPrice';
import { formatToDateString } from '@/utils/formatToDateString';
import { getExpirationDate } from '@/utils/getExpirationDate';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Stripe from 'stripe';
import { Switch } from '../Atoms/Switch';

type BillingInterval = 'year' | 'month';

interface Props {
  products: ProductWithPrice[];
  subscription: SubscriptionWithPriceAndProduct | null;
  paymentMethod: Stripe.PaymentMethod['card'] | null;
}

export function Pricing({ products, subscription, paymentMethod }: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');

  return (
    <>
      {!subscription ? (
        <Flex direction="column" gap={4}>
          <Switch option1="month" option2="year" value={billingInterval} setValue={setBillingInterval} />
          <Grid templateColumns="repeat(5, 200px)" gap={6}>
            {products.map(product => {
              return <PlanCard key={product.id} product={product} billingInterval={billingInterval} />;
            })}
          </Grid>
        </Flex>
      ) : (
        <HStack gap={4}>
          <SubscriptionCard subscription={subscription} />
          <CreditCard paymentMethod={paymentMethod} />
        </HStack>
      )}
    </>
  );
}

function SubscriptionCard({ subscription }: { subscription: SubscriptionWithPriceAndProduct }) {
  const [isLoading, setLoading] = useState(false);
  const formattedPrice = formatPrice(subscription.prices);
  const manageSubscription = async () => {
    setLoading(true);
    try {
      const { url } = await postData({
        url: '/api/create-portal-link',
      });
      window.location.assign(url);
    } catch (error) {
      return alert((error as Error)?.message);
    }
  };

  return (
    <Card width={350}>
      <CardHeader>
        <Heading size="md">Billing Details</Heading>
      </CardHeader>
      <CardBody>
        <Grid gap={2}>
          <Flex alignItems="center" gap={2}>
            <Text fontWeight={600}>{subscription.prices.products.name}</Text>
            {subscription.cancel_at ? (
              <Badge px={2} py={0.5} borderRadius="md" colorScheme="red">
                canceled on {formatToDateString(subscription.cancel_at)}
              </Badge>
            ) : (
              <Badge px={2} py={0.5} borderRadius="md" colorScheme="green">
                active
              </Badge>
            )}
          </Flex>

          <Text>
            {formattedPrice} /{subscription.prices.interval}
          </Text>
          <Button isLoading={isLoading} onClick={() => manageSubscription()} size="sm" variant="outline">
            Manage Subscription
          </Button>
        </Grid>
      </CardBody>
    </Card>
  );
}

function CreditCard({ paymentMethod }: Pick<Props, 'paymentMethod'>) {
  if (!paymentMethod) {
    return null;
  }
  const expirationDate = getExpirationDate(paymentMethod);

  return (
    <Card color="white" backgroundImage="url('/assets/creditCard.svg')" width={350} height={200} p={5}>
      <Flex h="full" direction="column" justifyContent="space-between">
        <Flex justifyContent="space-between">
          <span>{paymentMethod.brand}</span>
          <span>{expirationDate}</span>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex gap={2}>
            <span>{'••••'}</span>
            <span>{'••••'}</span>
            <span>{'••••'}</span>
          </Flex>
          <span>{paymentMethod.last4}</span>
        </Flex>
      </Flex>
    </Card>
  );
}

function PlanCard({ product, billingInterval }: { product: ProductWithPrice; billingInterval: BillingInterval }) {
  const [isLoading, setIsLoading] = useState(false);
  const price = product?.prices?.find(price => price.interval === billingInterval);
  if (!price) return null;
  const formattedPrice = formatPrice(price);

  const handleCheckout = async (price: Price) => {
    setIsLoading(true);
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      setIsLoading(false);
      return alert((error as Error)?.message);
    }
  };

  return (
    <PriceWrapper>
      <Box py={4} px={12}>
        <Text fontWeight="500" fontSize="2xl">
          {product.name}
        </Text>
        <HStack justifyContent="center">
          <Text fontSize="5xl" fontWeight="900">
            {formattedPrice}
          </Text>
          <Text fontSize="3xl" color="gray.500">
            /{billingInterval}
          </Text>
        </HStack>
      </Box>
      <VStack py={4} borderBottomRadius={'xl'}>
        <List spacing={3} textAlign="start" px={12}>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            unlimited build minutes
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Lorem, ipsum dolor.
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            5TB Lorem, ipsum dolor.
          </ListItem>
        </List>
        <Box w="80%" pt={7}>
          <Button isLoading={isLoading} onClick={() => handleCheckout(price)} variant="outline" w="full">
            Subscribe
          </Button>
        </Box>
      </VStack>
    </PriceWrapper>
  );
}

function PriceWrapper({ children }: { children: ReactNode }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}
      width="300px"
      bg="white"
    >
      {children}
    </Box>
  );
}
