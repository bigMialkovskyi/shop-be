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

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const client = new Client(dbOptions)
  await client.connect();

  try {
    const { rows: productList } = await client.query(`SELECT products.id, products.title, products.description, products.price, stocks.count FROM products INNER JOIN stocks ON products.id = stocks.product_id`);
   
    console.log('Request for a list of products, input parameters are not required.')

    return formatJSONResponse({
      message: `products received`,
      status: true,
      products: productList
    })

  } catch (error) {
    console.error('Error during database request executing', error);
    return formatJSONResponse({
      message: `code or DB error`,
      status: false,
    }, 500)
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);
