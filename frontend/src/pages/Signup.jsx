import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="flex mt-5 justify-center items-center">
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
}
