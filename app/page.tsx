import MrtMap from "./components/MrtMap";

export default function Page() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        padding: "16px",
        boxSizing: "border-box",
        background: "#111",
      }}
    >
      <MrtMap />
    </main>
  );
}
