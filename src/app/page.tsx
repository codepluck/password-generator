import PasswordGenerator from "./_password-generator";

export default function Home() {
  return (
    <section className="flex flex-col h-screen w-full justify-center items-center">
      <PasswordGenerator
        length={10}
        includeUppercase={true}
        includeLowercase={true}
        includeNumbers={true}
        includeSymbols={true}
      />
    </section>
  );
}
