import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex mt-5 justify-center items-center">
      <SignIn path="/login" routing="path" signUpUrl="/signup" />
    </div>
  );
}
