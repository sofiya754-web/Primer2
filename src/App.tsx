import { BackgroundVideo } from './components/BackgroundVideo';

const SECTIONS = [
  {
    id: 'section-01',
    num: '01',
    title: 'ВКУС, КОТОРЫЙ МЕНЯЕТ ПРАВИЛА',
    description: 'Забудьте все, что вы знали о лапше. Откройте три новых формата для каждого момента дня.',
    align: 'items-start justify-center text-left pl-6 md:pl-20',
    descAlign: 'text-left mr-auto',
    accent: '#F2D06B', // Mustard Gold
    tagColor: 'text-[#F2D06B]',
  },
  {
    id: 'section-02',
    num: '02',
    title: 'ДЛЯ ТЕХ, КТО ЛЮБИТ ПОГОРЯЧЕЕ',
    description: 'Обжигающая пикантность, насыщенный соус и чистый состав.',
    align: 'items-end justify-center text-right pr-6 md:pr-20',
    descAlign: 'text-right ml-auto',
    accent: '#C8553D', // Terracotta
    tagColor: 'text-[#C8553D]',
  },
  {
    id: 'section-03',
    num: '03',
    title: 'РАМЕН РЕСТОРАННОГО УРОВНЯ',
    description: 'Благодаря инновационной технологии лапша сохраняет упругость и плотность свежеприготовленного блюда от шефа.',
    align: 'items-center justify-center text-center px-6',
    descAlign: 'text-center mx-auto',
    accent: '#A8D0C8', // Muted Teal
    tagColor: 'text-[#A8D0C8]',
  },
  {
    id: 'section-04',
    num: '04',
    title: 'МОЩНЫЙ ЗАРЯД ЗА 3 МИНУТЫ',
    description: '18 г белка, максимум топпингов и аутентичные вкусы Азии, когда некогда ждать.',
    align: 'items-start justify-center text-left pl-6 md:pl-20',
    descAlign: 'text-left mr-auto',
    accent: '#F2D06B', // Mustard Gold
    tagColor: 'text-[#F2D06B]',
  },
  {
    id: 'section-05',
    num: '05',
    title: 'ДО ДНА',
    description: 'Пар осел. Чаша сияет. Никаких остатков — только идеальный бульон до последней капли.',
    align: 'items-center justify-center text-center px-6',
    descAlign: 'text-center mx-auto',
    accent: '#C8553D', // Terracotta
    tagColor: 'text-[#C8553D]',
  },
];

export default function App() {
  const videoSource =
    'https://res.cloudinary.com/puoki5qm/video/upload/v1787230137/video-output-66B1D3D9-78DE-4E8B-9957-65F078836810-1.mp4';

  return (
    <main id="app-root" className="relative min-h-screen text-neutral-100 selection:bg-[#C8553D] selection:text-white font-body">
      {/* Scroll-driven background video */}
      <BackgroundVideo src={videoSource} />

      {/* 5 Minimalist Sections */}
      <div className="relative z-10 flex flex-col">
        {SECTIONS.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`min-h-screen w-full flex flex-col ${section.align} py-24 select-none`}
          >
            <div className="max-w-xl mx-4 sm:mx-8">
              <h1
                id={`heading-${section.num}`}
                className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[0.92] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              >
                {section.title}
              </h1>

              <p
                id={`desc-${section.num}`}
                className={`font-body mt-4 text-base sm:text-lg md:text-xl text-neutral-100 font-normal leading-relaxed max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] ${section.descAlign}`}
              >
                {section.description}
              </p>
            </div>

            {/* Subtle scroll cue on the first section */}
            {index === 0 && (
              <div
                id="scroll-cue"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-80 animate-pulse pointer-events-none"
              >
                <span className="font-label text-[11px] tracking-[0.35em] text-[#A8D0C8]">
                  ПРОКРУТИТЕ ВНИЗ
                </span>
                <div className="w-[1px] h-6 bg-gradient-to-b from-[#A8D0C8] to-transparent" />
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
