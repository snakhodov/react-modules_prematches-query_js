import {getRoot} from "mobx-state-tree";


const createAndSet = () => {

};
export const setMatches = (data) => {
    Object.keys(res.data).forEach((sportId) => {
        const sport = {
            i: sportId.toString(),
            n: res.data[sportId].n
        };
        if (getRoot(self).sports.has(sport.i)) {
            getRoot(self).sports.get(sport.i).updateItem(sport);
        } else {
            getRoot(self).setItem(sport, 'sports');
        }
        const categories = res.data[sportId].c;
        Object.keys(categories).forEach((categoryId) => {
            const category = {
                i: categoryId.toString(),
                n: categories[categoryId].n,
                o: categories[categoryId].o
            };
            if (getRoot(self).categories.has(category.i)) {
                getRoot(self).categories.get(category.i).updateItem(category);
            } else {
                getRoot(self).setItem(category, 'categories');
            }
            const tournaments = categories[categoryId].t;
            Object.keys(tournaments).forEach((tournamentId) => {
                const tournament = {
                    i: tournamentId.toString(),
                    n: tournaments[tournamentId].n,
                    o: tournaments[tournamentId].o
                };
                if (getRoot(self).tournaments.has(tournament.i)) {
                    getRoot(self).tournaments.get(tournament.i).updateItem(tournament);
                } else {
                    getRoot(self).setItem(tournament, 'tournaments');
                }
            })
        })
    })
}