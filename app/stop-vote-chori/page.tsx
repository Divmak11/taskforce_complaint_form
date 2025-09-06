"use client";

import Image from "next/image";
import Link from "next/link";
import bgImage from "../assets/bg.png";
import logo from "../assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StopVoteChoriPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    hi: {
      header: "स्टॉप वोट चोरी",
      titleMain: "स्टॉप वोट चोरी — भारत में लोकतंत्र बचाओ",
      intro:
        "देशभर में हुए चुनाव में धांधली की खबरों और अनियमितताओं की आशंकाओं के बीच, इसे रोकना ही आज का राष्ट्र धर्म है। जनता के मत को बचाने और संविधान पर हो रहे हमलों को रोकने के लिए हमारी टीम बनी है। इस अभियान से आज देशभर के युवा, नागरिक और मानवाधिकार संगठन जुड़ चुके हैं। कई जगहों पर जनता को ही साबित करना पड़ रहा है कि वह 'वोटर' है। इसलिए बेहद ज़रूरी है कि आप चुनाव प्रक्रिया पर निगाह बनाए रखें और कोई भी असंवैधानिक काम न होने दें।",
      whyTitle: "क्यों ज़रूरी है यह अभियान?",
      whyPara:
        "आज जब राजनीति में ऐसे नेता सक्रिय हैं जो खुलेआम चुनावी क़ानूनों का उल्लंघन कर रहे हैं और मतदाता पर ही यह बोझ डाल रहे हैं कि वह साबित करे कि “मैं वोटर हूँ”, तो यह लोकतंत्र के लिए ख़तरे की घंटी है।",
      standsTitle: "स्टॉप वोट चोरी अभियान यह संदेश देता है कि—",
      bullets: [
        "हर वोट की रक्षा जनता करेगी।",
        "हर गलती, हर गड़बड़ी पर सवाल उठेगा।",
        "और हर नागरिक लोकतंत्र का प्रहरी बनेगा।",
      ],
      joinTitle: "आप कैसे जुड़ें?",
      joinBullets: [
        "यदि आप वकील हैं, तो हमारे Legal Taskforce से जुड़ें और जनता की आवाज़ को कानूनी ताकत दें।",
        "यदि आप नागरिक हैं, तो अपनी देखी-सुनी हर चुनावी गड़बड़ी की रिपोर्ट दर्ज करें।",
        "आपकी शिकायत हमारी टीम तक पहुँचेगी और हर मामले की गंभीरता से जाँच होगी।",
      ],
      closing:
        "लोकतंत्र की सबसे बड़ी ताकत जनता का वोट है। अगर वोट ही चोरी हो जाए, तो लोकतंत्र सिर्फ एक दिखावा रह जाएगा।",
      ctaLegal: "लीगल टीम से जुड़ें →",
      ctaElectoral: "कंप्लेंट करे →",
    },
    en: {
      header: "Stop Vote Chori",
      titleMain: "StopVoteChori — Save Democracy in India",
      intro:
        "Recent elections have shown how fragile the mandate can be. Across India, youth, citizens and human-rights groups have rallied behind this campaign to protect the vote and the Constitution. When politics bends rules and people are forced to prove they are 'voters', it is a clear warning for our democracy. This is why StopVoteChori was born — a people's campaign to defend every vote.",
      whyTitle: "Why is this campaign necessary?",
      whyPara:
        "When leaders openly flout electoral laws and push the burden on voters to prove they are ‘voters’, it rings an alarm for democracy.",
      standsTitle: "StopVoteChori stands for —",
      bullets: [
        "People will protect every vote.",
        "We will question every mistake and malpractice.",
        "Every citizen will be a sentinel of democracy.",
      ],
      joinTitle: "How can you join?",
      joinBullets: [
        "If you are a lawyer, join our Legal Taskforce and give people’s voice legal strength.",
        "If you are a citizen, report any malpractice or irregularity you witness.",
        "Our team will receive your complaint and investigate every case with seriousness.",
      ],
      closing:
        "The greatest strength of democracy is the people’s vote. If votes are stolen, democracy becomes a mere show.",
      ctaLegal: "Join Legal Team →",
      ctaElectoral: "File Complaint →",
    },
  } as const;

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image src={bgImage} alt="Background" fill className="object-cover" priority />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <Link href="/" className="flex items-center" aria-label={language === "hi" ? "होम पेज" : "Home"}>
            <Image src={logo} alt="Stop Vote Chori" width={200} height={50} className="h-10 md:h-12 w-auto" />
          </Link>
          <button
            onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
            className="px-4 py-2 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors"
          >
            {language === "hi" ? "हिंदी" : "English"}
          </button>
        </header>

        {/* Main */}
        <main className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            {/* Title card */}
            <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-xl text-black">
              <div className="absolute -top-20 -right-24 h-52 w-52 rounded-full bg-[#AD1818]/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#AD1818]/10 blur-2xl" />
              <div className="relative p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-black">{t.titleMain}</h2>
                <p className="text-black leading-relaxed md:text-lg">{t.intro}</p>
              </div>
            </section>

            {/* Why card */}
            <section className="rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-lg p-6 md:p-10 text-black">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-black">{t.whyTitle}</h3>
              <p className="md:text-lg leading-relaxed text-black">{t.whyPara}</p>
            </section>

            {/* Stands card */}
            <section className="rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-lg p-6 md:p-10 text-black">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-black">{t.standsTitle}</h3>
              <ul className="space-y-3 md:space-y-4 text-black">
                {t.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#AD1818]"></span>
                    <span className="md:text-lg">{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Join card */}
            <section className="rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-lg p-6 md:p-10 text-black">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-black">{t.joinTitle}</h3>
              <ul className="space-y-3 md:space-y-4 text-black mb-6">
                {t.joinBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#AD1818]"></span>
                    <span className="md:text-lg">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/legal-taskforce"
                  className="inline-block px-6 py-3 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors text-center"
                >
                  {t.ctaElectoral}
                </Link>
                <Link
                  href="/electoral-democracy"
                  className="inline-block px-6 py-3 rounded-lg font-bold text-[#AD1818] border-2 border-[#AD1818] bg-white hover:bg-[#ad18180d] transition-colors text-center"
                >
                  {t.ctaLegal}
                </Link>
              </div>
            </section>

            {/* Closing note */}
            <section className="rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-sm shadow-lg p-6 md:p-10 text-black">
              <p className="md:text-lg leading-relaxed text-black">{t.closing}</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
