// 學生推薦的單一資料來源（原本存於 DB，已改為靜態檔維護）。
// 欄位對齊原 Prisma Testimonial model。

export interface Testimonial {
  id: string; // React key 用的穩定字串
  name: string;
  title: string; // 一句話的自我描述
  imageUrl: string;
  danceStyle: string;
  content: string[]; // 多段心得
  sortOrder: number;
  published: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'dora',
    name: 'Dora',
    title: '核心沒力的跳舞小白',
    imageUrl: '/testimonials/dora.png',
    danceStyle: 'Bachata',
    content: [
      '前年第一次接觸 Bachata 時感受到跳舞時的快樂氛圍，開始學習以後才體驗到「會跳舞」的快樂！',
      '從不太敢跳，到現在可以自在地在舞會裡接受邀舞，最大的關鍵就是——老師的教學真的很給力！課程安排循序漸進，老師會調整步調一起學習，面對學生的問題也有問必答。',
    ],
    sortOrder: 0,
    published: true,
  },
  {
    id: 'nora',
    name: 'Nora',
    title: '和男友一起來上課的女友',
    imageUrl: '/testimonials/nora.jpg',
    danceStyle: 'Bachata & Salsa',
    content: [
      '原本抱持陪男友上課的心態，結果發現在party上跟很多leader跳舞超好玩，0基礎也可以很開心。',
      '很幸運可以在台南找到長期上課進修的教室，老師們都很細心還很幽默^^推推',
    ],
    sortOrder: 1,
    published: true,
  },
  {
    id: 'emma',
    name: 'Emma',
    title: '更擅長跳夜店舞的女子',
    imageUrl: '/testimonials/emma.png',
    danceStyle: 'Bachata & Salsa',
    content: [
      '在一次的派對上不小心入坑Bachata、Salsa後，我的世界從此變得好不一樣，是跳舞帶我找回了我自己，讓我想起了自己小時候是多麼喜歡跳舞。',
      '在每一次的卡關都讓我更認識自己的身體，每一次突破瓶頸後發現自己真的做得到的成就感也讓我好滿足，可以活在自己的熱愛裡是多麼美妙的一件事，也因為跳舞讓我認識了一群很棒的朋友們~真的超幸福的~',
    ],
    sortOrder: 2,
    published: true,
  },
  {
    id: 'jingjing',
    name: '靜靜',
    title: '熟了後是吵吵女紙',
    imageUrl: '/testimonials/jingjing.png',
    danceStyle: 'Bachata & Salsa',
    content: [
      '你問我跳舞是什麼？大概就是「跳出自我，舞出自信」',
      '因為一次的失戀開啟了我的跳舞人生，從有鏡頭恐懼症到能夠自信的面對攝影機，跳舞不僅讓我找回自我，更讓我擁有了一群可以互相交流舞蹈也能深度聊天的好朋友！',
      '開始跳舞到現在一年多，為什麼能夠一直堅持，可能是因為這裡讓我感受到前所未有的熱情及溫暖，嘛最大的原因可能是因為老師很帥啦哈哈哈哈哈！',
      '「如果對於自己沒有自信，那就來跳舞吧！」每一次的舞動都是跟自己身體的對話，在對話中找尋適合自己的溝通方式，自信就會自然而然由內而外散發！',
    ],
    sortOrder: 3,
    published: true,
  },
  {
    id: 'charlene',
    name: '巧巧',
    title: '笑點低的舞池狂熱份子',
    imageUrl: '/testimonials/charlene.png',
    danceStyle: 'Bachata & Salsa',
    content: [
      '我很喜歡雙人舞那種「不知道下一秒會發生什麼」的即興與挑戰感：一邊讀懂彼此的訊號，一邊把自己跳得美美的。不用尬聊，光靠音樂與身體就能交流。對愛湊熱鬧但偶爾需要安靜充電的E人來說，真的是一種很棒的享受。現在只差一件事：缺Leader陪我練酷酷招！',
    ],
    sortOrder: 4,
    published: true,
  },
];

export function getPublishedTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.published).sort((a, b) => a.sortOrder - b.sortOrder);
}
