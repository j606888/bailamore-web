const WhoWeAre = () => {
  return (
    <section className="py-8 bg-slate-50 md:py-16 ">
      <div className="md:flex md:flex-row-reverse md:max-w-7xl md:mx-auto">
        <div className="mx-auto px-5 mb-4 md:flex md:flex-col md:justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center md:text-left md:text-3xl">
            我們是誰
          </h2>
          <div className="space-y-4 text-base text-gray-700">
            <p>
              我們是 Baila’more Studio，一群愛跳舞的朋友，現在也是一間想把熱情傳出去的舞蹈教室！
            </p>
            <p>
              想讓 Bachata 和 Salsa 這兩種來自拉丁美洲的社交舞，在台南也能跳起來、熱鬧起來。
            </p>
            <p>
              不用擔心有沒有舞伴、有沒有經驗，只要你願意踏出第一步，我們就一起從音樂開始搖擺！
            </p>
          </div>
        </div>
        <div className="mx-auto px-5 md:px-6 lg:px-8 ">
          <img src="/images/who-we-are.jpg" alt="who we are" />
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre; 