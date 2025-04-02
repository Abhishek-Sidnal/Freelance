export const filter1Options = [
    { id: "c1", label: "c1" },
    { id: "c2", label: "c2" },
    { id: "c3", label: "c3" },
    { id: "c4", label: "c4" },
];



export const filter2Options = [
    { id: "w1", label: "w1" },
    { id: "w2", label: "w2" },
    { id: "w3", label: "w3" },
    { id: "w4", label: "w4" },
];

export const bagStatuses = [
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


export const generateLast8Days = () => {
    const dates = [];
    for (let i = 0; i < 8; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        
        let formattedDate = date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });

        dates.push({
            id: formattedDate,
            label: formattedDate,
        });
    }
    return dates;
};
