export const orderBy = (collection, iteratees, orders) => {
    // Normalize iteratees and orders into arrays if they aren't already
    iteratees = Array.isArray(iteratees) ? iteratees : [iteratees];
    orders = Array.isArray(orders) ? orders : [orders];

    // Sort the collection using a custom comparator
    return collection.sort((a, b) => {
        for (let i = 0; i < iteratees.length; i++) {
            const iteratee = iteratees[i];
            const order = orders[i] || 'asc'; // Default to ascending if not specified

            const valueA = typeof iteratee === 'function' ? iteratee(a) : a[iteratee];
            const valueB = typeof iteratee === 'function' ? iteratee(b) : b[iteratee];

            // Compare the values based on the order
            if (valueA < valueB) {
                return order === 'asc' ? -1 : 1;
            } else if (valueA > valueB) {
                return order === 'asc' ? 1 : -1;
            }
        }

        return 0; // If all criteria are equal, no sorting needed
    });
}