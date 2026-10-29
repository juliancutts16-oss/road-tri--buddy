// Number plate lookup via the DVLA Vehicle Enquiry Service.
// The DVLA record gives make, colour and year, but not the model or body shape.
import { json, checkPasscode, featureOff, readBody } from "../lib/common.mjs";

const COLOURS = {
  WHITE: "white", CREAM: "white", BEIGE: "white", IVORY: "white",
  BLACK: "black",
  SILVER: "silver", GREY: "silver", GRAY: "silver",
  BLUE: "blue", TURQUOISE: "blue",
  RED: "red", MAROON: "red", PINK: "red",
  GREEN: "green",
  YELLOW: "yellow", GOLD: "yellow",
  ORANGE: "orange", BRONZE: "orange", BROWN: "orange",
  PURPLE: "purple",
};
const SUV_MAKES = ["LAND ROVER", "RANGE ROVER", "JEEP", "SSANGYONG", "ISUZU"];

export default async (req) => {
  const off = featureOff("cars-houses");
  if (off) return off;
  const denied = checkPasscode(req);
  if (denied) return denied;
  const key = process.env.DVLA_API_KEY;
  if (!key) return json({ error: "The DVLA lookup is not set up on the server." }, 503);

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return json({ error: e.message }, 400);
  }
  const plate = String(body.plate || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (plate.length < 2 || plate.length > 8) return json({ error: "That doesn’t look like a UK number plate." }, 400);

  const res = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key },
    body: JSON.stringify({ registrationNumber: plate }),
  });
  if (res.status === 404) return json({ error: "No vehicle was found with that number plate." }, 404);
  if (res.status === 400) return json({ error: "The DVLA didn’t accept that number plate." }, 400);
  if (!res.ok) return json({ error: `The DVLA service answered ${res.status}. Try again later.` }, 502);

  const v = await res.json();
  const make = String(v.make || "").toUpperCase();
  const colourWord = String(v.colour || "").toUpperCase().split(/[\s-]/)[0];
  return json({
    make: v.make ? v.make.charAt(0) + v.make.slice(1).toLowerCase() : "",
    colour: v.colour || "",
    color: COLOURS[colourWord] || null,
    year: v.yearOfManufacture || null,
    body: SUV_MAKES.some((m) => make.startsWith(m)) ? "suv" : null,
  });
};

export const config = { path: "/api/vehicle" };
