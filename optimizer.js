
export class RouteOptimizer {

    static distance(a, b) {
        return Math.hypot(a.lat - b.lat, a.lng - b.lng);
    }

    static totalDistance(route) {
        let dist = 0;
        for (let i = 0; i < route.length - 1; i++) {
            dist += this.distance(route[i], route[i + 1]);
        }
        return dist;
    }

    static nearestNeighbor(points) {
        let unvisited = [...points];
        let current = unvisited.shift();
        let route = [current];

        while (unvisited.length) {
            let nearestIndex = 0;
            let nearestDist = Infinity;

            unvisited.forEach((p, i) => {
                const dist = this.distance(current, p);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestIndex = i;
                }
            });

            current = unvisited.splice(nearestIndex, 1)[0];
            route.push(current);
        }

        return route;
    }

    static twoOpt(route) {
        let improved = true;

        while (improved) {
            improved = false;
            for (let i = 1; i < route.length - 2; i++) {
                for (let j = i + 1; j < route.length; j++) {
                    const newRoute = route.slice();
                    newRoute.splice(i, j - i, ...route.slice(i, j).reverse());

                    if (this.totalDistance(newRoute) < this.totalDistance(route)) {
                        route = newRoute;
                        improved = true;
                    }
                }
            }
        }

        return route;
    }

    static optimize(points) {
        let route = this.nearestNeighbor(points);
        route = this.twoOpt(route);
        return route;
    }
}
