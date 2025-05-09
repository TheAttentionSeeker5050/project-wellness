import { app, InvocationContext, output, Timer } from "@azure/functions";
//  Module to write to file, this will be replaced later for a sms msg broker module
import { writeFileSync, readFileSync, appendFileSync } from "fs";
import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";


export async function PrintSendGratitudeRequestMsg(myTimer: Timer, context: InvocationContext): Promise<void> {

    
    const formattedMsgRecord = formatMsgWithDate(constantsJson.machineName, constantsJson.morningGratitudeRequestMsgText);
    
    context.extraOutputs.set(sendToCosmosDb, {
        // create a random ID
        id: new Date().toISOString() + Math.random().toString().substring(2, 10),
        message: formattedMsgRecord,
        user: constantsJson.machineName,
        date: new Date()
    });

    // // Append the request to the file. This will be replaced with a SMS to the user phone later on
    // appendFileSync(constantsJson.txtFileResponseStack, formattedMsgRecord);
}

const sendToCosmosDb = output.cosmosDB({
  databaseName: 'gratitude-list-nosql-db',
  containerName: 'gratitude-list-db-container',
  createIfNotExists: false,
  connection: 'CosmosDBConnectionString',
});

app.timer('PrintSendGratitudeRequestMsg', {
    // schedule: '60 * * * * * *',
    extraOutputs: [sendToCosmosDb],
    schedule: '0 0 6 * * *',
    handler: PrintSendGratitudeRequestMsg
});
