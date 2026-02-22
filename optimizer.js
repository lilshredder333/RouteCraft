
export class Optimizer {

    static distance(a, b) {
        return Math.hypot(a.lat - b.lat, a.lng - b.lng);
    }

    static nearest(points) {
        if (points.length === 0) return [];
        let unvisited = [...points];
        let current = unvisited.shift();
        let route = [current];

        while (unvisited.length) {
            let nearestIndex = 0;
            let nearestDist = Infinity;

            unvisited.forEach((p, i) => {
                const d = this.distance(current, p);
                if (d < nearestDist) {
                    nearestDist = d;
                    nearestIndex = i;
                }
            });

            current = unvisited.splice(nearestIndex, 1)[0];
            route.push(current);
        }

        return route;
    }

    static optimize(points) {
        return this.nearest(points);
    }
}
