Service is done, FE is working as expected.

Additional scope:

POST/products lambda functions returns error 400 status code if product data is invalid
All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)
All lambdas do console.log for each incoming requests and their arguments
Transaction based creation of product

Product-service API:

/products: https://szrdjudmhf.execute-api.eu-west-1.amazonaws.com/dev/products   
/products/{Id}: https://szrdjudmhf.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
/swagger: https://app.swaggerhub.com/apis/VLADMALPRO37/shop-be/1.0.0

Link to FE: https://d2e9b8763t9dc1.cloudfront.net
Link to FE repositorie: https://github.com/bigMialkovskyi/shop-vue-vuex-cloudfront