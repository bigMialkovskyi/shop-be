import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productsList from './productsList.js'

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters

  const results = productsList.filter(function (product) {
    if (id == product.id) return product
    return false
  })

  if (results[0]) return formatJSONResponse({
    message: `products received`,
    status: true,
    product: results[0]
  });

  return formatJSONResponse({
    message: `product not found`,
    status: false
  }, 404)
};

export const main = middyfy(getProductsById);