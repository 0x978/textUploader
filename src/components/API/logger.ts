export default async function logger(state: Capitalize<string>, isImportant: boolean, additionalArgs?: [Capitalize<string>, string][]) {
    try {
        const dateTime = new Date().toLocaleDateString("en-gb", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        });
        const ipAddressArg = additionalArgs?.find((arg) => arg[0] === "IP");
        if (ipAddressArg && ipAddressArg[1] !== undefined) {
            const res = await fetch(`https://ipapi.co/${ipAddressArg[1]}/json/`);
            const data = await res.json() as { country_name: string; city: string; utc_offset: string };
            const country = data.country_name;
            const city = data.city;
            const localTime = createTimeWithOffset(data.utc_offset);
            additionalArgs?.push(["COUNTRY", country], ["CITY", city], ["LOCAL TIME", localTime]);

        }
        printDivider(isImportant);
        console.log(`
${state}:
TIME:${dateTime}
${(additionalArgs ?? []).map(([key, value]) => `${key}: ${value}`).join("\n")}
`);
        printDivider(isImportant);
    }
    catch (e) {
        printDivider(true);
        console.log("LOGGING FAILED");
        console.log(e);
        printDivider(true);
    }
}

function createTimeWithOffset(utcOffsetStr: string) {
    // Parse the UTC offset from the provided string
    const hours = parseInt(utcOffsetStr.substring(0, 3), 10);
    const minutes = parseInt(utcOffsetStr.substring(3), 10);

    // Calculate the total offset in milliseconds
    const totalOffsetMs = (hours * 60 + minutes) * 60 * 1000;

    // Get the current UTC time
    const now = new Date();

    // Calculate the local time based on the UTC offset
    const localTime = new Date(now.getTime() + totalOffsetMs);

    // Extract hours and minutes
    const localHours = localTime.getUTCHours();
    const localMinutes = localTime.getUTCMinutes();

    // Format the time in 24-hour format (e.g., "13:35")
    return `${String(localHours).padStart(2, "0")}:${String(localMinutes).padStart(2, "0")}`;
}

function printDivider(isImportant: boolean) {
    isImportant ?
        console.log("===================================================================================================")
        :
        console.log("---------------------------------------------------------------------------------------------------");
}