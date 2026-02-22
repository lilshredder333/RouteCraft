
export class Storage {
    static load() {
        return JSON.parse(localStorage.getItem("routecraft_data")) || { trips: [] };
    }

    static save(data) {
        localStorage.setItem("routecraft_data", JSON.stringify(data));
    }
}

class StorageAdapter {
  saveTrip(trip) {}
  getTrips() {}
}

class LocalStorageAdapter extends StorageAdapter {
  saveTrip(trip) {
    localStorage.setItem(`trip_${trip.id}`, JSON.stringify(trip));
  }
}