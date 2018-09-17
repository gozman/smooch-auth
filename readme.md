#smooch-auth

Simple express app that demonstrates how to authenticate users in any messaging channel over Smooch.

### Required Environment Variables

`APP_ID`: Smooch App ID
`APP_KEY`: Smooch App Key
`APP_SECRET`: Smooch App Secret
`MONGODB_URI`: URI to a MongoDB Instance

The `dotenv` package is in use so you can quickly set up an environment on your local machine by creating a `.env` file.

### How to use

This sample implements the requisite server components that are described in the [Smooch Channel Transfer](https://docs.smooch.io/guide/channel-transfer/#channel-transfer).

1. Generate an [auth code](https://docs.smooch.io/rest/#get-auth-code)
2. Send a message with a webview action to the user. Link the action to `https://YOUR_DOMAIN/login` and add the `authCode` as a query parameter to the link.
3. When the user logs in or signs up in that webview, their messaging channel account will be connected to their user record.
