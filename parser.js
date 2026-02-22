
export function parseGoogleMapsLink(url) {
    try {
        const decoded = decodeURIComponent(url);

        const coordsMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        const nameMatch = decoded.match(/\/place\/([^/]+)/);

        if (!coordsMatch) return null;

        const lat = parseFloat(coordsMatch[1]);
        const lng = parseFloat(coordsMatch[2]);
        const name = nameMatch ? nameMatch[1].replace(/\+/g, " ") : "Lugar";

        return { name, lat, lng };
    } catch {
        return null;
    }
}
