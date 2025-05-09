import { app, Exception, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

import { writeFileSync, readFileSync, appendFileSync } from "fs";

import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";

const sendToCosmosDb = output.cosmosDB({
  databaseName: 'gratitude-list-nosql-db',
  containerName: 'gratitude-list-db-container',
  createIfNotExists: false,
  connection: 'CosmosDBConnectionString',
});

export async function HTTPSendGratitudeListMsg(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    if (request.method === "GET")
        return {body: "Hello message GET"}
    else {

        // get the request body
        const requestFormData = await request.json().catch((reason) => {
            return {status: 400, body: "Please enter the data"}
        });
        try {

            if (typeof requestFormData["answers"] !== "object") return {status: 400, body: "Invalid gratitude format, must use array under the json key 'answer'"}
            
            const answersArray:Array<string> = Array.from(requestFormData["answers"]) ?? [];
            if (answersArray.length !== 3) return {status: 400, body: "Please enter the 3 gratitudes"}
            
            const formattedUserResponseMsgRecord: string = formatMsgWithDate(constantsJson.userName, `My 3 gratitudes are: ${answersArray.join(", ")}`);
            const formattedMachineResponseMsgRecord: string = formatMsgWithDate(constantsJson.machineName, constantsJson.gratitudesSubmissionSuccessMsg);
            
            // appendFileSync(constantsJson.txtFileResponseStack, formattedUserResponseMsgRecord);
            // appendFileSync(constantsJson.txtFileResponseStack, formattedMachineResponseMsgRecord);

            // Record message by user
            context.extraOutputs.set(sendToCosmosDb, {
                // create a random ID
                id: new Date().toISOString() + Math.random().toString().substring(2, 10),
                message: formattedUserResponseMsgRecord,
                user: constantsJson.userName,
                date: new Date()
            });

            // Record reply by machine
            context.extraOutputs.set(sendToCosmosDb, {
                // create a random ID
                id: new Date().toISOString() + Math.random().toString().substring(2, 10),
                message: formattedMachineResponseMsgRecord,
                user: constantsJson.machineName,
                date: new Date()
            });

        } catch (e) {
            return {status: 500, body: "Something occurred: " + e.message}
        }


        return {body: "Submission successful"}
    }
};

app.http('HTTPSendGratitudeListMsg', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [sendToCosmosDb],
    route: "message",
    handler: HTTPSendGratitudeListMsg
});
