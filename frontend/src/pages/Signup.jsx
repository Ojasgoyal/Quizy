import { SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="flex mt-5 justify-center items-center">
      <SignedOut>
        <SignUp path="/signup" routing="path" signInUrl="/login"/>
      </SignedOut>
      <SignedIn>
        <div>You are already signed in</div>
        <UserButton />
      </SignedIn>
    </div>
  );
}
