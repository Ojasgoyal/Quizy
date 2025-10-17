import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex mt-5 justify-center items-center">
      <SignedOut>
        <SignIn path="/login" routing="path" signUpUrl="/signup" />
      </SignedOut>
      <SignedIn>
        <div>You are already signed in</div>
        <UserButton />
      </SignedIn>
    </div>
  );
}
