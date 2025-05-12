import { app, InvocationContext, Timer } from "@azure/functions";
//  Module to write to file, this will be replaced later for a sms msg broker module
import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";

import { CosmosClient } from "@azure/cosmos";
import { Message } from "../models/message";

const cosmosClient = new CosmosClient(process.env["CosmosDBConnectionString"]);
const database = cosmosClient.database("gratitude-list-nosql-db");
const container = database.container("gratitude-list-db-container");


export async function PrintSendGratitudeRequestMsg(myTimer: Timer, context: InvocationContext): Promise<void> {

    try {
        // Current date and time:
        const now = new Date();
        // Format msg send by the machine
        const formattedMsgText = formatMsgWithDate(constantsJson.machineName, constantsJson.morningGratitudeRequestMsgText);

        const machineMessage: Message = {
            id: now.toISOString() + Math.random().toString().substring(2, 10),
            message: formattedMsgText,
            user: constantsJson.machineName,
            date: now
        };

        await container.items.create<Message>(machineMessage);
        

    } catch (e) {
        context.error("Could not print gratitude list request")
    }
}

app.timer('PrintSendGratitudeRequestMsg', {
    // schedule: '30 * * * * *', // Every 60 seconds
    extraOutputs: [],
    schedule: '0 0 6 * * *', // Everyday at 6am
    handler: PrintSendGratitudeRequestMsg
});
