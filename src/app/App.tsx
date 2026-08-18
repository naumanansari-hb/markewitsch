import React from "react";
import { Toaster } from "sonner";
import { CraneInquiryPrototype } from "./components/markewitsch/CraneInquiryPrototype";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <CraneInquiryPrototype />
      <Toaster position="top-right" richColors />
    </div>
  );
}