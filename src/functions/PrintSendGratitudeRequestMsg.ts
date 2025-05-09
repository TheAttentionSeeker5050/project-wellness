import { app, InvocationContext, Timer } from "@azure/functions";
//  Module to write to file, this will be replaced later for a sms msg broker module
import { writeFileSync } from "fs";

export async function PrintSendGratitudeRequestMsg(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('PrintSendGratitudeRequestMsg', {
    schedule: '30 * * * * *',
    // schedule: '0 0 6 * * *',
    handler: PrintSendGratitudeRequestMsg
});
