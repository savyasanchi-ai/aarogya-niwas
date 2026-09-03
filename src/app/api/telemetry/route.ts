import { NextResponse } from "next/server";

// In-memory data store for the bedside IoT unit
let latestTelemetry = {
  bedId: "Bed #14 (Vishram Sadan)",
  heartRate: 74,
  spO2: 98,
  roomTemp: 24.5,
  sosTriggered: false,
  lastUpdated: new Date().toISOString(),
};

// GET: The website checks this every second to display live data
export async function GET() {
  return NextResponse.json(latestTelemetry);
}

// POST: External devices (or test scripts) send new vitals and SOS alerts here
export async function POST(req: Request) {
  try {
    const body = await req.json();

    latestTelemetry = {
      bedId: body.bedId || latestTelemetry.bedId,
      heartRate: body.heartRate ?? latestTelemetry.heartRate,
      spO2: body.spO2 ?? latestTelemetry.spO2,
      roomTemp: body.roomTemp ?? latestTelemetry.roomTemp,
      sosTriggered: Boolean(body.sosTriggered),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ status: "success", received: latestTelemetry });
  } catch {
    return NextResponse.json({ status: "error", message: "Invalid payload" }, { status: 400 });
  }
}