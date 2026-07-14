"use client";
import { useEffect } from "react";
import "./telon.css";
import { MARKUP } from "./markup";
import { initTelon } from "./choreography";

export default function TelonPage() {
  useEffect(() => { const cleanup = initTelon(); return cleanup; }, []);
  return <main className="telon-root" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
