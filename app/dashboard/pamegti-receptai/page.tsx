import PageTitleBar from "../components/page-title-bar"

export default function PamegtiReceptaiPage() {
  return (
    <>
      <PageTitleBar title="Pamėgti receptai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pamėgti receptai</h1>
          <p>Čia bus rodoma pamėgtų receptų informacija.</p>
        </div>
      </div>
    </>
  )
}

