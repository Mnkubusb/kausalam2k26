import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { get, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";

type StoredPass = {
  formData: {
    name: string;
    branch: string;
    year: string;
    interest: string;
    rollNo: string;
    enrollmentId: string;
  };
  passImage: string;
  updatedAt: number;
};

const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
};

const getIpKey = (ip: string) => createHash("sha256").update(ip).digest("hex");

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const ipKey = getIpKey(ip);
    const snapshot = await get(ref(db, `passesByIp/${ipKey}`));

    if (!snapshot.exists()) {
      return NextResponse.json({ pass: null });
    }

    return NextResponse.json({ pass: snapshot.val() as StoredPass });
  } catch (error) {
    console.error("Error reading pass by IP:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved pass." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = body?.formData as StoredPass["formData"] | undefined;
    const passImage = body?.passImage as string | undefined;

    if (!formData || !passImage) {
      return NextResponse.json(
        { error: "formData and passImage are required." },
        { status: 400 },
      );
    }

    const required = [
      formData.name,
      formData.branch,
      formData.year,
      formData.interest,
      formData.rollNo,
      formData.enrollmentId,
    ].every((value) => typeof value === "string" && value.trim().length > 0);

    if (!required || typeof passImage !== "string" || !passImage.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid pass payload." },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const ipKey = getIpKey(ip);

    await set(ref(db, `passesByIp/${ipKey}`), {
      formData,
      passImage,
      updatedAt: Date.now(),
    } satisfies StoredPass);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error storing pass by IP:", error);
    return NextResponse.json(
      { error: "Failed to save pass." },
      { status: 500 },
    );
  }
}
