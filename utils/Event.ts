export class CalendarEntry {
    title: string;
    start: Date;
    end: Date;
    location: string;

    constructor(title: string, start: Date, end: Date, location: string) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.location = location;
    }
}

export class WeatherEntry {
    temperature: number;
    conditions: string;

    constructor(temperature: number, conditions: string) {
        this.temperature = temperature;
        this.conditions = conditions;
    }
}

export class CommutePart {
    start: Date;
    end: Date;
    description: string;

    constructor(start: Date, end: Date, description: string) {
        this.start = start;
        this.end = end;
        this.description = description;
    }
}

export class CommuteEntry {
    parts: CommutePart[];

    constructor(parts: CommutePart[]) {
        this.parts = parts;
    }
}

export class Event {
    calendar: CalendarEntry;
    weather: WeatherEntry;
    commute: CommuteEntry;
    info: String;

    constructor(calendar: CalendarEntry, weather: WeatherEntry, commute: CommuteEntry, info: String) {
        this.calendar = calendar;
        this.weather = weather;
        this.commute = commute;
        this.info = info;
    }
}