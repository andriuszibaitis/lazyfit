"use client";

interface StreakCardProps {
  userName?: string | null;
  streakDays?: number;
  daysUntilAchievement?: number;
  achievementName?: string;
}

export default function StreakCard({
  userName,
  streakDays = 1,
  daysUntilAchievement = 6,
  achievementName = "Nestabdomas",
}: StreakCardProps) {
  const firstName = userName?.split(" ")[0] || "Vartotojau";
  const isFirstDay = streakDays === 1;

  return (
    <div className="bg-[#101827] rounded-2xl p-6 text-white relative overflow-hidden h-full">
      <div>
        <p
          className="text-[13px] font-normal mb-2"
          style={{ fontFamily: "Outfit, sans-serif", lineHeight: "120%" }}
        >
          {isFirstDay ? "Sėkminga pradžia! Prisijungei:" : "Puikus tempas! Prisijungei:"}
        </p>

        <div className="mb-6">
          <span
            className="text-[80px] font-bold uppercase"
            style={{
              fontFamily: "mango, sans-serif",
              lineHeight: "80%",
              letterSpacing: "-0.01em"
            }}
          >
            {streakDays} {streakDays === 1 ? "diena" : "dienų"}
          </span>
        </div>

        {/* Flame icon - absolute positioned */}
        <div className="absolute top-4 right-4">
          <svg width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37 74C57.4345 74 74 57.4345 74 37C74 16.5655 57.4345 0 37 0C16.5655 0 0 16.5655 0 37C0 57.4345 16.5655 74 37 74Z" fill="#60988E"/>
            <path d="M43.2469 13.1152L27.0003 29.3618L22.7602 25.1217L18.7539 32.2656L32.8613 46.373L21.2456 57.9887L37.2533 73.9964C55.4169 73.8746 70.4708 60.6666 73.4593 43.3278L43.2469 13.1152Z" fill="#315E56"/>
            <path d="M30.3955 9.18636C31.1543 9.86653 33.3999 12.0575 33.698 15.4245C33.7638 16.1665 33.8206 17.8267 32.6703 20.3914C31.0233 24.0635 29.0687 24.7749 27.2032 27.4966C26.0413 29.1917 24.7709 31.8753 24.5768 36.0784C24.08 35.0046 23.5806 33.6873 23.2139 32.1469C22.5425 29.3261 22.7596 25.1209 22.7589 25.1219C17.8547 29.2087 14.7305 35.3637 14.7305 42.2467C14.7305 54.551 24.705 64.5256 37.0094 64.5256L40.3858 39.4852L37.0092 9.50476C33.9787 8.68267 31.3568 9.02723 30.3955 9.18636Z" fill="#FF6C52"/>
            <path d="M58.3599 48.6263C59.5305 40.9777 54.5864 34.8636 53.461 33.5359C53.3931 33.9369 53.1461 35.071 52.1506 35.9473C52.0134 36.068 50.4661 37.3906 48.9005 36.8385C48.7246 36.7765 47.8382 36.4402 47.1706 35.0561C46.0928 32.8218 46.9664 30.7199 47.4065 28.0841C47.823 25.5896 47.6937 23.5011 47.6377 22.6614C47.3888 18.9205 45.3083 14.0128 40.8277 11.1784C39.5434 10.3659 38.2429 9.83933 37.0098 9.50488V64.5255C46.2244 64.5255 56.8577 58.4429 58.3599 48.6263Z" fill="#FF432E"/>
            <path d="M34.9226 33.4142C33.9696 34.677 30.182 39.6954 31.3514 44.9559C31.8737 47.3053 33.3093 49.3161 32.4449 50.1631C31.9929 50.6059 31.1957 50.5312 30.7289 50.3635C29.726 50.0035 29.005 48.7681 28.8834 47.0896C28.8416 46.5147 28.8698 45.888 28.9816 45.2262C28.2844 46.0944 27.1936 47.6907 26.6355 49.96C26.2309 51.6049 26.2475 53.029 26.3386 54.0023C26.3386 59.8962 31.1167 64.6743 37.0106 64.6743L39.6754 49.8304L37.0108 31.1094C36.3032 31.7642 35.5935 32.5255 34.9226 33.4142Z" fill="#FDE975"/>
            <path d="M47.6818 54.0018C47.6818 53.2361 47.5538 52.35 47.5538 52.35C47.3195 50.7393 46.7338 48.9525 45.1962 46.5537C43.1823 43.412 42.595 43.994 41.3519 41.731C39.8927 39.0745 39.7411 36.5236 39.6791 35.2512C39.531 32.2136 40.2545 29.8041 40.7929 28.416C39.7371 28.9817 38.3773 29.843 37.0098 31.1086V64.6739C42.9037 64.6739 47.6818 59.8958 47.6818 54.0018Z" fill="#FCC64C"/>
          </svg>
        </div>

        <p
          className="text-[13px] font-normal text-[#EFEFEF]"
          style={{ fontFamily: "Outfit, sans-serif", lineHeight: "120%" }}
        >
          Liko {daysUntilAchievement} dienos iki „{achievementName}" pasiekimo!
        </p>
      </div>
    </div>
  );
}
