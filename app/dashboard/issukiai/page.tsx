import PageTitleBar from "../components/page-title-bar"

export default function IssukiaiPage() {
  return (
    <>
      <PageTitleBar title="Iššūkiai" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Iššūkiai</h1>
          <p>Čia bus rodoma iššūkių informacija.</p>
        </div>
      </div>
    </>
  )
}

