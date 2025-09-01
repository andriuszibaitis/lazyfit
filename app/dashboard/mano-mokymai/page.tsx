import PageTitleBar from "../components/page-title-bar"

export default function ManoMokymaiPage() {
  return (
    <>
      <PageTitleBar title="Mano mokymai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Mano mokymai</h1>
          <p>Čia bus rodoma mano mokymų informacija.</p>
        </div>
      </div>
    </>
  )
}

