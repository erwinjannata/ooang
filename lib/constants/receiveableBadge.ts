export const receiveableBadge = {
    partial: {
        variant: "default",
        className: "bg-black/60",
    },
    settled: {
        variant: "default",
        className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    },
    paid: {
        variant: "default",
        className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    },
    unpaid: {
        variant: "destructive",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    }
} as const;