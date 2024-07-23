## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## .env File
You will need to edit the .env file in the root directory of the project and create some API keys and properties.

```
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET= # a secret string of characters, up to you how long you want to make it
MONGO_COLLECTION= # mongoDB collection (you will have to make this yourself)
MONGO_USER= # mongoDB username (for access - you will have to make this yourself)
MONGODB_PASS= # mongoDB password (for access - you will have to make this yourself)
MONGODB_URI= # mongoDB URI to the database
BASE_URL=localhost:3000
SENDGRID_API= # email API key (you will have to make this yourself)
NEXT_PUBLIC_API_TOKEN= # a secret string of characters, up to you how long you want to make it
```

examples:
```
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=VEWVGQGQGQQ££!%!"%¬!%T"EDFASWGTHJEWG
MONGO_COLLECTION=<bast_inc_DEV>       # MUST have the < > parenthesis
# MONGO_COLLECTION=<bast_inc_PROD>    # MUST have the < > parenthesis
MONGO_USER= {some username}
MONGODB_PASS= {some password}
MONGODB_URI=mongodb+srv://${MONGO_USER}:${MONGODB_PASS}@cluster0.location.mongodb.net/${MONGO_COLLECTION}?retryWrites=true&w=majority
BASE_URL=localhost:3000
SENDGRID_API= {sendgrid api}
NEXT_PUBLIC_API_TOKEN=ASF"53"?qSFA?S5"£!FQFq!!£%^£
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
