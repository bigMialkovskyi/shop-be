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

const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const client = new Client(dbOptions)
  await client.connect();

  try {

    if (!event.body.title || !event.body.description || !event.body.price || !event.body.count) {
      return formatJSONResponse({
        message: `incoming data is invalid`,
        status: false,
      }, 400)
    }

    const newProduct = (await client.query(`
    insert into products (title, description, price) values (
    '${event.body.title}', 
    '${event.body.description}', 
    '${event.body.price}') 
    returning *`)).rows[0];

    const newStock = (await client.query(`
    insert into stocks (product_id, count) values (
    '${newProduct.id}', 
    '${event.body.count}') 
    returning *`)).rows[0];

    console.log(
      {
        message: 'create new product bu user',
        usedTitle: event.body.title,
        userDescription: event.body.description,
        userPrice: event.body.proce,
        userCount: event.body.count
      }
    )
    return formatJSONResponse({
      message: "A new product has been created",
      product: { ...newProduct, count: newStock.count },
    });

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

export const main = middyfy(create);
