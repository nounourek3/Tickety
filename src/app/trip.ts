export interface Trip {
    id: number;
    subject: string;
    origin: string;
    destination: string;
    type?: string;
    date: string;
    departureTime: string;
    landingTime: string;
    airline: string;
    flightNumber: string;
    bookingNumber: string;
    passengerNames: string;
    content?: string; // Optional field for email content
  }