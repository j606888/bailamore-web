// /merch 周邊商品（來源：Google Doc「Baila'more｜品牌故事」第三章以後）。
// 每個字串是一段；段內的 \n 是原文的短句換行，頁面用 whitespace-pre-line 保留。
//
// 商品照與購買連結還沒好：
// - imageUrl 留 '' → 顯示「商品照即將上線」的灰底 placeholder
// - buyUrl 留 '' → 購買按鈕顯示為停用的「即將開賣」

export type MerchItem = {
  slug: string;
  name: string;
  emoji?: string;
  lines: string[];
  imageUrl: string;
  buyUrl: string;
};

export type MerchChapter = {
  slug: string;
  eyebrow: string;
  title: string;
  intro?: string[];
  items: MerchItem[];
  outro?: string[];
};

export const MERCH_CHAPTERS: MerchChapter[] = [
  {
    slug: 'first-chapter',
    eyebrow: '第一部曲',
    title: '我們先學會，放心地跳',
    intro: ["Baila'more 最早出現的周邊，\n其實就是我們最早想告訴大家的三件事。"],
    items: [
      {
        slug: 'no-anxiety',
        name: '不焦綠',
        lines: [
          '第一次跳不會怎樣。\n跳錯不會怎樣。\n記不起來也不會怎樣。',
          '舞池不是考場。',
          '我們希望你可以帶著一點不完美進來，\n然後在音樂裡慢慢找到自己的節奏。',
        ],
        imageUrl: '/merch/no-anxiety.jpg',
        buyUrl: '',
      },
      {
        slug: 'more-fans',
        name: '狂漲粉',
        lines: [
          '一個人來跳舞，\n最後可能認識十個人。\n十個人又會帶來更多人。',
          '於是我們開始發現：\n原來跳舞不只是學會一個舞步，\n它也讓我們的世界越來越大。',
          '狂漲粉。\n漲的不只是社群上的粉絲，\n也是一起跳舞的人。',
        ],
        imageUrl: '/merch/more-fans.jpg',
        buyUrl: '',
      },
      {
        slug: 'humidity-control',
        name: '濕度管理',
        lines: [
          '至於這個……\n很簡單。',
          '跳舞會流汗。\n所以需要濕度管理。🤣',
          "但某種程度上，它也是 Baila'more 最真實的樣子：\n我們可以談愛、談連結、談自我，\n但最後還是要回到舞池裡，\n跳到滿頭大汗。",
          'For bailar.',
        ],
        imageUrl: '/merch/humidity-control.jpg',
        buyUrl: '',
      },
    ],
  },
  {
    slug: 'two-years',
    eyebrow: '兩週年',
    title: '跳舞教會我的三件事',
    intro: [
      '兩年之後，我們回頭看。\n發現跳舞教會我們的，\n好像已經不只是舞步。',
      '它慢慢教會我們三件關於自己的事情。',
    ],
    items: [
      {
        slug: 'pink',
        name: '第一課：粉口愛',
        emoji: '💗',
        lines: [
          '有愛的視角，是包容。',
          '跳舞之後，你會遇見很多不同的人。\n不同的身體、不同的程度、不同的性格、不同的生活。',
          '你會慢慢發現：\n世界上沒有一個「標準的人」。',
          '所以我們開始學會用有愛的眼光看自己，\n也看別人。',
          '不急著比較。\n不急著評價。\n允許每個人用自己的方式存在。',
          '因為你不需要變成誰，\n才值得被喜歡。',
          '你本來就粉口愛。',
        ],
        imageUrl: '/merch/pink.jpg',
        buyUrl: '',
      },
      {
        slug: 'orange',
        name: '第二課：不焦橘',
        emoji: '🧡',
        lines: [
          '每個人的時區都不一樣。',
          '有人很快學會。\n有人需要多一點時間。\n有人跳舞很早開始，\n有人工作很多年才第一次走進舞池。',
          '有人正在努力學習，\n有人正在換工作，\n有人正在找自己，\n有人只是單純想好好跳舞。',
          '學習是。\n工作是。\n人生是。\n跳舞也是。',
          '沒有必要拿別人的進度，\n衡量自己的速度。',
          '所以：\n不焦橘。\n你的時區沒有錯。',
        ],
        imageUrl: '/merch/orange.jpg',
        buyUrl: '',
      },
      {
        slug: 'purple',
        name: '第三課：這樣紫',
        emoji: '💜',
        lines: [
          '你原始的自己，就是漂亮的樣紫。',
          '跳久了，你會開始知道：\n原來每個人的舞都有自己的樣子。',
          '有人大。\n有人小。\n有人性感。\n有人可愛。\n有人力量很強。\n有人細膩得不得了。\n有人一上舞池就像太陽。\n有人安安靜靜，也很好看。',
          '所以我們不想把你變成「標準答案」。\n我們更希望你慢慢找到：\n最舒服、最喜歡的自己。',
          '然後告訴你：我們就喜歡你這樣紫。',
        ],
        imageUrl: '',
        buyUrl: '',
      },
    ],
  },
  {
    slug: 'day-and-night',
    eyebrow: '番外篇',
    title: '如果白天與黑夜都想跳舞',
    intro: ['兩週年之外，\n我們還想留下兩個小小的彩蛋。'],
    items: [
      {
        slug: 'gold-dance',
        name: '金天跳舞',
        emoji: '☀️',
        lines: ['有太陽的時候，\n今天就跳舞。'],
        imageUrl: '',
        buyUrl: '',
      },
      {
        slug: 'silver-dance',
        name: '銀該跳舞',
        emoji: '🌙',
        lines: ['天黑了，\n也應該跳舞。'],
        imageUrl: '',
        buyUrl: '',
      },
    ],
    outro: [
      '白天也好，黑夜也好，\n想跳舞的時候，就去跳吧。',
      '所以帽子不只是帽子。\n它可以是你跳舞時的配件，\n也可以是你走進舞池之前，\n帶著的那一點點自信。',
      "戴上它。\n讓 Baila'more 陪你走進下一個舞池。\n給你滿滿的 Logo，\n也給你滿滿的 support。",
    ],
  },
  {
    slug: 'vamos',
    eyebrow: 'VAMOS',
    title: "把 Baila'more 帶去更遠的地方",
    items: [
      {
        slug: 'drawstring-bag',
        name: 'VAMOS 束口袋',
        lines: [
          "如果說帽子是陪你走進舞池，\n那麼束口袋，就是讓你把整個 Baila'more 帶著走。",
          '我們選擇黑色，\n因為黑色可以容納所有色彩。',
          '就像舞池。\n來自四面八方的人，\n帶著完全不同的顏色，\n最後在同一首歌裡相遇。',
          "所以我們把 Baila'more 的 Logo 滿滿地放上去。\n因為每一個 B，\n都可以有不同的故事：",
          "B for Bachata.\n因為這是我們相遇的舞。\nB for Bailar.\n因為我們為了跳舞而來。\nB for Baila'more.\n因為這是讓我們聚在一起的名字。\nB for Be with you.\n因為跳舞從來不只是一個人的事。\nB for Be yourself.\n因為你可以成為最舒服、最喜歡的自己。",
          '黑色承載所有色彩，\nLogo 承載所有故事。',
          '而我們希望你帶著它，\n去不同的城市、不同的舞會、不同的舞池，\n遇見更多喜歡跳舞的人。',
        ],
        imageUrl: '/merch/drawstring-bag.jpg',
        buyUrl: '',
      },
    ],
  },
  {
    slug: 'rrrrrr',
    eyebrow: 'RRRRRR!',
    title: 'R級讚賞',
    items: [
      {
        slug: 'r-socks',
        name: 'R級讚賞襪',
        lines: [
          '還記得標準字裡那個有自己小腳的 R 嗎？\n當初，我們替它設計了一個不太一樣的樣子。\n而這一次，我們決定讓它發出聲音。',
          '在西班牙文裡，彈舌音有一種很鮮明的節奏感。\n而在舞池裡，當有人跳出一個超帥的動作、踩中一個漂亮的節拍，或是做出讓全場驚呼的表現時——\n有些讚美，已經不是一句「好棒」就能表達的了。',
          '這時候，就該來一聲：\nRRRRRRRRRRR！',
          '於是，我們把那個有自己小腳的 R，放上了襪子。\n希望每一個穿上它的人，都能成為那個值得被大聲喝采的人。',
          '不管你是舞池裡的大師，\n還是才剛開始學習的新手；\n不管你今天跳出了一個驚人的動作，\n還是終於鼓起勇氣邀請別人跳舞。',
          '每一次突破、每一點進步，\n每一個願意走進舞池、展現自己的瞬間，\n都值得被看見，也值得被喝采。',
          '畢竟，跳舞不是為了成為全場最厲害的人。\n而是當我們越來越自在地做自己，\n也越來越懂得欣賞別人時，\n這個舞池，就會變得更有意思。',
          '所以，穿上它吧。\n跳出你的風格，\n找到你的節奏，\n然後大方地為自己驕傲，\n也別忘了為身邊的人喝采。',
          'RRRRRR!\nR級讚賞，送給每一個值得被喝采的你。',
        ],
        imageUrl: '/merch/r-socks.jpg',
        buyUrl: '',
      },
    ],
  },
];

// 頁尾（原文第八章與結尾）。版面是「左：提問、右：它讓我們 01–06」＋淺 teal 收尾帶。
export const MERCH_CLOSING = {
  title: "所以，Baila'more\n到底想說什麼？",
  before: '也許兩年前，我們只是想讓大家有一個地方跳舞。',
  // 'More' 會以主色強調
  after: '但兩年後才發現，舞蹈帶來的 More，遠比舞步更多。',
  lessons: [
    '遇見人。',
    '學會愛。',
    '學會包容。',
    '學會不跟別人的時區比較。',
    '學會喜歡原本的自己。',
    '也學會在看見別人發光的時候，\n不吝嗇地送上一聲喝采。',
  ],
  cheer: 'RRRRRRRRRRR!',
  words: [
    { word: 'Bailar', line: '從跳舞開始。', more: '更多舞蹈' },
    { word: 'Amor', line: '因為愛而留下。', more: '更多連結' },
    { word: 'More', line: '然後，擁有更多。', more: '更多自己' },
  ],
  gift: '而兩週年，我們只是把這些一路走來的故事，\n做成了可以穿、可以戴、可以帶著走的東西。',
  forLines: ['For bailar.', 'For yourself.', 'For everyone you meet along the way.'],
  send: "把舞鞋帶上。把自己帶出去。\n把 Baila'more 帶去下一個地方。",
  sign: "Baila'more. 💃🖤",
};
