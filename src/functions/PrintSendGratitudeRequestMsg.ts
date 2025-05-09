import { app, InvocationContext, Timer } from "@azure/functions";
//  Module to write to file, this will be replaced later for a sms msg broker module
import { writeFileSync, readFileSync, appendFileSync } from "fs";
import constantsJson from "./../data/constants.json";
import { formatMsgWithDate } from "../utils/formatters";


export async function PrintSendGratitudeRequestMsg(myTimer: Timer, context: InvocationContext): Promise<void> {

    const formattedMsgRecord = formatMsgWithDate(constantsJson.machineName, constantsJson.morningGratitudeRequestMsgText);
    
    // Append the request to the file. This will be replaced with a SMS to the user phone later on
    appendFileSync(constantsJson.txtFileResponseStack, formattedMsgRecord);
}

app.timer('PrintSendGratitudeRequestMsg', {
    schedule: '30 * * * * *',
    // schedule: '0 0 6 * * *',
    handler: PrintSendGratitudeRequestMsg
});
