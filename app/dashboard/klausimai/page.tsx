import PageTitleBar from "../components/page-title-bar"

export default function KlausimaiPage() {
  return (
    <>
      <PageTitleBar title="Klausimai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Klausimai</h1>
          <p>Čia bus rodoma klausimų informacija.</p>
        </div>
      </div>
    </>
  )
}

