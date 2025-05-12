import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";


import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";


import { CosmosClient, FeedResponse } from "@azure/cosmos";
import { Message } from "../models/message";

const cosmosClient = new CosmosClient(process.env["CosmosDBConnectionString"]);
const database = cosmosClient.database("gratitude-list-nosql-db");
const container = database.container("gratitude-list-db-container");

export async function HTTPSendGratitudeListMsg(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    if (request.method === "GET") {
        try {
    
            const querySpec = {
                query: "SELECT * FROM c"
            };
            const { resources: items }: FeedResponse<Message> = await container.items.query<Message>(querySpec).fetchAll();

            return {
                status: 200,
                body: JSON.stringify(items),
                headers: {
                    "Content-Type": "application/json"
                }
            };

        } catch (e) {
            return {
                status: 500,
                body: `Error retrieving items: ${e.message}`
            };
        }
    }
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

            // Current date and time:
            const now = new Date();
            
            const userMessage: Message = {
                id: now.toISOString() + Math.random().toString().substring(2, 10),
                message: formattedUserResponseMsgRecord,
                user: constantsJson.userName,
                date: now
            };

            const machineMessage:Message = {
                id: now.toISOString() + Math.random().toString().substring(2, 10),
                message: formattedMachineResponseMsgRecord,
                user: constantsJson.machineName,
                date: now
            };

            await container.items.create<Message>(userMessage);
            await container.items.create<Message>(machineMessage);

        } catch (e) {
            return {status: 500, body: "Something occurred: " + e.message}
        }

        return {body: "Submission successful"}
    }
};

app.http('HTTPSendGratitudeListMsg', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [],
    route: "message",
    handler: HTTPSendGratitudeListMsg
});
