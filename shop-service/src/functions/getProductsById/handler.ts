import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};
 
const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters
  const client = new Client(dbOptions)
  await client.connect();

  try {
    const { rows: productItem } = await client.query(`
    SELECT products.id, products.title, products.description, products.price, stocks.count FROM products INNER JOIN stocks ON products.id = stocks.product_id where id='${id}'`);
    
    console.log({
      message: 'get element by id',
      userSentID: id
    })

    return formatJSONResponse({
      message: `product received`,
      status: true,
      products: productItem })

  } catch (error) {
    console.error('Error during database request executing', error);
    return formatJSONResponse({
      message: `product not found. code or DB error`,
      status: false,
    }, 500)
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsById);