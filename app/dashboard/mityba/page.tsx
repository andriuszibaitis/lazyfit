import PageTitleBar from "../components/page-title-bar"

export default function MitybaPage() {
  return (
    <>
      <PageTitleBar title="Mityba" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Mityba</h1>
          <p>Čia bus rodoma mitybos informacija.</p>
        </div>
      </div>
    </>
  )
}

