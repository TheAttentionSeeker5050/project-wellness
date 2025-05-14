import { app, InvocationContext, Timer } from "@azure/functions";

import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";

// import { CosmosClient } from "@azure/cosmos";
import { Message } from "../models/message";
import { getCosmosContainer } from "./../cosmosClient"

export async function PrintSendGratitudeRequestMsg(myTimer: Timer, context: InvocationContext): Promise<void> {

    // Call our singleton cosmos client and get the container and database
    const container = getCosmosContainer()
    
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
        context.error("Could not print gratitude list request:", e?.message)
    }
}

app.timer('PrintSendGratitudeRequestMsg', {
    // schedule: '30 * * * * *', // Every 30 seconds
    schedule: '0 0 6 * * *', // Everyday at 6am
    handler: PrintSendGratitudeRequestMsg
});
