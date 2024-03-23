import { NextRequest, NextResponse } from "next/server";
import * as twofa from "node-2fa";
import { RedirectType, permanentRedirect } from "next/navigation";
export async function GET() {
  permanentRedirect("/create", RedirectType.push);
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const token = data.get("token");
  const url = data.get("url");
  const path = data.get("path");
  if (!token || !url || !path) {
    return NextResponse.json({
      error: "Invalid Data",
    });
  }

  if (verifyToken(token.toString())) {
    const response = await createShortLink(url.toString(), path.toString());
    if (response["error"]) {
      return NextResponse.json(response);
    } else
      return NextResponse.json({
        shortURL: response["shortURL"],
      });
  } else {
    return NextResponse.json({
      error: "Invalid Token",
    });
  }
}

async function createShortLink(url: string, path: string) {
  const API_KEY = process.env.SHORT_IO_API_KEY;
  if (!API_KEY) throw "API KEY NOT FOUND";
  const response = await fetch("https://api.short.io/links", {
    method: "POST",
    headers: {
      authorization: API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      originalURL: url,
      domain: "haider.id",
      path: path,
    }),
  });
  return await response.json();
}

function verifyToken(token: string) {
  const TWO_FACTOR_SECRET = process.env.TWO_FACTOR_SECRET;
  if (!TWO_FACTOR_SECRET) {
    throw "TWO FACTOR SECRET NOT FOUND";
  }
  return twofa.verifyToken(TWO_FACTOR_SECRET, token)?.delta == 0 ?? false;
}
