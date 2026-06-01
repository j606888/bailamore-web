export type Teacher = {
  name: string
  title?: string
  image: string
  skills: string[]
  instagram?: string
  courses: string[]
  description: string[]
  videos: string[]
}

export const TEACHERS: Record<string, Teacher> = {
  sean: {
    name: 'Sean',
    title: "Baila'more創辦人",
    image: '/teachers/Sean.jpg',
    skills: ['Bachata', 'Salsa', 'Zouk'],
    instagram: 'baila_moredancestudio',
    courses: ['Bachata Lv1', 'Bachata Lv2', 'Bachata 進階'],
    description: [
      "Sean 擁有二年的拉丁舞教學與表演經驗，專精於 Salsa 與 Bachata，風格融合熱情、音樂性與舞台魅力。曾多次參與國內外拉丁舞活動與工作坊，不僅擁有紮實的技術基礎，更擅長引導學員掌握節奏與身體表達。",
      "他創辦 Baila'more 拉丁社交舞學校，致力於推廣「愛跳舞、多跳舞」的理念，讓每位舞者在歡樂中找到自信與自由。Sean 教學風格親切細膩，擅長拆解動作，激發學員的學習熱情與音樂感，無論是初學者或進階者都能有所收穫。",
      "舞蹈對 Sean 而言不只是技藝，更是連結人與人之間的橋樑，歡迎一起進入這個充滿熱情與愛的舞蹈世界！",
    ],
    videos: [
      "https://www.youtube.com/embed/TdRV1NkV4Pg?si=MYwpQG-1ZlcPu1QD",
      "https://www.youtube.com/embed/AE5NriBseoY?si=5u75-CtAGmvwPtVn",
    ],
  },
}
