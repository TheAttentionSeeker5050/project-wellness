import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { writeFileSync, readFileSync, appendFileSync } from "fs";

import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";

export async function HTTPSendGratitudeListMsg(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // context.log(`Http function processed request for url "${request.url}"`);

    // const name = request.query.get('name') || await request.text() || 'world';

    // return { body: `Hello, ${name}!` };

    if (request.method === "GET")
        return {body: "Hello message GET"}
    else {

        // get the request body
        const requestFormData = await request.json().catch((reason) => {
            return {status: 400, body: "Please enter the data"}
        });

        if (typeof requestFormData["answers"] !== "object") return {status: 400, body: "Invalid gratitude format, must use array under the json key 'answer'"}

        const answersArray:Array<string> = Array.from(requestFormData["answers"]) ?? [];
        if (answersArray.length !== 3) return {status: 400, body: "Please enter the 3 gratitudes"}

        const formattedUserResponseMsgRecord: string = formatMsgWithDate(constantsJson.userName, `My 3 gratitudes are: ${answersArray.join(", ")}`);
        const formattedMachineResponseMsgRecord: string = formatMsgWithDate(constantsJson.machineName, constantsJson.gratitudesSubmissionSuccessMsg);

        appendFileSync(constantsJson.txtFileResponseStack, formattedUserResponseMsgRecord);
        appendFileSync(constantsJson.txtFileResponseStack, formattedMachineResponseMsgRecord);


        return {body: "Submission successful"}
    }
};

app.http('HTTPSendGratitudeListMsg', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: "message",
    handler: HTTPSendGratitudeListMsg
});
