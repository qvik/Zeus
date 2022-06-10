interface Station {
    id: number,
    name: string,
    imgSrc: string,    
}

interface MetroExit {
    id: number,
    name: string,
    stationId: number,
    latitude: string,
    longitude: string,
    imgSrc: any,
}

interface TravelMode {
    id: number,
    name: string,
}

interface Avoid {
    id: number,
    name: string,
}