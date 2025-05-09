import { app, InvocationContext, Timer } from "@azure/functions";
//  Module to write to file, this will be replaced later for a sms msg broker module
import { writeFileSync, readFileSync, appendFileSync } from "fs";


export async function PrintSendGratitudeRequestMsg(myTimer: Timer, context: InvocationContext): Promise<void> {
    const fileLocation = "src/models/responseStack.txt";
    const dateNow = new Date().toString();
    const morningGratitudeRequestMsgText = `Good morning champ! Hope you slept well. It’s your wellness pal reminding you to name 3 things you are thankful for today. -> Sent at ${dateNow} \n`;
    
    // Append the request to the file. This will be replaced with a SMS to the user phone later on
    appendFileSync(fileLocation, morningGratitudeRequestMsgText);
}

app.timer('PrintSendGratitudeRequestMsg', {
    schedule: '30 * * * * *',
    // schedule: '0 0 6 * * *',
    handler: PrintSendGratitudeRequestMsg
});
