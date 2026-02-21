
export class Storage {
    static save(data) {
        localStorage.setItem("routecraft_places", JSON.stringify(data));
    }

    static load() {
        return JSON.parse(localStorage.getItem("routecraft_places")) || [];
    }
}
