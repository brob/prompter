import { GraphQLClient } from 'graphql-request';


export const client = new GraphQLClient(import.meta.env.HYGRAPH_ENDPOINT)