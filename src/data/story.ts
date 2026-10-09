// /story 品牌故事的文案（來源：Google Doc「Baila'more｜品牌故事」第一、二章）。
// 每個字串是一段；段內的 \n 是原文的短句換行，頁面用 whitespace-pre-line 保留。

export type StoryBlock = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
};

export const NAME_INTRO = [
  "Baila'more，不是一個突然被創造出來的名字。",
  '它藏著三個我們想留下的字：',
];

export const NAME_WORDS: StoryBlock[] = [
  {
    title: 'Bailar',
    subtitle: '跳舞',
    paragraphs: [
      '是我們最初相遇的方式。',
      '一首歌、一個舞步、一個伸出的手，讓原本不認識的人，在舞池裡有了交集。',
    ],
  },
  {
    title: 'Amor',
    subtitle: '愛',
    paragraphs: [
      '愛跳舞，也愛那些因為跳舞而遇見的人。',
      '有時候是對舞蹈的熱愛，有時候是對舞伴的信任，有時候只是跳完一首舞之後，突然覺得——',
      '「啊，今天來的真好。」',
    ],
  },
  {
    title: 'More',
    subtitle: '更多',
    paragraphs: ['多跳一首、多認識一個人、多笑一次、多勇敢一點，也多喜歡自己一點。'],
  },
];

// 名字章節的收尾：NAME_WORDS 三個字相加 → Baila'more。
export const NAME_RESULT = "成為了 Baila'more。";
export const NAME_MEANING = '它不只是「跳更多」。\n而是因為愛上跳舞，所以想要更多。';

// 頁面以「More」小標＋後半句呈現：More dance. / More love. / …
export const NAME_TAGLINE = ['dance.', 'love.', 'connection.', 'of yourself.'];

export const LOGOTYPE_INTRO = ['如果名字代表我們相信什麼，\n那麼標準字，就是把這份相信變成看得見的樣子。'];

export const LOGOTYPE_LETTERS: (StoryBlock & { letter: string })[] = [
  {
    letter: 'I',
    title: '不能斷掉的 Connection',
    paragraphs: [
      '字母之間的連結，就像舞池裡的人與人。',
      '你可能來自完全不同的地方、擁有完全不同的故事，\n但一首歌開始之後，\n我們就有了連結。',
      'Never disconnected.',
      "因為 Baila'more 最重要的事情之一，\n從來不是「一個人跳得多好」，\n而是：我們怎麼遇見彼此。",
    ],
  },
  {
    letter: 'O',
    title: '重心往下的 O',
    paragraphs: [
      'O 像一個圓。\n也是一個舞池。\n所有人都可以進來。',
      '它的重心往下，不是要它變得沉重，\n而是提醒我們：\n不管跳得多高、多瘋、多開心，永遠都可以回到自己。',
      '有自己的節奏。\n有自己的重心。\n有自己的位置。',
    ],
  },
  {
    letter: 'R',
    title: '新的小腳 R',
    paragraphs: [
      "R 的小腳，像是一個正在往前走的動作。\n因為 Baila'more 從來不是一個停在原地的名字。",
      '今天跳完這首，\n還有下一首。\n今天認識一個人，\n還有下一個故事。',
      'Keep moving.\nKeep dancing.',
    ],
  },
];
