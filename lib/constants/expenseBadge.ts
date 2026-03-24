export const expenseBadge = {
    essential: {
        variant: "ghost",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
    },
    "non essential": {
        variant: "ghost",
        className: "bg-yellow-100 text-black dark:bg-yellow-950 dark:text-yellow-300",
    },
    cultural: {
        variant: "ghost",
        className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    },
    unexpected: {
        variant: "destructive",
        className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    }
} as const;