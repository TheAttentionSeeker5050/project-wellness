export function formatMsgWithDate(sender: string, messageStr: string) {
    const dateNow = new Date().toString();

    return `${sender} says: ${messageStr} -> Sent at ${dateNow} \n`
}