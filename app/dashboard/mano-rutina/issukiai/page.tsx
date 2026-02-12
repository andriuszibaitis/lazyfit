import PageTitleBar from "../../components/page-title-bar";

export default function ManoRutinaIssukiaiPage() {
  return (
    <>
      <PageTitleBar title="Mano rutina" />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2
              className="text-[36px] font-semibold text-[#101827]"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Iššūkiai
            </h2>
            <p className="text-[#6B7280] mt-4">Jūsų iššūkiai bus rodomi čia.</p>
          </div>
        </div>
      </div>
    </>
  );
}
