export const bagData = [
    "Bags Approved",
    "Bags Pending",
    "Bags Declined",
    "Total Bags Created",
    "Bags Deleted",
    "Mass Deleted",
    "Total Bags Deleted",
    "Bags Ordered",
    "Payments Failed",
    "Total Bags Ordered",
    "Open Bags",
];


export function getUniqueCombinations(result) {
    const countryMap = new Map();
    const waysToBuyMap = new Map();
    const dateSet = new Set();

    result.forEach(item => {
        const [countryId, countryLabel] = item.Country.split(':');
        const [waysToBuyId, waysToBuyLabel] = item.Ways_To_Buy.split(':');
        const asOfDate = item.As_of_Date;

        // Add country if not already added
        if (!countryMap.has(countryId)) {
            countryMap.set(countryId, countryLabel);
        }

        // Add way to buy if not already added
        if (!waysToBuyMap.has(waysToBuyId)) {
            waysToBuyMap.set(waysToBuyId, waysToBuyLabel);
        }

        // Add unique date
        dateSet.add(asOfDate);
    });

    // Convert maps to array of objects
    const countries = Array.from(countryMap, ([id, label]) => ({ id, label }));
    const waysToBuy = Array.from(waysToBuyMap, ([id, label]) => ({ id, label }));

    // Convert Set to sorted array
    const dates = Array.from(dateSet).sort();

    return { countries, waysToBuy, dates };
}

export function groupDataByCountryAndWaysToBuy(data) {
    // Initialize an empty result array to store the grouped objects
    let result = [];

    // Create a helper function to find or create a group for a specific Country and Ways_To_Buy
    function findOrCreateGroup(country, waysToBuy) {
        let group = result.find(item => item.Country === country && item.Ways_To_Buy === waysToBuy);
        if (!group) {
            group = {
                Country: country,
                Ways_To_Buy: waysToBuy,
                Day_Range: data.filter(item => item.Country === country && item.Ways_To_Buy === waysToBuy)[0].Day_Range, // Get any Day_Range for consistency
                Day_Desc: []
            };
            result.push(group);
        }
        return group;
    }

    // Iterate through each entry in the input data
    data.forEach(entry => {
        const { Country, Ways_To_Buy, Day_Desc, Bag_Status, GBI_Cnt, AOS_Cnt, FSI_Cnt } = entry;

        // Find or create the group for this entry
        const group = findOrCreateGroup(Country, Ways_To_Buy);

        // Check if the Day_Desc already exists in the group
        let dayDescGroup = group.Day_Desc.find(day => day.hasOwnProperty(Day_Desc));

        if (!dayDescGroup) {
            // If the Day_Desc does not exist, create it
            dayDescGroup = {
                [Day_Desc]: []
            };
            group.Day_Desc.push(dayDescGroup);
        }

        // Add the current Bag_Status information to the appropriate Day_Desc
        dayDescGroup[Day_Desc].push({
            Bag_Status: Bag_Status,
            GBI_Cnt: GBI_Cnt,
            AOS_Cnt: AOS_Cnt,
            FSI_Cnt: FSI_Cnt
        });
    });

    return result;
}

export function getBagStatusSumsByDay(data) {
    const dayTotals = {};

    data.forEach(entry => {
        entry.Day_Desc.forEach(dayObj => {
            const dayLabel = Object.keys(dayObj)[0]; 
            const statuses = dayObj[dayLabel];

            if (!dayTotals[dayLabel]) {
                dayTotals[dayLabel] = {};
            }

            statuses.forEach(statusObj => {
                const status = statusObj.Bag_Status;

                if (!dayTotals[dayLabel][status]) {
                    dayTotals[dayLabel][status] = { GBI_Cnt: 0, AOS_Cnt: 0, FSI_Cnt: 0 };
                }

                dayTotals[dayLabel][status].GBI_Cnt += statusObj.GBI_Cnt || 0;
                dayTotals[dayLabel][status].AOS_Cnt += statusObj.AOS_Cnt || 0;
                dayTotals[dayLabel][status].FSI_Cnt += statusObj.FSI_Cnt || 0;
            });
        });
    });

    return dayTotals;
}