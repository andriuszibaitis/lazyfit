import PageTitleBar from "./components/page-title-bar";

export default function ApzvalgaPage() {
  return (
    <>
      <PageTitleBar title="Apžvalga" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Apžvalga</h1>
          <p>Čia bus rodoma apžvalgos informacija.</p>
        </div>
      </div>
    </>
  );
}
