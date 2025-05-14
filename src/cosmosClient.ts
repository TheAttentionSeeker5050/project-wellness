import { Container, CosmosClient, Database } from '@azure/cosmos';

let client: CosmosClient | null = null;
let database: Database | null = null;
let container: Container | null = null;

// Singleton get cosmos client to keep it persistent and usable among all our functions
export function getCosmosClient(): CosmosClient {
  if (!client) {
    client = new CosmosClient(process.env["CosmosDBConnectionString"]);
    console.log('CosmosClient created');
  }

  return client;
}

// Singleton get cosmos database
export function getCosmosDatabase(): Database {
  if (!database) {
    database = getCosmosClient().database("gratitude-list-nosql-db");
    console.log('Cosmos database created');
  }

  return database;
}

// Singleton get cosmos container
export function getCosmosContainer(): Container {
  if (!container) {
    container = getCosmosDatabase().container("gratitude-list-db-container");
    console.log('Cosmos container created');
  }

  return container;
}