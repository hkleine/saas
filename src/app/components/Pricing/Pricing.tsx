'use client';
import { Price, ProductWithPrice, SubscriptionWithPriceAndProduct } from '@/types/types';
import { formatPrice } from '@/utils/formatPrice';
import { formatToDateString } from '@/utils/formatToDateString';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Badge, Box, Button, Card, CardBody, CardHeader, Flex, Grid, Heading, HStack, List, ListIcon, ListItem, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import Stripe from 'stripe';

type BillingInterval = 'year' | 'month';

interface Props {
  products: ProductWithPrice[];
  subscription: SubscriptionWithPriceAndProduct | null;
  paymentMethod: Stripe.PaymentMethod['card'] | null;
}

export function Pricing({ products, subscription }: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');

  return (
    <>
      {!subscription ? (
        <>
          <BillingIntervalSwitch billingInterval={billingInterval} setBillingInterval={setBillingInterval} />
          <Grid templateColumns="repeat(5, 200px)" gap={6}>
            {products.map(product => {
              return <PlanCard key={product.id} product={product} billingInterval={billingInterval} />;
            })}
          </Grid>
        </>
      ) : (
        <SubscriptionCard subscription={subscription} />
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
    <Card width={500}>
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
          <Button
            isLoading={isLoading}
            onClick={() => manageSubscription()}
            colorScheme="teal"
            size="sm"
            variant="outline"
          >
            Manage Subscription
          </Button>
        </Grid>
      </CardBody>
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
                /month
              </Text>
            </HStack>
          </Box>
          <VStack
            py={4}
            borderBottomRadius={'xl'}>
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
          <Button
            isLoading={isLoading}
            onClick={() => handleCheckout(price)}
            colorScheme="teal"
            variant="outline"
            w='full'
          >
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
      width='300px'
      bg='white'
      >
      {children}
    </Box>
  );
}

function BillingIntervalSwitch({
  billingInterval,
  setBillingInterval,
}: {
  billingInterval: BillingInterval;
  setBillingInterval: Dispatch<SetStateAction<BillingInterval>>;
}) {
  return (
    <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
      <button
        onClick={() => setBillingInterval('month')}
        type="button"
        className={`${
          billingInterval === 'month'
            ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
            : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
        } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
      >
        Monthly billing
      </button>
      <button
        onClick={() => setBillingInterval('year')}
        type="button"
        className={`${
          billingInterval === 'year'
            ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
            : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
        } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
      >
        Yearly billing
      </button>
    </div>
  );
}
