import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  return (
    <>
      <SignedOut>{children}</SignedOut>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
    </>
  );
}
